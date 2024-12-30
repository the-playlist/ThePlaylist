// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Optional: For Authentication
import { getFirestore } from "firebase/firestore"; // Optional: For Firestore
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFvHvbeLxGqTn5xC1gJIIXSOYwIQJdSjM",
  authDomain: "playlist-test-24a0c.firebaseapp.com",
  projectId: "playlist-test-24a0c",
  storageBucket: "playlist-test-24a0c.firebasestorage.app",
  messagingSenderId: "936642301367",
  appId: "1:936642301367:web:2e8356ba2848ac285aec32",
  measurementId: "G-085GT4BJK2",
  databaseURL: `https://playlist-test-24a0c-default-rtdb.asia-southeast1.firebasedatabase.app/`
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the Firebase services you need
export const auth = getAuth(app); // Optional
export const db = getFirestore(app); // Optional
export const database = getDatabase(app);
export const storage = getStorage(app); // Optional
export default app;