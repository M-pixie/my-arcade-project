import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const dynamic = 'force-dynamic';

// ==========================================
// 🔥 MASTER LIST OF 93 SKILL BADGES 🔥
// ==========================================

const skillBadgesMasterList = [
  "Manage Kubernetes in Google Cloud",
  "[Deprecated] Classify Images with TensorFlow on Google Cloud", 
  "Derive Insights from BigQuery Data",
  "Share Data Using Google Data Cloud", 
  "Implement Cloud Collaboration and Productivity Workflows",
  "Migrate MySQL Data to Cloud SQL Using Database Migration Service",
  "Use Machine Learning APIs on Google Cloud",
  "Mitigate Threats and Vulnerabilities with Security Command Center",
  "Monitor Environments with Google Cloud Managed Service for Prometheus", 
  "Prompt Design in Agent Platform",
  "Configure Service Accounts and IAM Roles for Google Cloud",
  "Integrate BigQuery Data and Google Workspace using Apps Script",
  "Implement Speech and Language Solutions with Pre-trained APIs", 
  "Build a Data Mesh with Knowledge Catalog",
  "Analyze Sentiment with Natural Language API",
  "Develop with Apps Script and AppSheet",
  "Using the Google Cloud Speech API",
  "Use APIs to Work with Cloud Storage",
  "The Basics of Google Cloud Compute", 
  "Get Started with Sensitive Data Protection", 
  "Analyze Images with the Cloud Vision API",
  "Secure Lakehouse Data", 
  "Enrich Metadata and Discovery of BigLake Data",
  "Create a Secure Data Lake on Cloud Storage",
  "Analyze Speech and Language with Google APIs",
  "Monitoring in Google Cloud",
  "Build Event-Driven Applications with Eventarc",
  "Create Your First Gemini Enterprise Application",
  "Engineer AI Agents with Agent Development Kit (ADK)",
  "Build Global and Regional Load Balancing Solutions",
  "Google DeepMind: Train A Small Language Model",
  "Build a Smart Cloud Application with Vibe Coding and MCP",
  "Deploy Multi-Agent Architectures",
  "Develop AI-Powered Prototypes in Google AI Studio",
  "Kickstarting Application Development with Gemini Code Assist",
  "Connecting Cloud Networks with NCC",
  "Privileged Access with IAM",
  "Enhance Gemini Model Capabilities",
  "Analyze and Reason on Multimodal Data with Gemini",
  "Implement Multimodal Vector Search with BigQuery",
  "Protect Cloud Traffic with Chrome Enterprise Premium Security",
  "Discover and Protect Sensitive Data Across Your Ecosystem",
  "Implement Event-Driven Messaging and Automation Workflows",
  "Secure Software Delivery",
  "Set Up a Google Cloud Network",
  "Create and Manage AlloyDB Instances",
  "Build Real World AI Applications with Gemini and Imagen",
  "Inspect Rich Documents with Gemini Multimodality and Multimodal RAG",
  "Develop Gen AI Apps with Gemini and Streamlit",
  "Explore Generative AI in Agent Platform",
  "Build LookML Objects in Looker",
  "Create and Manage Cloud SQL for PostgreSQL Instances",
  "Deploy and Manage Apigee X",
  "Prepare Data for Looker Dashboards and Reports",
  "Optimize Costs for Google Kubernetes Engine",
  "Develop Serverless Apps with Firebase",
  "Develop Serverless Applications on Cloud Run",
  "Implement Cloud Security Fundamentals on Google Cloud",
  "Build a Data Warehouse with BigQuery",
  "Create ML Models with BigQuery ML",
  "Monitor and Log with Google Cloud Observability",
  "Implement DevOps Workflows in Google Cloud",
  "Engineer Data for Predictive Modeling with BigQuery ML",
  "Build a Secure Google Cloud Network",
  "Cloud Architecture: Design, Implement, and Manage",
  "Build a Website on Google Cloud",
  "Implementing Cloud Load Balancing for Compute Engine",
  "Develop Your Google Cloud Network",
  "Set Up an App Dev Environment on Google Cloud",
  "Prepare Data for ML APIs on Google Cloud",
  "Deploy Kubernetes Applications on Google Cloud",
  "Deploy and Manage Applications on Google App Engine",
  "Implement Cloud Storage and Data Protection Solutions",
  "Create a Streaming Data Lake on Cloud Storage",
  "Build Serverless Applications with Cloud Run Functions",
  "Streaming Analytics into BigQuery",
  "Deploy and Secure Serverless APIs with API Gateway",
  "App Building with AppSheet",
  "Store, Process, and Manage Data on Google Cloud - Console",
  "Analyze BigQuery Data in Connected Sheets",
  "Monitor and Manage Google Cloud Resources",
  "Store, Process, and Manage Data on Google Cloud - Command Line",
  "Build Google Cloud Infrastructure for AWS Professionals",
  "Create and Manage Bigtable Instances",
  "Implement CI/CD Pipelines on Google Cloud",
  "Use Functions, Formulas, and Charts in Google Sheets",
  "Create and Manage Cloud Spanner Instances",
  "Build Infrastructure with Terraform on Google Cloud",
  "Perform Predictive Data Analysis in BigQuery",
  "Automate Data Capture at Scale with Document AI",
  "Manage Data Models in Looker", 
  "Implement Cloud Collaboration and Productivity Workflows",
  "[DEPRECATED] Designing Network Security in Google Cloud",
  "Orchestrate Multi-agent Workflows with Gemini Enterprise",
  "Organize and Govern Data with Knowledge Catalog",
  "Enrich Metadata and Discovery of Lakehouse Data",
  "Develop and Secure APIs with Apigee X",
  "DEPRECATED Build Google Cloud Infrastructure for Azure Professionals"
].map(name => name.toLowerCase());

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL required' }, { status: 400 });
    }

    // 🔥 1. NAYA STRICT REGEX CHECK (Kachra URL yahi block ho jayega) 🔥
    const urlPattern = /^https:\/\/www\.skills\.google\/public_profiles\/[a-zA-Z0-9-]+$/;
    if (!urlPattern.test(url.trim())) {
      return NextResponse.json({ error: 'Invalid Profile URL format.' }, { status: 400 });
    }

    console.log(" Fetching Profile (2026 Logic Updated with 3 Point Games & Decimals)...");

    // 1. HTML Download
    const response = await axios.get(url.trim(), {
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

    // 🔥 2. NAYA CHECK: Agar galat page scrape ho gaya ("Build AI skills...") toh fauran rok do 🔥
    if (userName.toLowerCase().includes("build ai skills")) {
      return NextResponse.json({ error: 'Invalid User Profile. Please check the URL.' }, { status: 400 });
    }

    if (!userName) userName = "Arcade Player";

    let userAvatar = $('ql-avatar').attr('src');
    if (!userAvatar) userAvatar = $('ql-avatar img').attr('src');

    // 4. Variables Initialize
    let triviaPoints = 0; 
    let gamePoints = 0;   
    let skillBadgesCount = 0; 

    // 🔥 SIRF YE EK NAYA VARIABLE ADD KIYA HAI 🔥
    const completionHistory: any[] = []; 

    // Helper Function to check if a title is a Skill Badge from our master list
    const isSkillBadge = (titleToCheck: string) => {
        return skillBadgesMasterList.some(badge => 
            titleToCheck === badge || 
            (badge.endsWith('...') && titleToCheck.startsWith(badge.slice(0, -3)))
        );
    };

    // 5. Main Logic Loop
    $('.profile-badge').each((index, element) => {
      const card = $(element);
      const dateText = card.find('.ql-body-medium').text();
      
      const rawText = card.find('.ql-title-medium').text(); //  1. HTML se raw text fetch kiya (isme hidden \n aur extra spaces hote hain)

      const title = rawText.replace(/\s+/g, ' ').toLowerCase().trim(); // 2. Backend Match: Extra spaces/Enter hata ke single space banaya, aur array match ke liye lowercase kiya

      const originalTitle = rawText.replace(/\s+/g, ' ').trim();   // 3. Frontend UI: Text clean kiya par lowercase nahi kiya, taaki History table me naam professional dikhe

      // 🔥 1. YAHAN IMAGE NIKALNI HAI (UPDATED FOR URL FIX) 🔥
      let badgeImg = card.find('img').attr('src') || "";
      if (badgeImg.startsWith('/')) {
        badgeImg = 'https://www.skills.google' + badgeImg;
      }

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
      else if (isSkillBadge(title) || title.includes('skill badge')) {
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
          title.includes('skill up summer') || //  New add badges 
          title.includes('work meets play: expressive efficiency') ||  //  New add badges 
          title.includes('logic log') || // june
          title.includes('work meets play: cloud canvas') || // june
          title.includes('safe spaces') || // july
          title.includes('arcade simulator: data mesh architect') // july

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
          type: type,
          image: badgeImg // 🔥 2. YE LINE ADD KR DENA 🔥
        });
      }
    });

    console.log(`✅ Success! Found: ${userName}`);

    // 🔥 DECIMAL CALCULATION (Math.floor HATA DIYA HAI) 🔥
    const calculatedPoints = triviaPoints + gamePoints + (skillBadgesCount / 2);

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