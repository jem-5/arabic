import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import "@/firebase/firebaseAdmin";
import VerbConjugations from "@/data/VerbConjugations";

export async function GET(req) {
  let isPaidUser = false;
  try {
    const authHeader = req.headers.get("authorization");
    console.log("Auth Header:", authHeader);
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);
    const decodedToken = await getAuth().verifyIdToken(token);
    console.log("Decoded Token:", decodedToken);
    isPaidUser = decodedToken.isPaidMember === true;
  } catch (error) {
    isPaidUser = false;
    console.error("Error verifying token:", error);

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const verbs = VerbConjugations.map((verb, index) => {
    const base = {
      id: index,
      english: verb.english,
      arabic: verb.verb,
      transliteration: verb.transliteration,
      premium: index >= 10,
    };

    if (isPaidUser || index < 10) {
      return {
        ...base,
        pastTense: verb.pastTense,
        presentTense: verb.presentTense,
        futureTense: verb.futureTense,
      };
    } else {
      return base;
    }
  });

  return NextResponse.json({ verbs, isPaidUser }, { status: 200 });
}
