const admin = require("firebase-admin");

// Load your service account key
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function showClaims(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);

    console.log("User UID:", user.uid);
    console.log("Email:", user.email);
    console.log("Custom Claims:", user.customClaims);
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

// pass email from command line
const email = process.argv[2];

if (!email) {
  console.log("Usage: node showClaims.js user@email.com");
  process.exit();
}

showClaims(email);
