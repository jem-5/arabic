import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

// const serviceAccount = JSON.parse(
//   readFileSync(join(process.cwd(), "serviceAccountKey.json"), "utf8")
// );

const serviceAccount = JSON.parse(process.env.NEXT_PUBLIC_SERVICE_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const adminDb = admin.firestore();
