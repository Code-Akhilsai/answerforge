import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCwr3OcZv2tekNkilCN3K_uVYiz3O9Myk0",
  authDomain: "answerforge-559af.firebaseapp.com",
  projectId: "answerforge-559af",
  storageBucket: "answerforge-559af.firebasestorage.app",
  messagingSenderId: "140042639741",
  appId: "1:140042639741:web:968acb370d658f535d9414",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export default app;
