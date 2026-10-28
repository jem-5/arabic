"use client";
import React, { useState, useEffect } from "react";
import { useAuthContext, AuthContextProvider } from "@/context/AuthContext";
import { db } from "@/firebase/config";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  setDoc,
  deleteField,
  arrayRemove,
} from "firebase/firestore";
import { AllModules } from "@/data/AllModules";
import StoryData from "@/data/stories/Stories";

export default function LearningRoadmap() {
  const userProfile = useAuthContext();
  console.log(userProfile?.userProfile);
  const reviewedModules = userProfile?.userProfile?.reviewedModules;
  const verbsComplete = userProfile?.userProfile?.assessments?.verbConjugation;
  const textingComplete = userProfile?.userProfile?.assessments?.conversation;
  const mapComplete = userProfile?.userProfile?.assessments?.map?.length;
  const sentenceComplete =
    userProfile?.userProfile?.assessments?.sentenceBuilder;
  const sayVerbComplete = userProfile?.userProfile?.assessments?.sayVerb;
  const storiesComplete =
    userProfile?.userProfile?.assessments?.stories?.length;
  const totalStories = StoryData.length;

  const vocabComplete = reviewedModules
    ? (reviewedModules?.length / Object.keys(AllModules).length) *
      (100).toFixed(0)
    : 0;

  return (
    <main className="p-6  mx-auto mb-auto w-full max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral">Learning Roadmap</h1>

      <h2 className="text-lg font-bold mb-4 text-neutral">
        Recommended path through your existing curriculum
      </h2>

      <div className=" stats shadow mt-2 opacity-80 flex flex-col  w-full     ">
        <div className="flex ">
          <div className="stat   flex  flex-col ">
            <div className="stat-title ">Your Existing Modules</div>
            <div className="stat-value text-secondary text-2xl ">
              🗺️Vocabulary Map
            </div>
            <div className="stat-desc text-lg ">
              <a href="/dashboard/">Click to go here👆</a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-2">
            <div className=" text-secondary text-3xl font-bold ">
              {vocabComplete.toFixed(0)}%
            </div>
            <div className="text-xs text-secondary text-center  ">
              Reviewed {reviewedModules?.length}/
              {Object.keys(AllModules).length} modules
            </div>
          </div>
        </div>
        <progress value={vocabComplete} max="100" className="w-full"></progress>
      </div>

      <div className=" stats shadow mt-2 opacity-80 flex flex-col  w-full     ">
        <div className="flex ">
          <div className="stat   flex  flex-col ">
            <div className="stat-title ">Conjugation & Verb Usage</div>
            <div className="stat-value text-secondary text-2xl ">
              🧠Verbs Guide
            </div>
            <div className="stat-desc text-lg ">
              <a href="/verbs-quiz/">Click to go here👆</a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-2">
            <div className=" text-secondary text-3xl font-bold ">
              {verbsComplete ? verbsComplete : "0"}%
            </div>
            <div className="text-xs text-secondary text-center  ">
              Verb challenge score
            </div>
          </div>
        </div>
        <progress
          value={verbsComplete ? verbsComplete : "0"}
          max="100"
          className="w-full"
        ></progress>
      </div>

      <div className=" stats shadow mt-2 opacity-80 flex flex-col  w-full     ">
        <div className="flex ">
          <div className="stat   flex  flex-col ">
            <div className="stat-title ">Unscramble Sentences</div>
            <div className="stat-value text-secondary text-2xl ">
              🛠️Sentence Builder
            </div>
            <div className="stat-desc text-lg ">
              <a href="/sentence-builder/">Click to go here👆</a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-2">
            <div className=" text-secondary text-3xl font-bold ">
              {sentenceComplete ? sentenceComplete : "0"}%
            </div>
            <div className="text-xs text-secondary text-center  ">
              Sentence builder score
            </div>
          </div>
        </div>
        <progress
          value={sentenceComplete ? sentenceComplete : "0"}
          max="100"
          className="w-full"
        ></progress>
      </div>

      <div className=" stats shadow mt-2 opacity-80 flex flex-col  w-full     ">
        <div className="flex ">
          <div className="stat   flex  flex-col ">
            <div className="stat-title ">Practice Speaking</div>
            <div className="stat-value text-secondary text-2xl ">
              🗣️Say the Verb
            </div>
            <div className="stat-desc text-lg ">
              <a href="/say-verb/">Click to go here👆</a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-2">
            <div className=" text-secondary text-3xl font-bold ">
              {sayVerbComplete ? sayVerbComplete : "0"}%
            </div>
            <div className="text-xs text-secondary text-center  ">
              Speak the verb quiz score
            </div>
          </div>
        </div>
        <progress
          value={sayVerbComplete ? sayVerbComplete : "0"}
          max="100"
          className="w-full"
        ></progress>
      </div>

      <div className=" stats shadow mt-2 opacity-80 flex flex-col  w-full     ">
        <div className="flex ">
          <div className="stat   flex  flex-col ">
            <div className="stat-title ">Immersive Stories</div>
            <div className="stat-value text-secondary text-2xl ">
              📜Real-Life Story Adventures
            </div>
            <div className="stat-desc text-lg ">
              <a href="/stories/">Click to go here👆</a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-2">
            <div
              className=" text-secondary text-3xl font-bold
            
            "
            >
              {storiesComplete ? storiesComplete : 0}
            </div>
            <div className="text-xs text-secondary text-center  ">
              Stories explored
            </div>
          </div>
        </div>
        <progress
          value={storiesComplete ? storiesComplete : "0"}
          max={totalStories}
          className="w-full"
        ></progress>
      </div>

      <div className=" stats shadow mt-2 opacity-80 flex flex-col  w-full     ">
        <div className="flex ">
          <div className="stat   flex  flex-col ">
            <div className="stat-title ">Practice a Conversation</div>
            <div className="stat-value text-secondary text-2xl ">
              🗪Arabic Texting
            </div>
            <div className="stat-desc text-lg ">
              <a href="/conversation/">Click to go here👆</a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-2">
            <div className=" text-secondary text-3xl font-bold "></div>
            <div className="text-xs text-secondary text-center  ">
              {" "}
              {textingComplete ? "Complete" : "Incomplete"}
            </div>
          </div>
        </div>
        <progress
          value={textingComplete ? "100" : "0"}
          max="100"
          className="w-full"
        ></progress>
      </div>

      <div className=" stats shadow mt-2 opacity-80 flex flex-col  w-full     ">
        <div className="flex ">
          <div className="stat   flex  flex-col ">
            <div className="stat-title ">Places, Culture & Vocabulary</div>
            <div className="stat-value text-secondary text-2xl ">
              🐪Explore Egypt
            </div>
            <div className="stat-desc text-lg ">
              <a href="/map/">Click to go here👆</a>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center p-2">
            <div
              className=" text-secondary text-3xl font-bold
            
            "
            >
              {mapComplete ? mapComplete : 0}
            </div>
            <div className="text-xs text-secondary text-center  ">
              Cities explored
            </div>
          </div>
        </div>
        <progress
          value={mapComplete ? mapComplete : "0"}
          max="8"
          className="w-full"
        ></progress>
      </div>

      <div className=" stats shadow mt-2 opacity-80 flex flex-col  w-full     ">
        <div className="flex ">
          <div className="stat   flex  flex-col ">
            <div className="stat-title ">Quizzes, Challenges & Tools</div>
            <div className="stat-value text-secondary text-2xl ">
              Practice & Games
            </div>
            <div className="stat-desc text-lg ">
              <a href="/games/">Click to go here👆</a>
            </div>
          </div>
          {/* <div className="flex flex-col justify-center items-center p-2">
            <div
              className=" text-secondary text-3xl font-bold
            
            "
            >
              ✔️
            </div>
            <div className="text-xs text-secondary text-center  ">
              Click to mark complete
            </div>
          </div> */}
        </div>
        {/* <progress value="100" max="100" className="w-full"></progress> */}
      </div>
    </main>
  );
}
