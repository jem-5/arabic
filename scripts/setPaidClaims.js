// scripts/setPaidClaims.js
const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json"); // path to your key

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function setPaidMemberClaim() {
  const paidUserUIDs = ["4cNYPl8AulOUULRGrPp93yn0Hrx2"];

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
