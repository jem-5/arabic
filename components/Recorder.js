import { useState, useRef, useEffect } from "react";
import SpeechStatusUI from "./SpeechStatusUI";
import { reset } from "canvas-confetti";
import { DifferentLetters } from "./DifferentLetter";
import PronunciationGuide from "@/data/PronunciationGuide";

export default function Recorder({ onRecognized, currentWord }) {
  const [status, setStatus] = useState("idle");
  const [heardWord, setHeardWord] = useState("");
  const [score, setScore] = useState(null);
  const [interimHeard, setInterimHeard] = useState("");
  const detailsRef = useRef(null);

  const recognitionRef = useRef(null);
  const isRecordingRef = useRef(false);
  const finalResultReceivedRef = useRef(false);
  const recognizedRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  function levenshtein(a, b) {
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

  function similarityScore(heard, expected) {
    if (!heard || !expected) return 0;

    const dist = levenshtein(heard, expected);
    const maxLen = Math.max(heard.length, expected.length);

    // Score = 100% if identical. 0% if completely different.
    const score = ((maxLen - dist) / maxLen) * 100;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  useEffect(() => {
    resetAll();
  }, [currentWord]);

  const resetAll = () => {
    setStatus("idle");
    setHeardWord("");
    setScore(null);
    setInterimHeard("");
    setAudioBlob(null);
    isRecordingRef.current = false;
    finalResultReceivedRef.current = false;
    recognizedRef.current = false;
  };

  function normalizeArabic(str) {
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

    // Remove double letters caused by shadda
    normalized = normalized.replace(/(.)\1/g, "$1");

    return normalized;
  }

  const startRecording = async () => {
    if (isRecordingRef.current) return;
    resetAll();

    // Request microphone access for audio capture
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream; // ← YOU MUST ADD THIS

    mediaRecorderRef.current = new MediaRecorder(stream);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorderRef.current.onstop = () => {
      if (audioChunksRef.current.length === 0) return; // nothing recorded

      const blob = new Blob(audioChunksRef.current, {
        type: "audio/webm; codecs=opus",
      });
      console.log(blob);
      setAudioBlob(blob); // store recording for playback
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };

    mediaRecorderRef.current.start();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    // reset state flags
    finalResultReceivedRef.current = false;
    recognizedRef.current = false;

    setStatus("listening");

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = "ar-EG";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    isRecordingRef.current = true;

    recognition.onstart = () => {
      setScore(null);
      setStatus("listening");
    };

    recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        setInterimHeard(res[0].transcript);

        if (res.isFinal) {
          finalResultReceivedRef.current = true;

          const word = res[0].transcript.trim();
          const normalizedHeard = normalizeArabic(word);
          const normalizedExpected = normalizeArabic(currentWord);

          setHeardWord(normalizedHeard);

          const score = similarityScore(normalizedHeard, normalizedExpected);
          console.log("Score:", score);
          setScore(score); // inside onresult final

          const match = normalizedHeard === normalizedExpected;

          if (score >= 80) {
            recognizedRef.current = true;
            setStatus("recognized");
            onRecognized?.(word);
          } else if (
            (normalizedHeard.length > 0 && score > 0) ||
            (heardWord.length > 0 && score > 0)
          ) {
            setStatus("incorrect");
          } else {
            setStatus("no_speech");
            setHeardWord(normalizedHeard);
          }
          isRecordingRef.current = false;

          recognition.stop();
          return;
        }
      }
    };

    recognition.onerror = () => {
      isRecordingRef.current = false;
      console.log("❌ Speech Recognition Error:", e.error);

      setStatus("idle");
    };

    // 🔥 CRITICAL FIX: prevents "recognized → idle" bug
    recognition.onend = () => {
      const gotFinal = finalResultReceivedRef.current;
      const gotRecognition = recognizedRef.current;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;

      if (!gotFinal && !gotRecognition) {
        setStatus("try_again");
        setHeardWord("");
      }
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      isRecordingRef.current = false;
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (!isRecordingRef.current) return;
    mediaRecorderRef.current?.stop();

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    setStatus("processing");
    isRecordingRef.current = false;

    recognitionRef.current?.stop();
  };

  const isRecording = isRecordingRef.current;
  const normalizedCurrent = normalizeArabic(currentWord);
  const showShortWordWarning = normalizedCurrent.length <= 3;

  const normalizedExpected = normalizeArabic(currentWord);

  return (
    <div>
      <div className="flex  items-center justify-end gap-2">
        <div className="flex items-center justify-end  ">Record:</div>
        {!isRecording && (
          <button
            onClick={startRecording}
            className=" rounded-full text-2xl hover:cursor-pointer bg-[black]    p-2 rounded-full   hover:scale-110 transition-transform"
          >
            🎤
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className=" rounded-full text-2xl hover:cursor-pointer bg-[red]     p-2  hover:scale-110 transition-transform"
          >
            ◼
          </button>
        )}
      </div>
      {audioBlob && (
        <audio
          key={audioBlob ? audioBlob.size : 0} // forces React to recreate audio element
          controls
          className="  w-full  mt-1 "
        >
          <source
            src={URL.createObjectURL(audioBlob)}
            type="audio/webm; codecs=opus"
          />
          Your browser does not support audio playback.
        </audio>
      )}
      <SpeechStatusUI status={status} />
      {heardWord !== "" && (
        <div className="text-lg mt-2">
          You said: <span className="font-bold">{heardWord}</span>
        </div>
      )}
      {score > 0 ? (
        <div className="text-lg mt-2">
          Pronuncation Score:{" "}
          <span
            className={
              "font-bold " +
              (score >= 70
                ? "text-[#15f015]"
                : score >= 50
                ? "text-[yellow]"
                : "text-[red]")
            }
          >
            {score}%
          </span>
        </div>
      ) : null}

      {(heardWord || interimHeard) && (
        <div
          ref={detailsRef}
          tabIndex={0}
          className="collapse  bg-base text-[white] border-[white] border "
        >
          <input
            type="checkbox"
            onChange={(e) => setIsOpen(e.target.checked)}
          />

          <div
            className="collapse-title font-semibold flex justify-between text-lg cursor-pointer"
            onClick={() => {
              const checkbox = detailsRef.current.querySelector(
                "input[type='checkbox']"
              );
              checkbox.checked = !checkbox.checked;
              setIsOpen(checkbox.checked);
            }}
          >
            Pronunciation Details:
            <span>
              <svg
                className={`h-5 w-5 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
          <div className="collapse-content text-sm animate-fadeIn">
            <DifferentLetters
              heard={heardWord || interimHeard}
              expected={currentWord}
            />
            <div className=" mr-2 text-lg  ">Letters You Missed:</div>
            {(() => {
              const heard = normalizeArabic(heardWord || interimHeard || "");
              const expected = normalizeArabic(currentWord || "");
              if (!expected) return <div className="text-sm">—</div>;

              const freq = {};
              for (const ch of expected) freq[ch] = (freq[ch] || 0) + 1;
              for (const ch of heard) {
                if (freq[ch]) freq[ch]--;
              }

              const missed = Object.entries(freq).flatMap(([ch, count]) =>
                count > 0 ? Array(count).fill(ch) : []
              );

              if (missed.length === 0) {
                return (
                  <div className="text-sm text-green-400">
                    None — terrific job!
                  </div>
                );
              }

              return (
                <div className="flex flex-wrap gap-1">
                  {missed.map((ch, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 border-2 border-[white] text-[white] rounded"
                    >
                      {ch} -{" "}
                      {PronunciationGuide.find((item) => item.letter === ch)
                        ?.name || "Unknown Letter"}
                      :{" "}
                      {PronunciationGuide.find((item) => item.letter === ch)
                        ?.tips || "No tips available."}
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <div className="mt-2 text-md text-gray-500">
        {interimHeard && !heardWord && (
          <>
            Heard so far: <span>{interimHeard}</span>
          </>
        )}
      </div>

      {(showShortWordWarning &&
        score >= 0 &&
        score <= 50 &&
        status === "idle") ||
        (showShortWordWarning &&
          score >= 0 &&
          score <= 50 &&
          status === "incorrect") ||
        (showShortWordWarning &&
          score >= 0 &&
          score <= 50 &&
          status === "no_speech" && (
            <div className="bg-warning rounded p-2 text-[black] ">
              🚩 Note: Short words can be difficult to capture. Try slightly
              prolonging your pronunciation.
            </div>
          ))}
    </div>
  );
}
