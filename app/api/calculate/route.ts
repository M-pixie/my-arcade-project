import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

// Vercel function duration badhane ki koshish (Pro plan par work karta hai, Free par 10s hi rahega)
export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let browser;
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    // Localhost check
    const isLocal = !!process.env.CHROME_EXECUTABLE_PATH; 

    console.log("🚀 Starting Browser...");

    browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : [
        ...chromium.args,
        "--hide-scrollbars",
        "--disable-web-security",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu", // GPU disable karna zaroori hai Vercel par
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // Local path
        : await chromium.executablePath(), // Vercel path
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    // ✅ User-Agent (Google ko ullu banane ke liye)
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // ⚡ SPEED UP: Images aur Fonts ko load hi mat hone do
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const resourceType = req.resourceType();
        if (['image', 'font', 'stylesheet', 'media', 'other'].includes(resourceType)) {
            req.abort();
        } else {
            req.continue();
        }
    });

    console.log("🌍 Navigating to URL...");
    
    // Timeout kam rakha hai taaki Vercel kill na kare (Wait until 'domcontentloaded' fast hota hai)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 9000 });

    console.log("👀 Looking for elements...");
    
    // Selector dhoondo (Timeout sirf 4 sec taaki jaldi error pakde)
    try { await page.waitForSelector('.ql-display-small', { timeout: 4000 }); } catch (e) { console.log("Selector timeout, trying parsing anyway..."); }

    const data = await page.evaluate(() => {
        const nameEl = document.querySelector('.ql-display-small') || document.querySelector('h1');
        const userName = nameEl ? (nameEl as HTMLElement).innerText.trim() : "Unknown User";

        let userAvatar = null;
        const avatarContainer = document.querySelector('ql-avatar');
        if (avatarContainer) {
            userAvatar = avatarContainer.getAttribute('src') || avatarContainer.querySelector('img')?.src;
        }

        const cards = document.querySelectorAll('.profile-badge');
        let trivia = 0, games = 0, skills = 0;

        cards.forEach((card) => {
            const dateText = (card.querySelector('.ql-body-medium') as HTMLElement)?.innerText || '';
            
            // 2026 logic
            if (!dateText.includes('2026')) return;
            if (/Jan (1|2|3|4),/.test(dateText)) return;

            const title = (card.querySelector('.ql-title-medium') as HTMLElement)?.innerText.toLowerCase() || '';
            
            if (title.includes('trivia')) trivia++;
            else if (title.includes('game') || title.includes('level') || title.includes('monsoon')) games++;
            else if (title.includes('skill badge')) skills++;
        });

        return {
            totalPoints: trivia + games + Math.floor(skills / 2),
            breakdown: { trivia, games, skills },
            userName,
            userAvatar
        };
    });

    await browser.close();
    console.log("✅ Success!");
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("❌ SCRAPING ERROR DETAILS:", error); // Ye Logs me dikhega
    if (browser) await browser.close();
    return NextResponse.json({ error: 'Failed to scrape profile. Check Logs.' }, { status: 500 });
  }
}