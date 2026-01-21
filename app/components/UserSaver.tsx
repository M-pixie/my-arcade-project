"use client";

import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";

export default function UserSaver() {
  useEffect(() => {
    const auth = getAuth(app);
    const db = getFirestore(app);

    // Jab bhi koi user login/logout kare, ye function chalega
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Agar user login hai, to uska data 'users' collection mein save karo
        const userRef = doc(db, "users", user.uid);
        
        await setDoc(userRef, {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          lastSeen: serverTimestamp(), // Pata chalega banda kab active tha
        }, { merge: true }); // 'merge: true' ka matlab purana data delete nahi hoga
      }
    });

    return () => unsubscribe();
  }, []);

  return null; // Ye screen par kuch nahi dikhayega, bas background mein kaam karega
}