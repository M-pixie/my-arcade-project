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

    // ✅ Browser Launch Logic (Vercel Compatible)
    const isLocal = process.env.NODE_ENV === 'development';

    browser = await puppeteer.launch({
      args: isLocal ? puppeteer.defaultArgs() : chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: isLocal
        ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" // ⚠️ Local Testing ke liye apna path check kar lena
        : await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();

    // ✅ Request Interception (Jo tumne code diya tha wahi logic)
    // Images/Fonts block kar rahe hain speed ke liye
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        const type = req.resourceType();
        if (type === 'image' || type === 'font' || type === 'stylesheet') {
            req.abort();
        } else {
            req.continue();
        }
    });

    // ✅ Page Load
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    // 🔥 Tumhara Main Logic (Evaluated inside browser)
    const result = await page.evaluate(() => {
      // 1. Name Logic
      let userName = "Unknown User";
      const h1 = document.querySelector('h1');
      const classEl = document.querySelector('.ql-display-small');
      
      if (h1) {
          userName = (h1 as HTMLElement).innerText.trim();
      } else if (classEl) {
          userName = (classEl as HTMLElement).innerText.trim();
      }

      // 2. Avatar Logic
      let userAvatar = null;
      const avatarEl = document.querySelector('ql-avatar');
      if (avatarEl) {
          userAvatar = avatarEl.getAttribute('src') || avatarEl.querySelector('img')?.src || null;
      }

      // 3. Points Logic
      const cards = document.querySelectorAll('.profile-badge');
      let trivia = 0, games = 0, skills = 0;

      cards.forEach((card) => {
          const title = (card.querySelector('.ql-title-medium') as HTMLElement)?.innerText || '';
          const date = (card.querySelector('.ql-body-medium') as HTMLElement)?.innerText || '';

          if (!date.includes('2026')) return;
          if (/Jan (1|2|3|4),/.test(date)) return;

          const t = title.toLowerCase();
          
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
    return NextResponse.json(result);

  } catch (e: any) {
    console.error("Scraping Error:", e.message);
    if (browser) await browser.close();
    return NextResponse.json({
        totalPoints: 0,
        breakdown: { trivia: 0, games: 0, skills: 0 },
        userName: null,
        userAvatar: null,
        error: "Failed to scrape"
    }, { status: 500 });
  }
}