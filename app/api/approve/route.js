import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import "@/firebase/firebaseAdmin";
import { AllModules, freeModules } from "@/data/AllModules";

// This will check that user is paid member before sneding over data for premium content

export async function GET(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = await getAuth().verifyIdToken(token);

    const { searchParams } = new URL(req.url);
    const topic = searchParams.get("topic");

    if (!topic || !AllModules[topic]) {
      return NextResponse.json({ error: "Invalid topic" }, { status: 400 });
    }

    const isFree = Object.keys(freeModules).includes(topic);
    const isPaid = decodedToken.isPaidMember === true;

    if (!isFree && !isPaid) {
      return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
    }

    return NextResponse.json(
      { approved: true, lesson: AllModules[topic] },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
