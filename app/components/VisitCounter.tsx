"use client";

import { useEffect, useState, useRef } from "react";
import { doc, setDoc, increment, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

// 🔥 Number ko 36.3K+ format me convert karne ka function
function formatCount(num: number) {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K+";
  }
  return num.toString();
}

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);
  
  // 🔥 StrictMode double render ko rokne ke liye useRef
  const hasFetched = useRef(false);

  useEffect(() => {
    const docRef = doc(db, "siteStats", "visits");

    const updateCount = async () => {
      // Agar ek baar call ho chuka hai (React Strict Mode), toh wapas mat karo
      if (hasFetched.current) return;
      hasFetched.current = true;

      // Har refresh par sirf 1 bar count badhega
      await setDoc(docRef, { count: increment(1) }, { merge: true });
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

  if (count === null) return <span className="animate-pulse">...</span>;

  // ✨ Ab 36,319 ki jagah 36.3K+ dikhega
  return <span>{formatCount(count)}</span>;
}