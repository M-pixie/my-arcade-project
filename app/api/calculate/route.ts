import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 });
    }

    console.log("🚀 Fetching Profile (Fast Mode)...");

    // 1. HTML Download karo (Bina Browser ke)
    const response = await axios.get(url, {
      headers: {
        // Google ko lagega ye asli user hai
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      }
    });

    // 2. HTML Parse karo
    const $ = cheerio.load(response.data);

    // 3. Name Dhoondo
    let userName = $('.ql-display-small').text().trim();
    if (!userName) userName = $('h1').text().trim();
    if (!userName) userName = "Arcade Player";

    // 4. Avatar Dhoondo
    let userAvatar = $('ql-avatar').attr('src');
    if (!userAvatar) userAvatar = $('ql-avatar img').attr('src');

    // 5. Badges Count Karo
    let trivia = 0;
    let games = 0; // Note: Isme ab hum POINTS count karenge (Badge count nahi)
    let skills = 0;

    // Har badge card ko check karo
    $('.profile-badge').each((index, element) => {
      const card = $(element);
      const dateText = card.find('.ql-body-medium').text();
      const title = card.find('.ql-title-medium').text().toLowerCase();

      // 📅 Date Logic (2026 Check)
      if (!dateText.includes('2026')) return; 
      // January start skip logic
      if (/Jan (1|2|3|4),/.test(dateText)) return;

      // 🏷️ Category Logic
      if (title.includes('trivia')) {
        trivia++;
      } else if (title.includes('skill badge')) {
        skills++;
      } 
      // 👇 UPDATED GAME LOGIC (Jo aapne manga) 👇
      else {
        // 1. Special Game (2 Points) check sabse pehle
        if (title.includes('work life refresh')) {
          games += 2; 
        } 
        // 2. Baaki Games (1 Point) check
        else if (
          title.includes('level') || 
          title.includes('a cloud that cares') || 
          title.includes('certification zone') || 
          title.includes('base camp') ||
          title.includes('game') // Fallback agar future me koi aur 'game' aaye
        ) {
          games += 1;
        }
      }
    });

    console.log(`✅ Success! Found: ${userName}`);

    return NextResponse.json({
      totalPoints: trivia + games + Math.floor(skills / 2),
      breakdown: { trivia, games, skills },
      userName,
      userAvatar
    });

  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    return NextResponse.json({ error: 'Failed to fetch profile. Check URL.' }, { status: 500 });
  }
}