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

  if (count === null) return <span className="animate-pulse">...</span>;

  // ✨ Sirf Number return kar rahe hain (Taaki Parent component isse style kar sake)
  return <span>{count.toLocaleString()}</span>;
}