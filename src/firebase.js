import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBjfiEU_QpF6KBmWG_gjr-qpRmSai5Xpac",

  authDomain: "control-de-horaa.firebaseapp.com",

  projectId: "control-de-horaa",

  storageBucket: "control-de-horaa.firebasestorage.app",

  messagingSenderId: "318630974127",

  appId: "1:318630974127:web:cbd1010881f4632e63ba5a",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);