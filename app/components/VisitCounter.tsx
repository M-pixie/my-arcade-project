"use client";

import { useEffect, useState } from "react";
import { doc, setDoc, increment, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const docRef = doc(db, "siteStats", "visits");

    const updateCount = async () => {
      // Ek user ek hi baar count ho (Refresh par baar-baar na badhe)
      const hasVisited = sessionStorage.getItem("visit_counted");
      if (!hasVisited) {
        await setDoc(docRef, { count: increment(1) }, { merge: true });
        sessionStorage.setItem("visit_counted", "true");
      }
    };

    updateCount();

    // Realtime number update karne ke liye
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setCount(docSnap.data().count);
      }
    });

    return () => unsubscribe();
  }, []);

  if (count === null) return null;

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-lg animate-fade-in">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-white text-sm font-medium">
        Total Visits: <strong className="text-green-400">{count.toLocaleString()}</strong>
      </span>
    </div>
  );
}