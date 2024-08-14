import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBX27cycHLtSAhpMyC70od_L1l5aIxsAkI",
  authDomain: "apps-c99c0.firebaseapp.com",
  projectId: "apps-c99c0",
  storageBucket: "apps-c99c0.appspot.com",
  messagingSenderId: "892714803768",
  appId: "1:892714803768:web:7404bcbca88817e473bccd"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
