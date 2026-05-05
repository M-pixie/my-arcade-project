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

    console.log(" Fetching Profile (2026 Logic Updated with 3 Point Games)...");

    // 1. HTML Download
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      }
    });

    // 2. HTML Parse
    const $ = cheerio.load(response.data);

    // 3. Name & Avatar Dhoondo
    let userName = $('.ql-display-small').text().trim();
    if (!userName) userName = $('h1').text().trim();
    if (!userName) userName = "Arcade Player";

    let userAvatar = $('ql-avatar').attr('src');
    if (!userAvatar) userAvatar = $('ql-avatar img').attr('src');

    // 4. Variables Initialize
    let triviaPoints = 0; 
    let gamePoints = 0;   
    let skillBadgesCount = 0; 

    // 🔥 SIRF YE EK NAYA VARIABLE ADD KIYA HAI 🔥
    const completionHistory: any[] = []; 

    // 5. Main Logic Loop
    $('.profile-badge').each((index, element) => {
      const card = $(element);
      const dateText = card.find('.ql-body-medium').text();
      const title = card.find('.ql-title-medium').text().toLowerCase(); // Sab lowercase me check karenge
      const originalTitle = card.find('.ql-title-medium').text().trim(); // Original title history ke liye

      // 📅 Date Filter (Sirf 2026 ka data chahiye)
      if (!dateText.includes('2026')) return; 
      
      // Optional: Agar Jan ke starting days skip karne the
      if (/Jan (1|2|3|4),/.test(dateText)) return;

      // 🔥 Naye variables history push karne ke liye
      let earned = 0;
      let type = "Game";

      // ==========================================
      // 🚀 UPDATED LOGIC FOR 2026 NAMES
      // ==========================================

      // CATEGORY 1: Trivia & Sprints (1 Point each)
      if (title.includes('trivia') || title.includes('sprint')) {
        triviaPoints++;
        earned = 1;
        type = "Trivia";
      } 
      
      // CATEGORY 2: Skill Badges (0.5 Point each)
      else if (title.includes('skill badge')) {
        skillBadgesCount++;
        earned = 0.5;
        type = "Skill Badge";
      } 
      
      // CATEGORY 3: Games & Milestones
      else {
        
        // 🔥 NEW: 3 POINTS GAMES (Ye naya add kiya hai)
        if (title.includes('skills at the pitch') || title.includes('from foundations to wonders')) {
          gamePoints += 3;
          earned = 3;
        }

        // A. Special Games (2 Points)
        else if (title.includes('work life refresh') || title.includes('holi-istic infrastructures')) {
          gamePoints += 2; 
          earned = 2;
        } 
        
        // B. Standard Games & Levels (1 Point)
        else if (
          title.includes('level') || 
          title.includes('base camp') ||  
          title.includes('trail') ||      
          title.includes('voyage') ||     
          title.includes('adventure') ||  
          title.includes('certification zone') || 
          title.includes('journeys made easy') || 
          title.includes('metrics in motion') || // Ye naya 1 point game add kiya
          title.includes('game') ||
          title.includes('dialogue design') || // 🔥 Naya 1 point game add kiya jaisa tumne bola
          title.includes('works meet play') || //  New add badges

          title.includes('skillup summer') || //  New add badges 

          title.includes('work meets play: expressive efficiency')  //  New add badges 
          
        ) {
          gamePoints += 1;
          earned = 1;
        }
      }

      // 🔥 SIRF YE HISTORY PUSH LOGIC ADD KIYA HAI 🔥
      if (earned > 0) {
        completionHistory.push({
          name: originalTitle,
          date: dateText.replace('Completed ', '').trim(),
          points: earned,
          type: type
        });
      }
    });

    console.log(`✅ Success! Found: ${userName}`);

    // Final Calculation
    const calculatedPoints = triviaPoints + gamePoints + Math.floor(skillBadgesCount / 2);

    return NextResponse.json({
      totalPoints: calculatedPoints,
      breakdown: { 
        trivia: triviaPoints, 
        games: gamePoints, 
        skills: skillBadgesCount 
      },
      completionHistory, // 🔥 AUR YE LINE ADD KI HAI FRONTEND KE LIYE 🔥
      userName,
      userAvatar
    });

  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    return NextResponse.json({ error: 'Failed to fetch profile. Check URL.' }, { status: 500 });
  }
}