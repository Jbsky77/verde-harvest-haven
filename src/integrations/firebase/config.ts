
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6MYV50TQiR_VQBExPaJt7FBsqd-j-vok",
  authDomain: "cultiv-ai-56e90.firebaseapp.com",
  projectId: "cultiv-ai-56e90",
  storageBucket: "cultiv-ai-56e90.appspot.com",
  messagingSenderId: "782488149727",
  appId: "1:782488149727:web:ad03213222e2972afa936a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
