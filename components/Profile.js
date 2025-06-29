"use client";
import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import signout from "@/firebase/auth/signout";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { db } from "@/firebase/config";
import { getAuth } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { AllModules } from "@/data/AllModules";
import { QuestionAlert } from "./QuestionAlert";

export const Profile = () => {
  const [signInMode, setSignInMode] = useState(true);
  const { user } = useAuthContext();
  const router = useRouter();
  const [wordsToReview, setWordsToReview] = useState([]);
  const authUser = typeof window !== "undefined" ? getAuth().currentUser : null;

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
    if (user?.uid) updateWordsToReview();
  }, [user]);

  return (
    <dialog
      id="my_profile"
      className="modal absolute top-0 left-0 w-screen h-screen "
    >
      <div className="modal-box  ">
        <h3 className="font-bold text-2xl text-secondary mb-2">Profile</h3>

        {user ? (
          <>
            <p className="text-lg text-secondary">
              You are currently signed in.
            </p>

            {authUser && (
              <>
                <p className="text-lg text-secondary">
                  Email: {authUser.email}
                </p>
                <p className="text-lg text-secondary">
                  Member Since: {authUser.metadata.creationTime.slice(0, 16)}
                </p>
                <p className="text-lg text-secondary">
                  Last Login: {authUser.metadata.lastSignInTime.slice(0, 16)}
                </p>
                <button
                  className="btn btn-secondary btn-active"
                  onClick={signout}
                >
                  Sign Out
                </button>
              </>
            )}
            <hr className="my-3" />
            <p className="text-xl text-[#white] ">Words to Review:</p>

            {wordsToReview
              ? wordsToReview.map((item, i) => (
                  <QuestionAlert item={item} key={i} />
                ))
              : "There are no words to review in your profile."}

            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
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
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
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
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
};
