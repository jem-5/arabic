import { useState, useEffect } from "react";
import { Volume2, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MyButton from "./Button";

export default function ReviewMissedWords({ wordsToReview = [], onClose }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewed, setReviewed] = useState([]);
  const [queue, setQueue] = useState(() => [...wordsToReview]);

  useEffect(() => {
    setQueue([...wordsToReview]);
    setCurrentIndex(0);
    setReviewed([]);
  }, [wordsToReview]);

  // when the modal opens, try to scroll the nearest scrollable ancestor to the top
  useEffect(() => {
    if (typeof document === "undefined") return;

    const isScrollable = (el) => {
      if (!el) return false;
      const style = getComputedStyle(el);
      const overflowY = style.overflowY;
      const canScroll = el.scrollHeight > el.clientHeight;
      return (
        canScroll &&
        (overflowY === "auto" ||
          overflowY === "scroll" ||
          overflowY === "overlay")
      );
    };

    const getScrollableParent = (el) => {
      let parent = el && el.parentElement;
      while (parent) {
        if (isScrollable(parent)) return parent;
        parent = parent.parentElement;
      }
      // fallback to document scrolling element
      return document.scrollingElement || document.documentElement;
    };

    // find the current component's DOM node
    // use a microtask so that the modal DOM is present
    Promise.resolve().then(() => {
      const node =
        document.querySelector("[data-review-missed]") || document.body;
      const scrollParent = getScrollableParent(node);
      try {
        if (scrollParent && scrollParent.scrollTo) {
          scrollParent.scrollTo({ top: 0, behavior: "auto" });
        } else if (scrollParent) {
          scrollParent.scrollTop = 0;
        }
      } catch (e) {
        // fallback to window
        try {
          window.scrollTo({ top: 0 });
        } catch (_) {
          /* ignore */
        }
      }
    });
  }, []);

  const currentWord = queue[currentIndex];

  const handleAudioPlay = (audioUrl) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  const handleRemembered = () => {
    if (!currentWord) return;
    setReviewed((prev) => [...prev, currentWord]);

    const newQueue = [...queue];
    newQueue.splice(currentIndex, 1);

    if (newQueue.length === 0) {
      setQueue([]);
      setCurrentIndex(0);
    } else {
      // If we removed the last item, wrap to start; otherwise keep same index so next item fills the slot
      setQueue(newQueue);
      if (currentIndex >= newQueue.length) {
        setCurrentIndex(0);
      }
    }
  };

  const handleShowLater = () => {
    if (!currentWord) return;
    // Move current word to end of queue
    const newQueue = [...queue];
    const [word] = newQueue.splice(currentIndex, 1);
    newQueue.push(word);
    // keep the index the same so the next item appears in this slot
    const nextIndex = currentIndex >= newQueue.length ? 0 : currentIndex;
    setQueue(newQueue);
    setCurrentIndex(nextIndex);
  };

  const handleClose = () => {
    onClose?.();
  };

  const total = wordsToReview.length;
  const allDone = reviewed.length === total && queue.length === 0;

  return (
    <div
      data-review-missed
      className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 pt-12"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-amber-950 opacity-70" />
      <div className="relative z-10 bg-white/10 backdrop-blur-md rounded-2xl p-6 w-full max-w-md shadow-2xl text-center border border-white/20 overflow-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-white hover:text-amber-300"
        >
          <X size={24} />
        </button>

        <AnimatePresence mode="wait">
          {!allDone ? (
            <motion.div
              key={currentWord?.id || currentIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-4xl font-semibold text-amber-200 mb-2 font-[Scheherazade]">
                {currentWord?.arabic}
              </h2>
              <p className="text-lg text-white/80 italic mb-1">
                {currentWord?.transliteration}
              </p>
              <p className="text-white/60 mb-4">{currentWord?.english}</p>

              <button
                onClick={() => handleAudioPlay(currentWord?.audio)}
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-3 mb-4"
              >
                <Volume2 />
              </button>

              <div className="flex justify-center gap-4">
                <MyButton
                  func={handleRemembered}
                  classRest="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                  text="I remembered it"
                />
                <MyButton
                  func={handleShowLater}
                  classRest="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
                  text="Show again"
                />
              </div>

              <p className="text-sm text-white/40 mt-4">
                {reviewed.length} remembered • {queue.length} remaining
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-white"
            >
              <h2 className="text-3xl font-bold mb-2 text-amber-300">
                🎉 All reviewed!
              </h2>
              <p className="text-white/80 mb-4">
                The desert breeze whispers — you’ve mastered your missed words.
              </p>
              <button
                onClick={handleClose}
                className="bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg text-white"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
