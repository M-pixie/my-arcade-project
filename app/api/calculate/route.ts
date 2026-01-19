import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Types define kar rahe hain taaki error na aaye
interface Badge {
  name: string;
  type: string;
  date: string;
}

interface LiveGamesMap {
  [key: string]: number;
}

// 1. Arcade Site Scraper
async function getLiveArcadeGames(): Promise<LiveGamesMap> {
  try {
    const url = 'https://go.cloudskillsboost.google/arcade'; 
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    const liveGamesMap: LiveGamesMap = {};

    // Fallback games (Safety ke liye)
    liveGamesMap['work-life refresh'] = 2; 
    liveGamesMap['a cloud that cares'] = 1;

    return liveGamesMap;
  } catch (error) {
    console.error('Arcade Scrape Error:', error);
    return { 'work-life refresh': 2 }; 
  }
}

// 2. User Profile Scraper
async function getUserData(profileUrl: string) {
  try {
    const { data } = await axios.get(profileUrl);
    const $ = cheerio.load(data);
    
    // User Details
    const userName = $('h1').first().text().trim() || "Arcade Player";
    const userAvatar = $('img.avatar').attr('src') || $('img[alt="Avatar"]').attr('src') || "";

    const badges: Badge[] = [];

    // Badges Scrape
    $('.profile-badge').each((_: any, element: any) => {
      const name = $(element).find('.title').text().trim() || 
                   $(element).find('span[class*="title"]').text().trim();
      const date = $(element).find('.date').text().trim(); 

      let type = 'game';
      if (name.toLowerCase().includes('skill badge')) type = 'skill';
      else if (name.toLowerCase().includes('trivia')) type = 'trivia';

      if (name) {
        badges.push({ name, type, date });
      }
    });

    return { badges, userName, userAvatar };
  } catch (error) {
    console.error("Profile scrape error", error);
    return { badges: [], userName: "Unknown", userAvatar: "" };
  }
}

// 3. MAIN API HANDLER
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileUrl } = body;

    if (!profileUrl) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const [liveGamesMap, userData] = await Promise.all([
      getLiveArcadeGames(),
      getUserData(profileUrl)
    ]);

    const { badges, userName, userAvatar } = userData;

    let totalPoints = 0;
    let triviaCount = 0; 
    let gamesCount = 0;
    let skillBadgeCount = 0;

    badges.forEach((badge) => {
      const badgeNameLower = badge.name.toLowerCase();

      if (badge.type === 'skill') {
        skillBadgeCount++;
      } else {
        if (liveGamesMap[badgeNameLower] || badgeNameLower.includes('trivia')) {
          let points = 1;
          if (liveGamesMap[badgeNameLower] === 2) {
             points = 2;
          }
          
          if (badgeNameLower.includes('trivia')) {
            triviaCount += points;
          } else {
            gamesCount += points;
          }
          totalPoints += points;
        }
      }
    });

    const skillPoints = Math.floor(skillBadgeCount / 2);
    totalPoints += skillPoints;

    return NextResponse.json({
      totalPoints,
      userName,
      userAvatar,
      breakdown: {
        trivia: triviaCount,
        games: gamesCount,
        skills: skillPoints 
      }
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}