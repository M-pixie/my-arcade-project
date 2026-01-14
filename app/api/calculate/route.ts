import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium-min';
import puppeteer from 'puppeteer-core';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Timeout badhane ke liye

export async function POST(req: Request) {
  let browser;
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'URL required' }, { status: 400 });

    const isLocal = process.env.NODE_ENV === 'development';
    console.log("🚀 Starting Browser (Remote Mode)...");

    // 👇 Graphics mode off (Error prevent karne ke liye)
    chromium.setGraphicsMode = false;

    browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : [
          ...chromium.args,
          "--disable-gpu",
          "--disable-dev-shm-usage",
          "--disable-setuid-sandbox",
          "--no-sandbox",
          "--no-zygote",
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // Windows Path
        : await chromium.executablePath(
            // 👇 YE HAI MAGIC FIX: Browser Internet se download hoga
            "https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar"
          ),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // ⚡ Speed Boost: Images Block Karo
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'stylesheet', 'font', 'media'].includes(req.resourceType())) {
            req.abort();
        } else {
            req.continue();
        }
    });

    console.log("🌍 Navigating...");
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    // Selector wait
    try { await page.waitForSelector('.ql-display-small', { timeout: 6000 }); } catch (e) {}

    const data = await page.evaluate(() => {
        const nameEl = document.querySelector('.ql-display-small') || document.querySelector('h1');
        const userName = nameEl ? (nameEl as HTMLElement).innerText.trim() : "Unknown User";

        let userAvatar = null;
        const avatarEl = document.querySelector('ql-avatar');
        if (avatarEl) {
            userAvatar = avatarEl.getAttribute('src') || avatarEl.querySelector('img')?.src;
        }

        const cards = document.querySelectorAll('.profile-badge');
        let trivia = 0, games = 0, skills = 0;

        cards.forEach((card) => {
            const dateText = (card.querySelector('.ql-body-medium') as HTMLElement)?.innerText || '';
            if (!dateText.includes('2026') || /Jan (1|2|3|4),/.test(dateText)) return;

            const title = (card.querySelector('.ql-title-medium') as HTMLElement)?.innerText.toLowerCase() || '';
            if (title.includes('trivia')) trivia++;
            else if (title.includes('game') || title.includes('level')) games++;
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
    return NextResponse.json(data);

  } catch (error: any) {
    console.error("❌ ERROR:", error);
    if (browser) await browser.close();
    return NextResponse.json({ error: 'Failed to scrape.' }, { status: 500 });
  }
}