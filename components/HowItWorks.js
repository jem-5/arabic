"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const HowItWorks = () => {
  return (
    <div className=" stats shadow mt-2 opacity-80 flex  w-1/6 m-auto max-[999px]:w-fit overflow-hidden hover:cursor-pointer  ">
      <div
        className="stat"
        onClick={() => document.getElementById("how_it_works").showModal()}
      >
        <div className="stat-figure text-primary ">
          <img
            src="/info.png"
            alt="how to learn arabic online"
            width="14px"
            height="20px"
          />
        </div>
        <div className="stat-title max-[999px]:text-sm ">How It Works</div>
      </div>

      <dialog id="how_it_works" className="modal ">
        <div className="modal-box ">
          <h3 className="font-bold text-lg">Arabic Road: How It Works</h3>

          <p className="py-2">
            Take a walk through the desert and learn Arabic along the way.
            Choose any individual topic or start at the beginning & proceed
            through all the lessons.
          </p>
          <hr className="mt-2" />

          <p className="py-2">
            For each module, you can choose the Lesson or the Quiz:
          </p>

          <ul>
            <li>
              The Lesson presents flashcards of the relevant vocabulary words /
              phrases / sentences, along with images & audio pronunciation.
            </li>
            <li>
              The Quiz tests your knowledge of all the vocabulary elements in a
              given module.
            </li>
          </ul>

          <hr className="mt-4" />
          <p className="py-2">
            From the dashboard, you can see your progress through the curriculum
            at a glance:
          </p>
          <ul>
            <li className="mb-1">
              <span className="flex flex-row gap-2 items-center">
                <img
                  src="/reviewed1.png"
                  alt={`learn arabic online free`}
                  width="24px"
                  height="24px"
                />{" "}
                indicates you&apos;ve reviewed all flashcards in a given module.
              </span>
            </li>
            <li>
              <span className="flex flex-row gap-2 items-center">
                <img
                  src="/completed.png"
                  alt={`learn arabic online free`}
                  width="24px"
                  height="24px"
                />{" "}
                indicates you&apos;ve aced the quiz for a given module.
              </span>
            </li>
          </ul>

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
