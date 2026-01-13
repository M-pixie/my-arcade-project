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
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // ⚠️ Windows Path check karlena
        : await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    // Speed badhane ke liye images block logic (Optional, but good)
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        if (['image', 'font', 'stylesheet'].includes(req.resourceType())) req.abort();
        else req.continue();
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    try { await page.waitForSelector('.ql-display-small', { timeout: 5000 }); } catch (e) {}

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
            const date = (card.querySelector('.ql-body-medium') as HTMLElement)?.innerText || '';
            if (!date.includes('2026') || /Jan (1|2|3|4),/.test(date)) return;

            const t = (card.querySelector('.ql-title-medium') as HTMLElement)?.innerText.toLowerCase() || '';
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
    return NextResponse.json({ error: 'Failed to scrape profile' }, { status: 500 });
  }
}