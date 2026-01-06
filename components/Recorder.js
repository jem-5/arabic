"use client";
import { useState, useRef, useEffect } from "react";
import SpeechStatusUI from "./SpeechStatusUI";
import { DifferentLetters } from "./DifferentLetter";
import PronunciationGuide from "@/data/PronunciationGuide";
import {
  normalizeArabic,
  similarityScore,
} from "@/helpers/pronunciationFunctions";

export default function Recorder({
  currentWord,
  enabled = true,
  onScore,
  nativeAudio,
}) {
  const [status, setStatus] = useState("idle");
  const [heardWord, setHeardWord] = useState("");
  const [score, setScore] = useState(null);
  const detailsRef = useRef(null);
  const recognitionRef = useRef(null);
  const recognitionStartTimerRef = useRef(null);
  const isRecordingRef = useRef(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const chunksRef = useRef([]);
  const hasFinalizedRef = useRef(false);

  const [userRecordingUrl, setUserRecordingUrl] = useState(null);

  useEffect(() => {
    resetAll();
  }, [currentWord]);

  const resetAll = () => {
    setStatus("idle");
    setHeardWord("");
    setScore(null);
    isRecordingRef.current = false;
    setIsRecording(false);
  };

  const updateStatus = (score) => {
    if (score >= 70) {
      setStatus("recognized");
    } else if (score > 0 && score < 70) {
      setStatus("incorrect");
    } else {
      setStatus("no_speech");
    }
  };

  // async function beginSpeechRecognition() {
  //   resetAll();
  //   const SpeechRecognition =
  //     window.SpeechRecognition || window.webkitSpeechRecognition || null;
  //   if (!SpeechRecognition) {
  //     setStatus(
  //       "SpeechRecognition is not available in this browser. Please use either Chrome or Edge for best support."
  //     );
  //     alert(
  //       "Speech Recognition is not available in this browser. Please use either Chrome or Edge for best support."
  //     );
  //     return;
  //   }
  //   try {
  //     const r = new SpeechRecognition();
  //     r.lang = "ar-EG";
  //     r.maxAlternatives = 1;
  //     r.continuous = true;
  //     r.interimResults = false;

  //     r.onstart = () => {
  //       setStatus("listening");
  //       setIsRecording(true);
  //     };

  //     r.onresult = (e) => {
  //       let word = e.results[0][0].transcript;
  //       setStatus("processing");
  //       const normalizedHeard = normalizeArabic(word);
  //       const normalizedExpected = normalizeArabic(currentWord);
  //       setHeardWord(normalizedHeard);
  //       const score = similarityScore(normalizedHeard, normalizedExpected);
  //       setScore(score); // inside onresult final
  //       updateStatus(score);
  //       if (onScore && score > 0) onScore(score);
  //     };
  //     r.onerror = (e) => setStatus("Error: " + e.error || e.message);
  //     r.onend = () => {
  //       // setStatus((prev) => (prev ? prev + " (ended)" : "Ended"));
  //       setIsRecording(false);
  //     };
  //     r.start();
  //     setTimeout(() => {
  //       try {
  //         r.stop();
  //       } catch (err) {}
  //     }, 4000);
  //   } catch (e) {
  //     setStatus("Failed to start recognition: " + (e.message || e));
  //   }
  // }

  async function beginSpeechRecognition() {
    resetAll();
    hasFinalizedRef.current = false;
    chunksRef.current = [];

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition || null;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported");
      return;
    }

    try {
      // 🎤 MIC STREAM
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = finalizeRecording;

      mediaRecorder.start();
      isRecordingRef.current = true;
      setIsRecording(true);

      // 🧠 SPEECH RECOGNITION
      const r = new SpeechRecognition();
      recognitionRef.current = r;

      r.lang = "ar-EG";
      r.continuous = false;
      r.interimResults = false;

      r.onstart = () => setStatus("listening");

      r.onresult = (e) => {
        const word = e.results[0][0].transcript;
        setStatus("processing");

        const normalizedHeard = normalizeArabic(word);
        const normalizedExpected = normalizeArabic(currentWord);

        setHeardWord(normalizedHeard);

        const score = similarityScore(normalizedHeard, normalizedExpected);
        setScore(score);
        updateStatus(score);

        if (onScore && score > 0) onScore(score);
      };

      r.onerror = () => stopAll();
      r.onend = () => stopAll();

      r.start();

      // ⏱ Auto stop after 4s
      recognitionStartTimerRef.current = setTimeout(stopAll, 4000);
    } catch (err) {
      setStatus("Mic error");
    }
  }

  const playAB = async () => {
    if (!userRecordingUrl || !nativeAudio) return;
    const user = new Audio(userRecordingUrl);
    const native = new Audio(nativeAudio);

    await native.play();
    native.onended = () => user.play();
  };

  // const stopRecording = () => {
  //   if (!isRecordingRef.current) return;
  //   mediaRecorderRef.current?.stop();

  //   streamRef.current?.getTracks().forEach((track) => track.stop());
  //   streamRef.current = null;

  //   setStatus("processing");
  //   isRecordingRef.current = false;
  //   setIsRecording(false);
  //   updateStatus(score);
  //   try {
  //     recognitionRef.current?.stop();
  //   } catch (e) {
  //     try {
  //       recognitionRef.current?.abort?.();
  //     } catch (err) {}
  //   }
  //   recognitionRef.current = null;

  //   if (recognitionStartTimerRef.current) {
  //     clearTimeout(recognitionStartTimerRef.current);
  //     recognitionStartTimerRef.current = null;
  //   }
  // };

  const stopAll = () => {
    if (!isRecordingRef.current) return;

    isRecordingRef.current = false;
    setIsRecording(false);

    try {
      recognitionRef.current?.stop();
    } catch {}

    try {
      mediaRecorderRef.current?.stop();
    } catch {}

    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (recognitionStartTimerRef.current) {
      clearTimeout(recognitionStartTimerRef.current);
      recognitionStartTimerRef.current = null;
    }
  };

  const normalizedCurrent = normalizeArabic(currentWord);
  const showShortWordWarning = normalizedCurrent.length <= 3;

  const finalizeRecording = () => {
    if (hasFinalizedRef.current) return;
    hasFinalizedRef.current = true;

    if (!chunksRef.current.length) return;

    const blob = new Blob(chunksRef.current, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);

    setUserRecordingUrl(url);
  };

  return (
    <div>
      <div className="flex  items-center justify-end gap-2">
        <div className="flex items-center justify-end  ">Record:</div>
        {!isRecording && (
          <button
            onClick={enabled ? beginSpeechRecognition : undefined}
            disabled={!enabled}
            className={`rounded-full text-2xl hover:cursor-pointer bg-[black] p-2 hover:scale-110 transition-transform ${
              enabled
                ? "bg-black hover:scale-110 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed opacity-50"
            }`}
          >
            🎤
          </button>
        )}

        {isRecording && (
          <button
            onClick={() => stopAll()}
            className="rounded-full text-2xl hover:cursor-pointer bg-[red] p-2 hover:scale-110 transition-transform"
          >
            ◼
          </button>
        )}
      </div>

      <SpeechStatusUI status={status} />
      {heardWord !== "" && (
        <div className="text-lg mt-2">
          You said: <span className="font-bold">{heardWord}</span>
        </div>
      )}
      {score > 0 ? (
        <div className="text-lg mt-2">
          Pronunciation Score:{" "}
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

      {userRecordingUrl && (
        <div className="  text-lg mt-2 flex items-center gap-2">
          Compare:
          <div
            className="inline-flex rounded-full text-xl items-center leading-none justify-center hover:cursor-pointer bg-[black] p-2 hover:scale-110 transition-transform aspect-square  "
            onClick={() => playAB()}
          >
            ⇄
          </div>
        </div>
      )}

      {heardWord && (
        <div
          ref={detailsRef}
          tabIndex={0}
          className="collapse  bg-base text-[white] border-[white] border mt-2"
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
            <DifferentLetters heard={heardWord} expected={currentWord} />
            <div className=" mr-2 text-lg  ">Letters You Missed:</div>
            {(() => {
              const heard = normalizeArabic(heardWord || "");
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

      {showShortWordWarning && score !== null && score >= 0 && score <= 50 && (
        <div className="bg-warning rounded p-2 text-[black] mt-2">
          🚩 Note: Short words can be difficult to capture. Try slightly
          prolonging or exaggerating your pronunciation.
        </div>
      )}
    </div>
  );
}
