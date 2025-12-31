import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import "@/firebase/firebaseAdmin";

import { AllModules, freeModules } from "@/data/AllModules";
import { buildPdfHtml } from "@/helpers/buildPdfHtml";

// This will generate PDF for lesson vocab
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name");
    const token = searchParams.get("token");
    console.log("token:", token);
    if (!name || !AllModules[name]) {
      return NextResponse.json(
        { error: "Invalid PDF request" },
        { status: 400 }
      );
    }
    const isFree = Object.keys(freeModules).includes(name);

    if (!isFree) {
      if (!token) {
        return new NextResponse("Unauthorized", { status: 401 });
      }

      const decoded = await getAuth().verifyIdToken(token);
      console.log("decoded token:", decoded);

      if (!decoded.isPaidMember) {
        return new NextResponse("Upgrade required", { status: 403 });
      }
    }

    const words = AllModules[name];
    const title = name;

    const browser = await puppeteer.launch({
      headless: "new",
    });

    const page = await browser.newPage();
    const html = buildPdfHtml(words, title);

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "1in",
        bottom: "1in",
        left: "0.75in",
        right: "0.75in",
      },
    });

    await browser.close();

    // ---- Return downloadable PDF ----
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${title}.pdf"`,
      },
    });
  } catch (err) {
    console.log("PDF error:", err);
    return new NextResponse("Unauthorized", { status: 401 });
  }
}
export const dynamic = "force-dynamic";
