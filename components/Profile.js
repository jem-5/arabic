"use client";
import React, { useState } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import signout from "@/firebase/auth/signout";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export const Profile = () => {
  const [signInMode, setSignInMode] = useState(true);
  const { user } = useAuthContext();
  const router = useRouter();

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

            <p className="text-lg text-secondary">Email: {user.email}</p>
            <p className="text-lg text-secondary">
              Member Since: {user.metadata.creationTime.slice(0, 16)}
            </p>
            <p className="text-lg text-secondary">
              Last Login: {user.metadata.lastSignInTime.slice(0, 16)}
            </p>

            <button className="btn btn-secondary btn-active" onClick={signout}>
              Sign Out
            </button>
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
