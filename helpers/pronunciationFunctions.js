export function levenshtein(a, b) {
  const matrix = [];

  // increment along the first column of each row
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  // increment each column in the first row
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // fill in the rest
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

export function similarityScore(heard, expected) {
  if (!heard || !expected) return 0;
  const dist = levenshtein(heard, expected);
  const maxLen = Math.max(heard.length, expected.length);
  const score = ((maxLen - dist) / maxLen) * 100;
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function normalizeArabic(str) {
  if (!str) return "";

  let normalized = str
    .normalize("NFKD")
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, "")
    .replace(/[\u200B-\u200F]/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "")
    .trim()
    .replace(/ة/g, "ه")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي");
  normalized = normalized.replace(/(.)\1/g, "$1");
  return normalized;
}
