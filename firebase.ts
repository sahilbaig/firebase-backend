import * as admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json"; // Update the path to your JSON file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();
export { db };
