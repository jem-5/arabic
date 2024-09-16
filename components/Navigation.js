"use client";
import React from "react";

export const Navigation = () => {
  return (
    <div className="navbar bg-base-100 opacity-80 h-28 flex flex-row   ">
      <div className="w-3/4 m-auto max-[999px]:w-full">
        <div className="flex-1  ">
          <a className="btn btn-ghost text-xl text-black h-24" href="/">
            <img src="Arabic Road Logo" src="./logo.png" className="h-24" />
          </a>
        </div>
        <div className="flex-none">
          <a href="/">
            <button className="btn btn-square btn-ghost">
              <svg
                className="w-[35px] h-[35px] text-black dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fillRule="evenodd"
                  d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </a>

          <button
            onClick={() => {
              document.getElementById("my_profile").showModal();
            }}
            className="btn btn-square btn-ghost"
          >
            <svg
              className="w-[35px] h-[35px] text-black dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 20a7.966 7.966 0 0 1-5.002-1.756l.002.001v-.683c0-1.794 1.492-3.25 3.333-3.25h3.334c1.84 0 3.333 1.456 3.333 3.25v.683A7.966 7.966 0 0 1 12 20ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.5-4.44 9.963-9.932 10h-.138C6.438 21.962 2 17.5 2 12Zm10-5c-1.84 0-3.333 1.455-3.333 3.25S10.159 13.5 12 13.5c1.84 0 3.333-1.455 3.333-3.25S13.841 7 12 7Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
