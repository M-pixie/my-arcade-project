export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";

export async function GET() {
  try {
    const swagsRef = collection(db, "swag_drops");
    let addedCount = 0;
    let addedSwags = [];

    // Helper function to assign correct tags based on title
    const getTagsForTitle = (title: string) => {
      const tags = [];
      const lowerTitle = title.toLowerCase();
      
      if (lowerTitle.includes("champion")) tags.push("Champion");
      if (lowerTitle.includes("legend")) tags.push("Legend");
      
      // 🔥 UPDATE: Backpack aur Ranger dono ko Ranger tag me dala jayega 🔥
      if (lowerTitle.includes("ranger") || lowerTitle.includes("backpack")) tags.push("Ranger");
      
      if (lowerTitle.includes("trooper")) tags.push("Trooper");
      if (tags.length === 0) tags.push("All Tiers");
      
      return tags;
    };

    const directTopicUrl = "https://discuss.google.dev/t/399232.json";
    const directResponse = await fetch(directTopicUrl, { cache: 'no-store' });
    
    if (directResponse.ok) {
      const topicData = await directResponse.json();
      const postLink = `https://discuss.google.dev/t/${topicData.slug}/${topicData.id}`;
      const q = query(swagsRef, where("link", "==", postLink));
      const existingSwags = await getDocs(q);

      if (existingSwags.empty) {
        const title = topicData.title;
        const imageUrl = topicData.image_url || "https://d2yds90mtvelsl.cloudfront.net/original/4X/c/d/1/cd1f29603f7b53e485bede1ff9044751ae1ee722.gif";
        
        const newSwag = {
          title: title,
          date: new Date(topicData.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          image: imageUrl,
          link: postLink,
          tags: getTagsForTitle(title), // Naya logic yahan use ho raha hai
          bgColor: "bg-gradient-to-br from-[#fdf0b6] to-[#fce47a]",
          createdAt: Date.now()
        };

        await addDoc(swagsRef, newSwag);
        addedCount++;
        addedSwags.push(newSwag);
      }
    }

    const forumUrl = `https://discuss.google.dev/latest.json`;
    const response = await fetch(forumUrl, { cache: 'no-store' });
    
    if (response.ok) {
       const data = await response.json();
       const topics = data.topic_list?.topics || [];
       const cutoffDate = new Date("2026-09-14T00:00:00Z");
       
       const validSwagTopics = topics.filter((topic: any) => {
         const topicDate = new Date(topic.created_at);
         const lowerTitle = topic.title.toLowerCase();
         return (topicDate >= cutoffDate) && lowerTitle.includes("swag drop");
       });

       for (const topic of validSwagTopics) {
         const postLink = `https://discuss.google.dev/t/${topic.slug}/${topic.id}`;
         const q = query(swagsRef, where("link", "==", postLink));
         const existingSwags = await getDocs(q);

         if (existingSwags.empty) {
            const title = topic.title;
            const imageUrl = topic.image_url || "https://d2yds90mtvelsl.cloudfront.net/original/4X/c/d/1/cd1f29603f7b53e485bede1ff9044751ae1ee722.gif";
            
            const newSwag = {
              title: title,
              date: new Date(topic.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              image: imageUrl,
              link: postLink,
              tags: getTagsForTitle(title), // Yahan bhi
              bgColor: "bg-gradient-to-br from-[#fdf0b6] to-[#fce47a]",
              createdAt: Date.now()
            };

            await addDoc(swagsRef, newSwag);
            addedCount++;
            addedSwags.push(newSwag);
         }
       }
    }

    if (addedCount > 0) {
      return NextResponse.json({ 
        status: "Success", 
        message: `${addedCount} new swag(s) added successfully with proper tags!`, 
        data: addedSwags 
      });
    } else {
      return NextResponse.json({ 
        status: "Already Exists", 
        message: "Everything is up to date." 
      });
    }

  } catch (error: any) {
    return NextResponse.json({ status: "Error", message: error.message }, { status: 500 });
  }
}