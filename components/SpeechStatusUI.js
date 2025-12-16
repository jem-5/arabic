// SpeechStatusUI.js
export default function SpeechStatusUI({ status }) {
  console.log(status);
  return (
    <div className="flex    justify-end mt-2">
      {status === "listening" && (
        <div className="flex items-center gap-2">
          <div className="animate-pulse text-red-600 text-3xl">🎙️</div>
          <div className="text-red-600 font-semibold">Listening...</div>
          <span className="loading loading-bars loading-xl"></span>
        </div>
      )}

      {status === "processing" && (
        <div className="flex items-center gap-2">
          <div className="text-3xl animate-pulse">⏳</div>
          <div className="font-semibold">Processing speech...</div>
        </div>
      )}

      {status === "recognized" && (
        <div className="flex items-center gap-2">
          <div className="text-3xl animate-bounce">🎉</div>
          <div className="font-semibold">Amazing - word recognized!</div>
        </div>
      )}

      {status === "idle" && (
        <>
          <div className="ml-2 font-semibold  ">Press record to start.</div>
        </>
      )}

      {status === "no_speech" && (
        <div className="flex items-center gap-2">
          <div className="text-3xl">⚠️</div>
          <div className="font-semibold text-orange-600">
            Hmm, we did not catch almost anything that time!
          </div>
        </div>
      )}

      {status === "incorrect" && (
        <div className="flex items-center gap-2">
          <div className="text-3xl">🤔</div>
          <div className="font-semibold text-orange-600">
            That is not quite right — try again!
          </div>
        </div>
      )}
    </div>
  );
}
