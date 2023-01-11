import { FirebaseApp, initializeApp } from "firebase/app";

const apiKey: string = process.env["FIREBASE_API_KEY"] || "";
const authDomain: string = process.env["FIREBASE_AUTH_DOMAIN"] || "";
const projectId: string = process.env["FIREBASE_PROJECT_ID"] || "";
const storageBucket: string = process.env["FIREBASE_STORAGE_BUCKET"] || "";
const messagingSenderId: string =
  process.env["FIREBASE_MESSAGING_SENDER_ID"] || "";
const appId: string = process.env["FIREBASE_APP_ID"] || "";
const measurementId: string = process.env["FIREBASE_MEASUREMENT_ID"] || "";

const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
};

const app: FirebaseApp = initializeApp(firebaseConfig);

if (app) {
  console.log("Firebase app initialized");
}

export default app;
