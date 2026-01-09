"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/context/AuthContext";

import { useRouter } from "next/navigation";
import signout from "@/firebase/auth/signout";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { db } from "@/firebase/config";

import { doc, getDoc, updateDoc } from "firebase/firestore";

import BadgeGrid from "./Badges";
import MyButton from "./Button";
import { badges } from "./Badges";
import useStreak from "./Streak";
import ReviewMissedWords from "./ReviewMissedWords";
import WordList from "./WordList";
import { getAuth } from "firebase/auth";

export const Profile = () => {
  const [signInMode, setSignInMode] = useState(true);
  const { user, userProfile, refetchUser, isPaidMember, boughtPracticePack } =
    useAuthContext();
  const router = useRouter();
  const [wordsToReview, setWordsToReview] = useState([]);

  const [userBadges, setUserBadges] = useState(badges);
  const [removingIndex, setRemovingIndex] = useState(null);
  const StreakBadge = useStreak().StreakBadge;
  const streak = useStreak().streak;
  const [showReview, setShowReview] = useState(false);
  const [savedWords, setSavedWords] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedWords") || "[]");
    } catch (e) {
      return [];
    }
  });

  const playAudio = (src) => {
    if (!src) return;
    const audio = new Audio(src);
    audio.play().catch((err) => console.warn("Audio playback failed:", err));
  };

  const checkBadges = useCallback((user, badges) => {
    return badges.map((badge) => {
      const { requirement } = badge;
      let unlocked = false;

      if (
        requirement.completedModules &&
        safeCount(user.completedModules) >= requirement.completedModules
      )
        unlocked = true;

      if (
        requirement.reviewedModules &&
        safeCount(user.reviewedModules) >= requirement.reviewedModules
      )
        unlocked = true;

      return { ...badge, unlocked };
    });
  }, []);

  const updateWordsToReview = useCallback(async () => {
    if (!user?.uid) return;

    const userData = await refetchUser(user.uid);
    if (!userData) return;

    // badges
    setUserBadges(checkBadges(userData, badges));

    // words to review
    setWordsToReview(userData.missedWords || []);
  }, [user?.uid, refetchUser, checkBadges]);

  const downloadPdf = async () => {
    if (!user) return;

    const token = await user.getIdToken();

    // Store token briefly (cookie or memory)
    document.cookie = `pdfToken=${token}; path=/; max-age=60; secure; samesite=strict`;

    window.open(`/api/pdf?name=AllModules`, "_blank");
  };

  // Keep savedWords in sync with localStorage
  useEffect(() => {
    try {
      async function updateToken() {
        if (!user) return;
        await user.getIdToken(true);
      }
      updateToken();
      const stored = JSON.parse(localStorage.getItem("savedWords") || "[]");
      setSavedWords(stored);
    } catch (e) {
      setSavedWords([]);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem("savedWords", JSON.stringify(savedWords || []));
    } catch (e) {
      // ignore storage errors
    }
  }, [savedWords]);

  const handleRemoveSavedWord = (item) => {
    const filteredWords = (savedWords || []).filter(
      (word) => word.english !== item.english
    );
    // update state; effect will sync localStorage
    setSavedWords(filteredWords);
  };

  // remove a word from the user's review list and update Firestore
  const removeWord = async (word) => {
    if (!user?.uid) return;
    try {
      // setRemovingIndex(index);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const userData = userSnap.data();

      const missedWords = userData.missedWords || [];

      const filtered = missedWords.filter(
        (w) =>
          !(
            w.english === word.english &&
            w.arabic === word.arabic &&
            w.transliteration === word.transliteration
          )
      );

      await updateDoc(userRef, { missedWords: filtered });
      await updateWordsToReview();
    } catch (err) {
      console.error("Failed to remove word:", err);
    } finally {
      setRemovingIndex(null);
    }
  };

  useEffect(() => {
    if (user?.uid) updateWordsToReview();
  }, [user?.uid, updateWordsToReview]);

  const safeCount = (val) => {
    if (Array.isArray(val)) return val.length;
    if (typeof val === "number") return val;
    if (val == null) return 0;
    if (typeof val === "object") return Object.keys(val).length;
    return 0;
  };

  // Format ISO date strings into a more human-friendly representation
  const formatDate = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    if (Number.isNaN(d.getTime())) return isoString;
    // e.g. "Oct 17, 2025" - uses user's locale by default
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  console.log(wordsToReview);
  return (
    <div
      className=" bg-gradient-to-br from-[#fff8e7] to-[#fff2d5]  
            rounded-2xl shadow-2xl w-full p-6 relative z-50 text-neutral "
    >
      <h3 className="font-bold text-2xl   mb-2">Profile</h3>

      {user ? (
        <>
          {user && (
            <>
              <p className="text-lg ">{user.email}</p>
              <div className="grid grid-cols-2 gap-2 my-2">
                <p className="text-lg ">Member Since</p>
                <p className="text-lg ">
                  {formatDate(user?.metadata?.creationTime)}
                </p>
                <p className="text-lg ">Membership Type </p>
                <p className="text-lg ">
                  {isPaidMember
                    ? "Paid Member"
                    : boughtPracticePack
                    ? "Practice Pack Member"
                    : "Free Member"}
                </p>
              </div>
              <MyButton func={signout} text={"Sign Out"} />
            </>
          )}

          {(boughtPracticePack || isPaidMember) && (
            <>
              <hr className="my-3" />
              <p className="font-bold text-2xl   mb-2 ">
                Download Complete Arabic Road Vocabulary
              </p>

              <MyButton func={() => downloadPdf()} text={`Download PDF`} />
            </>
          )}

          {streak && streak.currentStreak > 0 && (
            <>
              <hr className="my-3" />
              <p className="font-bold text-2xl   mb-2 ">Your Streaks </p>
              <div className="flex flex-col md:flex-row justify-start">
                <StreakBadge type="current" size="med" className="text-left" />
                <StreakBadge type="longest" size="med" className="text-left" />
              </div>
            </>
          )}

          <hr className="my-3" />
          <BadgeGrid badges={userBadges} />
          <hr className="my-3" />
          <p className="font-bold text-2xl   mb-2 ">
            Words You&apos;ve Missed: {wordsToReview.length}
          </p>
          <WordList
            words={wordsToReview}
            playAudio={playAudio}
            removeWord={removeWord}
          />

          {showReview && (
            <ReviewMissedWords
              wordsToReview={wordsToReview}
              onClose={() => setShowReview(false)}
            />
          )}

          {wordsToReview.length > 0 && (
            <MyButton
              func={() => setShowReview(true)}
              classRest="bg-amber-700 text-white px-4 py-2 rounded-lg"
              text="Review Missed Words"
            />
          )}

          <hr className="my-3" />
          <p className="font-bold text-2xl   mb-2 ">
            Words You&apos;ve Saved: {savedWords ? savedWords.length : null}
          </p>
          <WordList
            words={savedWords}
            playAudio={playAudio}
            removeWord={handleRemoveSavedWord}
          />

          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 close2"
              id="closebtn"
            >
              ✕
            </button>
          </form>
        </>
      ) : signInMode ? (
        <>
          <p className="text-lg text-secondary">
            You are not signed in. Sign in below.
          </p>
          <SignInForm />
          <p
            className="text-base text-secondary "
            onClick={() => setSignInMode(false)}
          >
            Not registered yet? Sign up{" "}
            <span className="underline cursor-pointer">here.</span>
          </p>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 close"
              id="closebtn"
            >
              ✕
            </button>
          </form>
        </>
      ) : (
        <>
          <p className="text-lg text-secondary">
            You are not signed in. Register an account below.
          </p>
          <SignUpForm />
          <p
            className="text-base text-secondary"
            onClick={() => setSignInMode(true)}
          >
            Already have an account? Sign in{" "}
            <span className="underline cursor-pointer">here.</span>
          </p>
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 close"
              id="closebtn"
            >
              ✕
            </button>
          </form>
        </>
      )}
    </div>
  );
};
