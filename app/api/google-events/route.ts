import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export type EventStatus = "Upcoming" | "Past" | "Ongoing";

export type GoogleEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  country: string;
  type: string;
  url: string;
  source: string;
  status: EventStatus;
};

// ==========================================
// 1. BUILT-IN FALLBACK EVENTS
// ==========================================
const STATIC_INDIA_EVENTS: GoogleEvent[] = [
  {
    id: "arcade-fac-cohort-2",
    title: "Google Arcade Facilitator Program 2026 ",
    description: "Learn Google Cloud skills, complete quests, and earn Arcade points and swags. Mentored by Arcade Facilitators.",
    date: "July 13 - Sept 14, 2026",
    location: "Online / India",
    country: "India",
    type: "Google Arcade Events",
    url: "https://go.cloudskillsboost.google/arcade",
    source: "Google Arcade",
    status: "Ongoing"
  },
  {
    id: "gdg-devfest-delhi",
    title: "DevFest New Delhi 2026",
    description: "The biggest community-led tech conference by GDG New Delhi exploring AI, Web, and Cloud.",
    date: "Oct 24, 2026",
    location: "New Delhi, India",
    country: "India",
    type: "GDG Events",
    url: "https://gdg.community.dev/gdg-new-delhi/",
    source: "Google Developer Groups Community",
    status: "Upcoming"
  },
  {
    id: "hack2skill-gemini",
    title: "Gemini AI Build-a-thon",
    description: "Build cutting-edge GenAI applications using the Google Gemini API. Organized by Hack2Skill.",
    date: "Sept 5 - Sept 20, 2026",
    location: "Online / India",
    country: "India",
    type: "Hack2Skill Events",
    url: "https://hack2skill.com/hack/gemini-ai",
    source: "Hack2Skill",
    status: "Ongoing"
  },
  {
    id: "cloud-next-blr",
    title: "Google Cloud Next '26 - Bengaluru",
    description: "Experience the latest in Google Cloud AI, data, and infrastructure at this massive in-person summit.",
    date: "Aug 10, 2026",
    location: "Bengaluru, India",
    country: "India",
    type: "Google Cloud events",
    url: "https://cloud.google.com/events/next-bengaluru",
    source: "Google Cloud",
    status: "Past"
  },
  {
    id: "io-connect-blr",
    title: "Google I/O Connect Bengaluru 2026",
    description: "Bringing the best of Google I/O directly to Indian developers with hands-on sessions.",
    date: "July 26, 2026",
    location: "Bengaluru, India",
    country: "India",
    type: "Google I/O related events",
    url: "https://developers.google.com/io/connect/bengaluru",
    source: "Google Developers",
    status: "Past"
  },
  {
    id: "gdg-cloud-mumbai",
    title: "Cloud Study Jam - GDG Cloud Mumbai",
    description: "A hands-on workshop focused on Kubernetes and Google Cloud deployment architectures.",
    date: "Sept 28, 2026",
    location: "Mumbai, India",
    country: "India",
    type: "Google hackathons / workshops",
    url: "https://gdg.community.dev/events/details/google-gdg-cloud-mumbai/",
    source: "Google Developer Community",
    status: "Upcoming"
  }
];

// ==========================================
// 2. SCRAPER UTILITIES
// ==========================================
function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function absoluteUrl(href: string, base: string): string {
  try { return new URL(href, base).toString(); } 
  catch { return href; }
}

function detectCategory(text: string, source: string): string {
  const normalized = text.toLowerCase();
  if (source === "Hack2Skill") return "Hack2Skill Events";
  if (normalized.includes("arcade facilitator") || normalized.includes("google arcade")) return "Google Arcade Events";
  if (normalized.includes("gdg") || normalized.includes("devfest")) return "GDG Events";
  if (normalized.includes("i/o")) return "Google I/O related events";
  if (normalized.includes("cloud")) return "Google Cloud events";
  if (normalized.includes("hackathon") || normalized.includes("workshop") || normalized.includes("study jam")) return "Google hackathons / workshops";
  if (normalized.includes("webinar") || normalized.includes("meetup")) return "Google webinars / meetups";
  if (normalized.includes("developer")) return "Google Developer events";
  return "Other publicly listed Google community events";
}

