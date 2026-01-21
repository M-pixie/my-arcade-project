"use client";

import { useState, useEffect } from "react";
import { getFirestore, collection, getCountFromServer } from "firebase/firestore";
import { app } from "@/lib/firebase"; // Apne firebase config ka path check kar lena
import { Users } from "lucide-react"; // Icon ke liye

export default function LoginCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    async function fetchUserCount() {
      try {
        const db = getFirestore(app);
        const usersColl = collection(db, "users"); // 'users' wo collection hai jahan data save hota hai
        const snapshot = await getCountFromServer(usersColl);
        setCount(snapshot.data().count);
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    }

    fetchUserCount();
  }, []);

  if (count === null) return null; // Jab tak load na ho, kuch mat dikhao

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full shadow-sm backdrop-blur-md">
      <Users size={16} className="text-blue-400" />
      <span className="text-sm font-bold text-blue-100">
        {count} <span className="text-blue-400/70 font-normal">Registered Users</span>
      </span>
    </div>
  );
}