import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1Sff9byrN6O1OlJydRmOiG1cYOlWLVrU",
  authDomain: "collaborative-note-app-62e77.firebaseapp.com",
  projectId: "collaborative-note-app-62e77",
  storageBucket: "collaborative-note-app-62e77.appspot.com",
  messagingSenderId: "686452639913",
  appId: "1:686452639913:web:77e45c6573f2159d3281b8",
  measurementId: "G-GHQZH0ZKC5",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
