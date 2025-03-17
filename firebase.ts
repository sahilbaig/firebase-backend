import * as admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
  databaseURL: "https://testing-firebase-70b92-default-rtdb.firebaseio.com/",
});

const db = admin.firestore();
const rtdb = admin.database();
const auth = admin.auth();

export { db, rtdb, auth };
