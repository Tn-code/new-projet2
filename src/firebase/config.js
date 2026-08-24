import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAb-IkzbTpZKl98FGAMSrNxgieocy4A95w",
  authDomain: "projet-7b395.firebaseapp.com",
  projectId: "projet-7b395",
  storageBucket: "projet-7b395.firebasestorage.app",
  messagingSenderId: "810556209254",
  appId: "1:810556209254:web:4124c788656d89ef49d5a7",
  measurementId: "G-JT7FC2EWR6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, analytics, db, auth };
