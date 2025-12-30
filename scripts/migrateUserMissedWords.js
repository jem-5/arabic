const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function migrateUserMissedWords(uid) {
  const userRef = db.collection("users").doc(uid);
  const snap = await userRef.get();

  if (!snap.exists) return;

  const data = snap.data();
  let missedWords = {};
  let merged = [];

  const fieldsToDelete = {};

  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value) && value.length && value[0]?.english) {
      merged.push(...value);
      fieldsToDelete[key] = admin.firestore.FieldValue.delete();
    }
  }

  if (!merged.length) return;

  await userRef.update({
    missedWords: merged,
    ...fieldsToDelete,
  });

  console.log(`Migrated ${merged.length} words for user ${uid}`);
}

migrateUserMissedWords("CkhgVrOSI3Yb3S0PFtqj5LAraZo2");
