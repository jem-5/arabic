export function buildPdfHtml(words, title) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <style>
    body {
      font-family: Arial, sans-serif;
      padding: 32px;
    }

    h1 {
      text-align: center;
      margin-bottom: 40px;
    }

      /* 🔑 2-column layout */
  .columns {
    column-count: 2;
    column-gap: 32px;
  }

    .row {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .arabic {
      font-size: 28px;
      direction: rtl;
      text-align: left;
    }

    .transliteration {
      font-style: italic;
      color: #555;
      margin-top: 4px;
    }

    .english {
      font-weight: bold;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>

    <div class="columns">

  ${words
    .map(
      (w) => `
        <div class="row">
          <div class="arabic">${w.arabic}</div>
          <div class="transliteration">${w.transliteration || ""}</div>
          <div class="english">${w.english}</div>
        </div>
      `
    )
    .join("")}
    </div>
</body>
</html>
`;
}
