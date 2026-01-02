import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { AllModules } from "../data/AllModules.js";
import { buildPdfHtml } from "../helpers/buildPdfHtml.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.join(__dirname, "../protected/pdfs");

async function generatePDFs() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  // for (const moduleName of Object.keys(AllModules)) {
  //   const words = AllModules[moduleName];
  //   const title = moduleName;
  //   const html = buildPdfHtml(words, title);
  //   console.log(`Generating PDF for module: ${moduleName}`);
  //   await page.setContent(html, {
  //     waitUntil: "load",
  //     timeout: 0,
  //   });
  //   const outputPath = path.join(OUTPUT_DIR, `${moduleName}.pdf`);
  //   await page.pdf({
  //     path: outputPath,
  //     format: "A4",
  //     printBackground: true,
  //     margin: {
  //       top: "1in",
  //       bottom: "1in",
  //       left: "0.75in",
  //       right: "0.75in",
  //     },
  //   });
  //   console.log(`Saved PDF to: ${outputPath}`);
  // }
  // await browser.close();
  // console.log("All PDFs generated.");

  const allWords = Object.values(AllModules).flat();
  const html = buildPdfHtml(allWords, "Complete Arabic Vocabulary");
  console.log(`Generating PDF for complete vocabulary`);
  await page.setContent(html, {
    waitUntil: "load",
    timeout: 0,
  });
  const outputPath = path.join(OUTPUT_DIR, `Complete_Arabic_Vocabulary.pdf`);
  await page.pdf({
    path: path.join(OUTPUT_DIR, `AllModules.pdf`),
    format: "A4",
    printBackground: true,
    margin: {
      top: "1in",
      bottom: "1in",
      left: "0.75in",
      right: "0.75in",
    },
  });
  console.log(`Saved PDF to: ${outputPath}`);
}

generatePDFs().catch((err) => {
  console.log("Error generating PDFs:", err);
  process.exit(1);
});
