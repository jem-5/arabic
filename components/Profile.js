"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import signout from "@/firebase/auth/signout";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { db } from "@/firebase/config";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { AllModules } from "@/data/AllModules";
import { QuestionAlert } from "./QuestionAlert";
import BadgeGrid from "./Badges";
import MyButton from "./Button";
import { badges } from "./Badges";

export const Profile = () => {
  const [signInMode, setSignInMode] = useState(true);
  const { user } = useAuthContext();
  const router = useRouter();
  const [wordsToReview, setWordsToReview] = useState([]);

  const [isPaidMember, setIsPaidMember] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const [userBadges, setUserBadges] = useState(badges);
  const [removingIndex, setRemovingIndex] = useState(null);

  const playAudio = (src) => {
    if (!src) return;
    const audio = new Audio(src);
    audio.play().catch((err) => console.warn("Audio playback failed:", err));
  };

  const updateWordsToReview = useCallback(async () => {
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      let userData = userSnap.data();
      // update local profile state
      userData ? setUserProfile(userData) : setUserProfile({});
      // compute badges from the freshly fetched data (not stale state)
      const personalBadges = checkBadges(userData, badges);
      setUserBadges(personalBadges);
      userData.isPaidMember ? setIsPaidMember(true) : setIsPaidMember(false);
      let words = [];
      for (const [key, value] of Object.entries(userData)) {
        if (
          key !== "reviewedModules" &&
          key !== "completedModules" &&
          key !== "isPaidMember" &&
          value.length !== 0
        ) {
          words.push(value);
        }
      }
      let flatArr = words.flat(2);
      setWordsToReview(flatArr);
    }
  }, [user]);

  // remove a word from the user's review list and update Firestore
  const removeWord = async (word, index) => {
    if (!user?.uid) return;
    try {
      setRemovingIndex(index);
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) return;
      const userData = userSnap.data();

      // find which key contains this word (match by english+arabic as identifier)
      let foundKey = null;
      for (const [key, val] of Object.entries(userData)) {
        if (Array.isArray(val)) {
          const match = val.find(
            (w) =>
              w &&
              w.english === word.english &&
              w.arabic === word.arabic &&
              w.transliteration === word.transliteration
          );
          if (match) {
            foundKey = key;
            break;
          }
        }
      }

      if (!foundKey) {
        // nothing to remove
        setRemovingIndex(null);
        return;
      }

      const newArr = (
        Array.isArray(userData[foundKey]) ? userData[foundKey] : []
      ).filter(
        (w) =>
          !(
            w &&
            w.english === word.english &&
            w.arabic === word.arabic &&
            w.transliteration === word.transliteration
          )
      );

      // update Firestore with the new array for that module/key
      await updateDoc(userRef, { [foundKey]: newArr });

      // refresh local state from server to ensure consistency (also recomputes badges)
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

      // if (requirement.streakDays && user.streakDays >= requirement.streakDays)
      //   unlocked = true;

      return { ...badge, unlocked };
    });
  }, []);

  return (
    <div
      className=" bg-gradient-to-br from-[#fff8e7] to-[#fff2d5]  
            rounded-2xl shadow-2xl w-full p-8 relative z-50 text-neutral "
    >
      <h3 className="font-bold text-2xl   mb-2">Profile</h3>

      {user ? (
        <>
          {user && (
            <>
              <p className="text-2xl ">{user.email}</p>
              <div className="grid grid-cols-2 gap-2 my-2">
                <p className="text-lg ">Member Since</p>
                <p className="text-lg ">
                  {formatDate(user?.metadata?.creationTime)}
                </p>
                <p className="text-lg ">Membership Type </p>
                <p className="text-lg ">
                  {isPaidMember ? "Paid Member" : "Free Member"}
                </p>
              </div>

              <MyButton func={signout} text={"Sign Out"} />
            </>
          )}
          <hr className="my-3" />
          <BadgeGrid badges={userBadges} />
          <hr className="my-3" />

          <p className="font-bold text-2xl   mb-2 ">
            Words to Review: {wordsToReview.length}
          </p>

          {wordsToReview ? (
            <ul className="space-y-2">
              {wordsToReview.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-yellow-50 hover:bg-yellow-100 
                      border border-yellow-300 p-3 rounded-lg transition"
                >
                  <div>
                    <p className="text-xl font-semibold text-neutral">
                      {item.arabic}
                    </p>
                    <p className="text-sm text-neutral">
                      {item.english} —{" "}
                      <span className="italic text-neutral">
                        {item.transliteration}
                      </span>
                    </p>
                    <button
                      onClick={() => playAudio(item.audio)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-accent rounded-full p-2 shadow-md transition "
                    >
                      🔊
                    </button>
                  </div>

                  <button
                    onClick={() => removeWord(item, index)}
                    disabled={removingIndex === index}
                    className="ml-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-md transition disabled:opacity-50"
                    title="Remove from review"
                  >
                    🗑
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            "There are no words to review in your profile."
          )}

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
