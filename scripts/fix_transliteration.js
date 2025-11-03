const fs = require("fs");
const path = require("path");

const dataDir = path.join(__dirname, "..", "data");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...walk(full));
    else if (e.isFile() && full.endsWith(".js")) files.push(full);
  }
  return files;
}

function fixFile(filePath) {
  const src = fs.readFileSync(filePath, "utf8");
  let changed = false;
  const newSrc = src.replace(
    /(\btransliteration\s*:\s*)(['"`])([\s\S]*?)\2/g,
    (m, pfx, quote, val) => {
      if (!val) return m;
      const first = val.charAt(0);
      const lowered = first.toLowerCase();
      if (first === lowered) return m; // already lowercase
      const newVal = lowered + val.slice(1);
      changed = true;
      return `${pfx}${quote}${newVal}${quote}`;
    }
  );

  if (changed) {
    fs.writeFileSync(filePath, newSrc, "utf8");
    return true;
  }
  return false;
}

function main() {
  if (!fs.existsSync(dataDir)) {
    console.error("data directory not found at", dataDir);
    process.exit(1);
  }
  const files = walk(dataDir);
  const modified = [];
  for (const f of files) {
    const did = fixFile(f);
    if (did) modified.push(f);
  }
  console.log(`Scanned ${files.length} .js files under data/`);
  if (modified.length) {
    console.log("Modified files:");
    for (const m of modified) console.log(" -", m);
  } else console.log("No files needed changes.");
}

main();
