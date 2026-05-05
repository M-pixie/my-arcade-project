import {
  doc,
  setDoc,
  collection,
  addDoc,
  serverTimestamp,
  orderBy,
  query,
  limit,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "./firebase";

/* ===============================
   SAVE PUBLIC USER POINTS + HISTORY (NO LOGIN REQUIRED)
================================ */
export async function savePublicUserToLeaderboard(userData: { name: string; photoURL: string; points: number; profileUrl: string }) {
  try {
    if (!userData.profileUrl) return;

    // Profile URL ke last part ko hi Unique ID maan lenge (e.g. https://.../public_profiles/12345 -> 12345)
    const uniqueId = userData.profileUrl.split('/').pop() || "unknown_id";

    const userRef = doc(db, "leaderboard", uniqueId);

    await setDoc(
      userRef,
      {
        id: uniqueId,
        name: userData.name || "Arcade Player",
        photoURL: userData.photoURL || "/avatar.png",
        points: userData.points,
        profileUrl: userData.profileUrl,
        updatedAt: serverTimestamp(),
      },
      { merge: true } // merge: true se agar user dobara calculate karega toh purana data overwrite (update) ho jayega
    );

    // Pehle ki tarah history bhi save kar lete hain
    const historyRef = collection(userRef, "history");
    await addDoc(historyRef, {
      points: userData.points,
      createdAt: serverTimestamp(),
    });

    console.log("✅ Public User auto-saved to leaderboard successfully!");
  } catch (error) {
    console.error("❌ Error saving to leaderboard:", error);
  }
}

/* ===============================
   USER HISTORY (BY PROFILE ID)
================================ */
export async function getUserHistory(profileId: string) {
  if (!profileId) return [];

  const q = query(
    collection(db, "leaderboard", profileId, "history"),
    orderBy("createdAt", "desc"),
    limit(5)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* ===============================
   REAL-TIME LEADERBOARD
================================ */
export function subscribeLeaderboard(
  callback: (data: any[]) => void
) {
  const q = query(
    collection(db, "leaderboard"),
    orderBy("points", "desc"),
    limit(1000) // Top 1000 players dikhayega
  );

  return onSnapshot(q, (snapshot) => {
    let rank = 1;

    const leaders = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      rank: rank++,
      ...docSnap.data(),
    }));

    callback(leaders);
  });
}