const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function revokePaidClaim(uid) {
  // Get existing claims
  const user = await admin.auth().getUser(uid);
  const currentClaims = user.customClaims || {};

  // Remove paid-related claims
  const {
    isPaidMember,
    plan,
    membershipType,
    boughtPracticePack,

    ...remainingClaims
  } = currentClaims;

  await admin.auth().setCustomUserClaims(uid, remainingClaims);

  console.log(`✅ Paid claims removed for ${uid}`);
}

(async () => {
  const UID = "CkhgVrOSI3Yb3S0PFtqj5LAraZo2"; // replace
  await revokePaidClaim(UID);
  process.exit();
})();
