"use client";
import { useAuthContext } from "@/context/AuthContext"; // Import your auth context
import React, { useEffect, useState } from "react";
import signout from "@/firebase/auth/signout";
import SignInForm from "@/components/SignInForm";
import SignUpForm from "@/components/SignUpForm";
import { db } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { QuestionAlert } from "@/components/QuestionAlert";
import { doc, getDoc } from "firebase/firestore";
import { Profile } from "@/components/Profile";

export default function ProfilePage() {
  const [signInMode, setSignInMode] = useState(true);

  const { user, isPaidMember } = useAuthContext();
  const authUser = typeof window !== "undefined" ? getAuth().currentUser : null;
  const [wordsToReview, setWordsToReview] = useState([]);

  const updateWordsToReview = async () => {
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);
    if (userSnap.exists()) {
      let userData = userSnap.data();
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
  };
  useEffect(() => {
    const closeBtn = document.getElementById("closebtn");
    if (closeBtn) {
      console.log("exists");
      closeBtn.style.display = "none";
    }

    if (user?.uid) {
      updateWordsToReview();
    }
  }, [user]);

  return (
    <main className="flex-grow flex flex-col items-left p-3 text-secondary w-1/2   rounded-md mt-2 drop-shadow-xl  gap-3  max-[999px]:w-4/5 ">
      <Profile />
    </main>
  );
}
