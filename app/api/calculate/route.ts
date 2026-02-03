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

    console.log("🚀 Fetching Profile (2026 Logic Updated)...");

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
    let triviaPoints = 0; // Ab isme Trivia + Sprint dono aayenge
    let gamePoints = 0;   // Isme Games ke points direct add honge
    let skillBadgesCount = 0; // Skill badges ka count (baad me /2 hoga)

    // 5. Main Logic Loop
    $('.profile-badge').each((index, element) => {
      const card = $(element);
      const dateText = card.find('.ql-body-medium').text();
      const title = card.find('.ql-title-medium').text().toLowerCase(); // Sab lowercase me check karenge

      // 📅 Date Filter (Sirf 2026 ka data chahiye)
      if (!dateText.includes('2026')) return; 
      
      // Optional: Agar Jan ke starting days skip karne the to ye logic rakho, warna hata sakte ho
      if (/Jan (1|2|3|4),/.test(dateText)) return;

      // ==========================================
      // 🚀 UPDATED LOGIC FOR 2026 NAMES
      // ==========================================

      // CATEGORY 1: Trivia & Sprints (1 Point each)
      // Ab "Sprint" bhi yahi count hoga
      if (title.includes('trivia') || title.includes('sprint')) {
        triviaPoints++;
      } 
      
      // CATEGORY 2: Skill Badges (0.5 Point each)
      else if (title.includes('skill badge')) {
        skillBadgesCount++;
      } 
      
      // CATEGORY 3: Games & Milestones
      else {
        // A. Special Games (2 Points)
        // Agar future me koi aur 2 pointer game aaye to yaha OR condition (|) laga dena
        if (title.includes('work life refresh')) {
          gamePoints += 2; 
        } 
        
        // B. Standard Games & Levels (1 Point)
        // Yaha naye 2026 keywords add kar diye hain (Trail, Voyage, Adventure, Base Camp)
        else if (
          title.includes('level') || 
          title.includes('base camp') ||  // New 2026
          title.includes('trail') ||      // New 2026
          title.includes('voyage') ||     // New 2026
          title.includes('adventure') ||  // New 2026
          title.includes('certification zone') || 
          title.includes('Journeys made easy') || 
          title.includes('game')          // Generic fallback
        ) {
          gamePoints += 1;
        }
      }
    });

    console.log(`✅ Success! Found: ${userName}`);

    // Final Calculation
    // Math.floor use kiya taki 1 Skill badge ka 0.5 na mile, 2 hone par hi 1 mile.
    const calculatedPoints = triviaPoints + gamePoints + Math.floor(skillBadgesCount / 2);

    return NextResponse.json({
      totalPoints: calculatedPoints,
      breakdown: { 
        trivia: triviaPoints, // Isme Sprint bhi shamil hai
        games: gamePoints, 
        skills: skillBadgesCount 
      },
      userName,
      userAvatar
    });

  } catch (error: any) {
    console.error("❌ ERROR:", error.message);
    return NextResponse.json({ error: 'Failed to fetch profile. Check URL.' }, { status: 500 });
  }
}