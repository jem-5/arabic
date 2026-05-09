// scripts/setPaidClaims.js
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // path to your key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setPaidMemberClaim() {
  const paidUserUIDs = ["oW9wrTxwM7U0Yhm4InZr7J6ifAn1"];

  for (const uid of paidUserUIDs) {
    await admin.auth().setCustomUserClaims(uid, {
      isPaidMember: true,
      membershipType: "one-time",
    });

    console.log(`✅ Custom claim set for ${uid}`);
  }

  process.exit();
}

setPaidMemberClaim().catch(console.error);