function detectLocationData(text: string, source: string): { location: string; country: string } {
  if (source === "Hack2Skill") return { location: "Online / India", country: "India" }; 

  const normalized = text.toLowerCase();
  const globalCities = [
    { city: "Hyderabad", country: "India" }, { city: "Bengaluru", country: "India" },
    { city: "Bangalore", country: "India" }, { city: "New Delhi", country: "India" },
    { city: "Delhi", country: "India" }, { city: "Pune", country: "India" },
    { city: "Mumbai", country: "India" }, { city: "Chennai", country: "India" }
  ];

  for (const item of globalCities) {
    if (normalized.includes(item.city.toLowerCase())) {
      return { location: `${item.city}, ${item.country}`, country: item.country };
    }
  }

  if (normalized.includes("online") || normalized.includes("virtual")) return { location: "Online / Virtual", country: "Online" };
  if (normalized.includes("india")) return { location: "India", country: "India" };

  return { location: "Location TBA", country: "Global" };
}

function extractDate(text: string): string {
  const datePatterns = [
    /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{1,2}(?:\s*-\s*\d{1,2})?(?:,\s*|\s+)\d{4}\b/i,
    /\b\d{1,2}\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/i,
  ];
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) return match[0];
  }
  return "";
}

function getEventStatus(dateText: string): EventStatus {
  if (!dateText) return "Upcoming";
  
  const cleanedDate = dateText.replace(/-\s*\d{1,2}\s*/, " ");
  const parsed = Date.parse(cleanedDate);
  
  if (Number.isNaN(parsed)) return "Ongoing";
  
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  
  if (parsed < now - oneDay) return "Past";
  if (parsed >= now - oneDay && parsed <= now + (15 * oneDay)) return "Ongoing";
  return "Upcoming";
}

async function fetchHtml(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140 Safari/537.36",
      Accept: "text/html,application/xhtml+xml",
    },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`${url} failed`);
  return response.text();
}

function extractEventsFromHtml(html: string, baseUrl: string, source: string): GoogleEvent[] {
  const events: GoogleEvent[] = [];
  const $ = cheerio.load(html);

  // Exclude bad links like privacy, terms, login, etc.
  const excludeRegex = /privacy|terms|login|signup|about|contact|subscribe|faq/i;
  // Match keywords that indicate an event
  const includeRegex = /event|devfest|meetup|workshop|hackathon|hack\/|summit|conference|webinar|arcade/i;

  $("a").each((_, el) => {
    const href = $(el).attr("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) return;

    const eventUrl = absoluteUrl(href, baseUrl);
    if (excludeRegex.test(eventUrl) || !includeRegex.test(eventUrl)) return;

    // Use Cheerio to extract clean text from the anchor tag and its immediate parent container
    let title = cleanText($(el).text());
    const contextHtml = $(el).parent().parent().text(); 
    const combinedText = cleanText(`${title} ${contextHtml} ${eventUrl}`);

    // If it's an image banner without text, format the URL path as a title fallback
    if (!title && source === "Hack2Skill") {
      const urlParts = eventUrl.split("/").filter(Boolean);
      title = urlParts[urlParts.length - 1].replace(/-/g, " ").toUpperCase();
    }

    // Ignore garbage extractions
    if (!title || title.length < 5 || title.length > 100) return;
    if (events.some((e) => e.url === eventUrl || e.title.toLowerCase() === title.toLowerCase())) return;

    const date = extractDate(combinedText);
    const { location, country } = detectLocationData(combinedText, source);
    const category = detectCategory(combinedText, source);
    const status = getEventStatus(date);

    events.push({
      id: `${source.toLowerCase().replace(/\s+/g, "-")}-${events.length + 1}`,
      title,
      description: `${category} hosted by ${source}.`,
      date: date || "TBA",
      location,
      country,
      type: category,
      url: eventUrl,
      source,
      status
    });
  });

  return events;
}

export async function GET() {
  try {
    const sources = [
      { name: "Google Cloud", url: "https://cloud.google.com/events" },
      { name: "Google Developers", url: "https://developers.google.com/events" },
      { name: "Google Developer Community", url: "https://developers.google.com/community" },
      { name: "Hack2Skill", url: "https://hack2skill.com/hackathons" },
    ];

    const sourceResults = await Promise.allSettled(
      sources.map(async (source) => {
        const html = await fetchHtml(source.url);
        return extractEventsFromHtml(html, source.url, source.name);
      })
    );

    const allEvents: GoogleEvent[] = [...STATIC_INDIA_EVENTS];

    for (const result of sourceResults) {
      if (result.status === "fulfilled") allEvents.push(...result.value);
    }

    const uniqueEvents = Array.from(
      new Map(allEvents.map((event) => [`${event.title.toLowerCase()}-${event.url}`, event])).values()
    );

    return NextResponse.json({
      success: true,
      count: uniqueEvents.length,
      events: uniqueEvents,
    });
  } catch (error) {
    return NextResponse.json({ 
      success: true, 
      count: STATIC_INDIA_EVENTS.length, 
      events: STATIC_INDIA_EVENTS, 
      message: "Showing cached data." 
    });
  }
}