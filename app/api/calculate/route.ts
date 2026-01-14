import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let browser;
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const isLocal = process.env.NODE_ENV === 'development';

    browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // ⚠️ Windows Path (Make sure ye sahi ho)
        : await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // 👇 ✅ YE HAI MAGIC LINE (Google ko ullu banane ke liye)
    // Isse Google ko lagega ki ye asli Chrome browser hai
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    // Optimization: Images aur Fonts block kar rahe hain taaki speed tez ho
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'font', 'stylesheet', 'media'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    // ⏳ Timeout badha diya (60s) aur wait condition 'domcontentloaded' kar di (Tez chalega)
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Selector ka wait karenge
    try { await page.waitForSelector('.ql-display-small', { timeout: 6000 }); } catch (e) {}

    const data = await page.evaluate(() => {
        // Name nikaalo
        const nameEl = document.querySelector('.ql-display-small') || document.querySelector('h1');
        const userName = nameEl ? (nameEl as HTMLElement).innerText.trim() : "Unknown User";

        // Avatar nikaalo
        let userAvatar = null;
        const avatarContainer = document.querySelector('ql-avatar');
        if (avatarContainer) {
            userAvatar = avatarContainer.getAttribute('src') || avatarContainer.querySelector('img')?.src;
        }

        // Badges Count karo
        const cards = document.querySelectorAll('.profile-badge');
        let trivia = 0, games = 0, skills = 0;

        cards.forEach((card) => {
            const dateEl = card.querySelector('.ql-body-medium') as HTMLElement;
            const date = dateEl ? dateEl.innerText : '';
            
            // 📅 DATE CHECK (2026 logic)
            // Agar date me 2026 nahi hai, toh skip karo
            if (!date.includes('2026')) return;
            
            // Agar January ke shuru ke din hain (Arcade start hone se pehle), toh skip karo
            // (Ye logic tumne lagaya tha, maine waisa hi rakha hai)
            if (/Jan (1|2|3|4),/.test(date)) return;

            const titleEl = card.querySelector('.ql-title-medium') as HTMLElement;
            const t = titleEl ? titleEl.innerText.toLowerCase() : '';

            if (t.includes('trivia')) trivia++;
            else if (t.includes('game') || t.includes('level') || t.includes('monsoon')) games++;
            else if (t.includes('skill badge')) skills++;
        });

        return {
            totalPoints: trivia + games + Math.floor(skills / 2),
            breakdown: { trivia, games, skills },
            userName,
            userAvatar
        };
    });

    await browser.close();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("Scraping Error:", error);
    if (browser) await browser.close();
    return NextResponse.json({ error: 'Failed to scrape profile. Check URL or try again.' }, { status: 500 });
  }
}