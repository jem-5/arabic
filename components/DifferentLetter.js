// Put these inside your Recorder.js file (or a small separate file and import).
// Make sure to use the component <DifferentLetters .../>

function getAlignment(a = "", b = "") {
  // a = heard, b = expected
  const n = a.length;
  const m = b.length;

  // dp matrix: (m+1) x (n+1)  -> dp[i][j] = cost to convert b[0..i) to a[0..j)
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  // ops matrix for backtrace: 'M' match/sub, 'I' insert (in a), 'D' delete (in a)
  const op = Array.from({ length: m + 1 }, () => Array(n + 1).fill(null));

  for (let i = 0; i <= m; i++) {
    dp[i][0] = i;
    op[i][0] = i === 0 ? null : "D"; // delete from expected
  }
  for (let j = 0; j <= n; j++) {
    dp[0][j] = j;
    op[0][j] = j === 0 ? null : "I"; // insert into heard
  }

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const costSub = b[i - 1] === a[j - 1] ? 0 : 1;
      // substitution / match
      let best = dp[i - 1][j - 1] + costSub;
      let bestOp = "M";
      // deletion (expected char deleted)
      if (dp[i - 1][j] + 1 < best) {
        best = dp[i - 1][j] + 1;
        bestOp = "D";
      }
      // insertion (extra char in heard)
      if (dp[i][j - 1] + 1 < best) {
        best = dp[i][j - 1] + 1;
        bestOp = "I";
      }
      dp[i][j] = best;
      op[i][j] = bestOp;
    }
  }

  // backtrace from dp[m][n]
  const aligned = []; // will build in reverse (we will reverse at the end)
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    const action = op[i][j];
    if (action === "M") {
      // match or substitution
      const expectedChar = b[i - 1];
      const heardChar = a[j - 1];
      const correct = expectedChar === heardChar;
      aligned.push({
        type: correct ? "match" : "substitute",
        expected: expectedChar,
        heard: heardChar,
      });
      i--;
      j--;
    } else if (action === "D") {
      // expected char deleted (missing in heard)
      aligned.push({
        type: "delete", // expected present, heard missing
        expected: b[i - 1],
        heard: "", // missing
      });
      i--;
    } else if (action === "I") {
      // insertion: extra char in heard
      aligned.push({
        type: "insert",
        expected: "",
        heard: a[j - 1],
      });
      j--;
    } else {
      // fallback, shouldn't happen
      if (i > 0 && j > 0) {
        aligned.push({
          type: "substitute",
          expected: b[i - 1],
          heard: a[j - 1],
        });
        i--;
        j--;
      } else if (i > 0) {
        aligned.push({ type: "delete", expected: b[i - 1], heard: "" });
        i--;
      } else if (j > 0) {
        aligned.push({ type: "insert", expected: "", heard: a[j - 1] });
        j--;
      } else break;
    }
  }

  aligned.reverse(); // important — return in reading order from left-to-right
  return aligned; // array of {type, expected, heard}
}

// React component to render the aligned result
export function DifferentLetters({ heard = "", expected = "" }) {
  const alignment = getAlignment(heard, expected);

  // build two rows: expected (what we wanted) and heard (what user said)
  return (
    <div className=" w-full ">
      <div className="flex gap-1 items-center  ">
        <div className="mr-2 text-lg  ">Expected Word:</div>
        <div
          className="flex gap-1 items-center  "
          dir="rtl"
          style={{ unicodeBidi: "plaintext" }}
        >
          {alignment.map((cell, idx) => {
            const key = "e-" + idx;
            const cls =
              cell.type === "match"
                ? " py-0.5 rounded  text-[lightgreen]"
                : cell.type === "substitute"
                ? " py-0.5 rounded   text-[yellow]"
                : cell.type === "delete"
                ? " py-0.5 rounded   text-[red]"
                : " py-0.5 rounded  text-[gray]"; // insert
            return (
              <div key={key} className={`${cls} text-xl`} title={cell.type}>
                {cell.expected || "•"}
              </div>
            );
          })}{" "}
        </div>
      </div>

      <div className="flex gap-1 items-center mt-1 ">
        <div className="mr-2 text-lg ">Heard Word:</div>
        <div
          className="flex gap-1 items-center  "
          dir="rtl"
          style={{ unicodeBidi: "plaintext" }}
        >
          {alignment.map((cell, idx) => {
            const key = "h-" + idx;
            const cls =
              cell.type === "match"
                ? " py-0.5 rounded  text-[lightgreen]"
                : cell.type === "substitute"
                ? " py-0.5 rounded  text-[yellow]"
                : cell.type === "insert"
                ? " py-0.5 rounded  text-[lightblue]"
                : " py-0.5 rounded   text-[red]"; // delete -> missing in heard
            return (
              <div key={key} className={`${cls} text-xl`} title={cell.type}>
                {cell.heard || "•"}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
