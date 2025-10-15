"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const VocabofDay = ({ wordOfTheDay }) => {
  const playAudio = (src) => {
    if (!src) return;
    const audio = new Audio(src);
    audio.play().catch((err) => console.warn("Audio playback failed:", err));
  };

  return (
    <div className=" stats shadow mt-2 opacity-80 flex m-auto w-fit overflow-hidden ">
      <div
        className="stat flex flew-row items-center justify-center hover:cursor-pointer"
        onClick={() => document.getElementById("vocabofday").showModal()}
      >
        <div className="stat-figure text-primary">
          <img src="/word.png" alt="vocab of the day" />
        </div>
        <div className="stat-title text-sm text-secondary">
          Vocab of the Day
        </div>
      </div>

      <dialog
        id="vocabofday"
        className="modal  fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300  "
        onClick={() => document.getElementById("vocabofday").close()}
      >
        <div
          className="modal-box   bg-gradient-to-br from-[#fff8e7] to-[#fff2d5]  
            rounded-2xl shadow-2xl max-w-full p-6 relative z-50 text-neutral "
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="font-bold text-lg">Arabic Word/Phrase of the Day</h3>
          <h4>{new Date().toLocaleDateString()}</h4>

          <div className="card card-border border-2 border-accent max-w-full mt-2 ml-3 p-2">
            <div>
              <p className="text-xl font-semibold text-neutral">
                {wordOfTheDay.arabic}
              </p>
              <p className="text-sm text-neutral">
                {wordOfTheDay.english} —{" "}
                <span className="italic text-neutral">
                  {wordOfTheDay.transliteration}
                </span>
              </p>
              <p className="text-sm text-neutral italic opacity-85 ">
                Module Name: {wordOfTheDay.module}
              </p>
            </div>
            <button
              onClick={() => playAudio(wordOfTheDay.audio)}
              className="bg-yellow-500  text-neutral rounded-full p-2 shadow-md transition self-end "
            >
              🔊
            </button>
          </div>

          <p className="py-2">
            For more vocabulary similar to this one, check out the{" "}
            <a href={`/lesson?topic=${wordOfTheDay.module}`}>
              <span className="underline">{wordOfTheDay.module} module.</span>{" "}
              Check back tomorrow for a new word!
            </a>
          </p>

          <div className="modal-action ">
            <form
              method="dialog"
              className="flex flex-col sm:flex-row gap-3 items-end"
            >
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};
