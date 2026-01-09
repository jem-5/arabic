import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import "@/firebase/firebaseAdmin";
import VerbConjugations from "@/data/VerbConjugations";

export async function GET(req) {
  let isPaidUser = false;
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);

    isPaidUser = decodedToken.isPaidMember === true;
  } catch (error) {
    isPaidUser = false;

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
