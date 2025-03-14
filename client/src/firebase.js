import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "kaushal-blog.firebaseapp.com",
  projectId: "kaushal-blog",
  storageBucket: "kaushal-blog.firebasestorage.app",
  messagingSenderId: "907513364834",
  appId: "1:907513364834:web:8fca1ad4c9405bed136c3b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
