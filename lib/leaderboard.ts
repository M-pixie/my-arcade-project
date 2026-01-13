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
import { User } from "firebase/auth";

/* ===============================
   SAVE USER POINTS + HISTORY
================================ */
export async function saveUserPoints(user: User, points: number) {
  if (!user?.uid) return;

  const userRef = doc(db, "leaderboard", user.uid);

  await setDoc(
    userRef,
    {
      uid: user.uid,
      name: user.displayName || "Anonymous",
      email: user.email || "",
      photoURL: user.photoURL || "",
      points,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  const historyRef = collection(userRef, "history");
  await addDoc(historyRef, {
    points,
    createdAt: serverTimestamp(),
  });
}

/* ===============================
   USER HISTORY (DASHBOARD)
================================ */
export async function getUserHistory(userId: string) {
  if (!userId) return [];

  const q = query(
    collection(db, "leaderboard", userId, "history"),
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
    limit(50)
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
