import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCvH_LB4Gn97vNBqeAYrZYdUo2chDZMyPw",
  authDomain: "arcadehub-3fc53.firebaseapp.com",
  projectId: "arcadehub-3fc53",
  storageBucket: "arcadehub-3fc53.firebasestorage.app",
  messagingSenderId: "804775710906",
  appId: "1:804775710906:web:8e47ee3afa047b0aa4b283",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export const auth = getAuth(app);
export default app;
