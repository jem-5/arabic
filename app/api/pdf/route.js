import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

// If user is paid, provide access to protected PDFs
export async function GET(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("pdfToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const decoded = await getAuth().verifyIdToken(token);
  if (!decoded.isPaidMember && !decoded.boughtPracticePack) {
    return NextResponse.json({ error: "Upgrade required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  const pdfPath = path.join(process.cwd(), "protected/pdfs", `${name}.pdf`);

  if (!fs.existsSync(pdfPath)) {
    return NextResponse.json({ error: "PDF not found" }, { status: 404 });
  }

  const file = fs.readFileSync(pdfPath);

  return new NextResponse(file, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${name}.pdf"`,
    },
  });
}
