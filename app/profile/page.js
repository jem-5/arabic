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
    if (user?.uid) {
      updateWordsToReview();
    }
  }, [user]);

  return (
    <main className="flex-grow flex flex-col items-left p-3 text-secondary w-1/2 bg-base-100  rounded-md mt-2 drop-shadow-xl border gap-3  max-[999px]:w-4/5 ">
      <h3 className="font-bold text-2xl text-secondary mb-2">Profile</h3>

      {user ? (
        <>
          <p className="text-lg ">You are currently signed in.</p>
          <p className="text-lg">
            Membership Status:{" "}
            {isPaidMember ? (
              <span className="text-green-600 font-semibold">
                Premium Member
              </span>
            ) : (
              <span className="text-yellow-600 font-semibold">Free Member</span>
            )}
          </p>

          {authUser && (
            <>
              <p className="text-lg  ">Email: {authUser.email}</p>
              <p className="text-lg  ">
                Member Since: {authUser.metadata.creationTime.slice(0, 16)}
              </p>
              <p className="text-lg">
                Last Login: {authUser.metadata.lastSignInTime.slice(0, 16)}
              </p>
            </>
          )}
          <button
            className="btn btn-secondary btn-active my-2 w-1/2"
            onClick={signout}
          >
            Sign Out
          </button>
          <hr className="my-3" />
          <p className="text-xl text-secondary">Words to Review:</p>
          {wordsToReview.length > 0
            ? wordsToReview.map((item, i) => (
                <QuestionAlert item={item} key={i} />
              ))
            : "There are no words to review in your profile."}
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
        </>
      ) : (
        <>
          <p className="text-lg text-secondary">
            You are not signed in. Create an account below.
          </p>
          <SignUpForm />
          <p
            className="text-base text-secondary"
            onClick={() => setSignInMode(true)}
          >
            Already have an account? Sign in{" "}
            <span className="underline cursor-pointer">here.</span>
          </p>
        </>
      )}
    </main>
  );
}
