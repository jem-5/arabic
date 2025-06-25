"use client";
import React, { useState } from "react";
import signIn from "@/firebase/auth/signin";
import { getErrorMsg } from "@/helpers/useCustomMessages";
import MyButton from "./Button";

function SignInForm() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmitForm = async (event) => {
    event.preventDefault();
    setErrorMsg(null);
    if (!email || !password)
      return setErrorMsg("Email & password must be entered");
    const { result, error } = await signIn(email, password);
    if (error) {
      setErrorMsg(getErrorMsg(error.code));
      console.log(error.code);
    }
    // console.log(result);
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper ">
        <form
          onSubmit={handleSubmitForm}
          className="form flex flex-col gap-4 items-start"
        >
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="white"
              className="w-4 h-4 opacity-70"
            >
              <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
              <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
            </svg>
            <input
              className="grow text-[whtite]"
              style={{ color: "white" }}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              name="email"
              id="email"
              placeholder="example@mail.com"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="white"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow text-[white]"
              style={{ color: "white" }}
              onChange={(e) => setPassword(e.target.value)}
              required
              name="password"
              id="password"
              placeholder="password"
            />
          </label>

          {errorMsg ? (
            <div role="alert" className="alert alert-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{errorMsg}</span>
            </div>
          ) : null}

          <MyButton
            text="Sign in"
            type="submit"
            classRest={"bg-secondary text-neutral mb-2"}
          />
        </form>
      </div>
    </div>
  );
}

export default SignInForm;
