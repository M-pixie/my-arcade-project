import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

export async function GET() {
  try {
    // 1. Google Forum ki latest posts uthao
    const forumUrl = "https://discuss.google.dev/latest.json";
    
    const response = await fetch(forumUrl, { next: { revalidate: 0 } });
    const data = await response.json();
    const topics = data.topic_list.topics;

    // 2. POWERFUL FILTER: 15 September 2026 (Date Cutoff)
    // Ye check karega ki post 15 Sept 2026 ke baad ki hi honi chahiye
    const cutoffDate = new Date("2026-09-15T00:00:00Z");

    const validSwagTopics = topics.filter((topic: any) => {
      // Forum se post ki date nikalo
      const topicDate = new Date(topic.created_at);
      
      // Conditions check karo
      const isAfterCutoff = topicDate >= cutoffDate;
      const is2026 = topic.title.includes("2026");
      const isSwagOrArcade = topic.title.toLowerCase().includes("swag") || topic.title.toLowerCase().includes("arcade");
      
      // Agar teeno conditions true hain, tabhi isko list me rakho
      return isAfterCutoff && is2026 && isSwagOrArcade;
    });

    // Agar 15 Sept ke baad koi post aayi hi nahi hai
    if (validSwagTopics.length === 0) {
      return NextResponse.json({ 
        status: "No New Swag", 
        message: "15 September 2026 ke baad ka koi naya swag post nahi mila." 
      });
    }

    const swagsRef = collection(db, "swag_drops");
    let addedCount = 0;
    let addedSwags = [];

    // 3. Loop: Agar ek saath 2-3 swag aayenge toh sabko line se process karega
    for (const topic of validSwagTopics) {
      const postLink = `https://discuss.google.dev/t/${topic.slug}/${topic.id}`;
      
      // Check karo ki ye wala specific swag database me pehle se hai kya?
      const q = query(swagsRef, where("link", "==", postLink));
      const existingSwags = await getDocs(q);

      if (existingSwags.empty) {
        // Data format karo naye swag ke liye
        const title = topic.title;
        const imageUrl = topic.image_url || "https://d2yds90mtvelsl.cloudfront.net/original/4X/c/d/1/cd1f29603f7b53e485bede1ff9044751ae1ee722.gif";

        // Tags auto-detect
        const tags = [];
        if (title.toLowerCase().includes("champion")) tags.push("Champion");
        if (title.toLowerCase().includes("legend")) tags.push("Legend");
        if (title.toLowerCase().includes("ranger")) tags.push("Ranger");
        if (title.toLowerCase().includes("trooper")) tags.push("Trooper");
        if (tags.length === 0) tags.push("All Tiers");

        const newSwag = {
          title: title,
          // Post ki actual date ko format karke save karega
          date: new Date(topic.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          image: imageUrl,
          link: postLink,
          tags: tags,
          bgColor: "bg-gradient-to-br from-[#fdf0b6] to-[#fce47a]",
          createdAt: Date.now()
        };

        // Database me save karo
        await addDoc(swagsRef, newSwag);
        addedCount++;
        addedSwags.push(newSwag);
      }
    }

    // 4. Final Response (Result batao)
    if (addedCount > 0) {
      return NextResponse.json({ 
        status: "Success", 
        message: `${addedCount} naye swag(s) successfully database me add ho gaye!`, 
        data: addedSwags 
      });
    } else {
      return NextResponse.json({ 
        status: "Already Exists", 
        message: "15 Sept ke baad wale saare latest swags pehle se hi database me save hain. Naya kuch nahi hai." 
      });
    }

  } catch (error: any) {
    console.error("Scraping error:", error);
    return NextResponse.json({ status: "Error", message: error.message }, { status: 500 });
  }
}