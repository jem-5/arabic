import { useState, useEffect } from "react";

function useStreak() {
  const [streak, setStreak] = useState({
    currentStreak: 0,
    lastStudied: null,
    longestStreak: 0,
  });

  // Load streak from localStorage on mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("streakData"));
    if (stored) setStreak(stored);
  }, []);

  const updateStreak = (didStudyToday) => {
    const today = new Date().toDateString();
    let newStreak = { ...streak };

    if (didStudyToday && newStreak.lastStudied !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (newStreak.lastStudied === yesterday.toDateString()) {
        newStreak.currentStreak += 1;
      } else {
        newStreak.currentStreak = 1;
      }

      if (newStreak.currentStreak > newStreak.longestStreak) {
        newStreak.longestStreak = newStreak.currentStreak;
      }

      newStreak.lastStudied = today;
      localStorage.setItem("streakData", JSON.stringify(newStreak));
      setStreak(newStreak);
    }
  };

  const StreakBadge = ({ size = "sm", type = "current" }) => {
    const sizeClasses = size === "sm" ? "text-sm" : "text-md";
    return (
      <div className=" stats shadow mt-2 opacity-80 flex m-auto overflow-hidden   ">
        <div className="stat flex flew-row items-center justify-center gap-1 ">
          <div className="stat-figure ">🔥</div>
          {type === "longest" ? (
            <div className={`stat-title  text-secondary ${sizeClasses} `}>
              Longest Streak: {streak.longestStreak} days
            </div>
          ) : (
            <div className={`stat-title   text-secondary ${sizeClasses}`}>
              Current Streak: {streak.currentStreak} days
            </div>
          )}
        </div>
      </div>
    );
  };

  return { streak, updateStreak, StreakBadge };
}
export default useStreak;
