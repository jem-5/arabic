"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AllModules } from "@/data/AllModules";
import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuthContext } from "@/context/AuthContext";
import { Stats } from "./Stats";
import useScreenSize from "@/helpers/useScreenSize";
import { Profile } from "./Profile";
import MyButton from "./Button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const Dashboard = () => {
  const [module, setModule] = useState("Greetings");
  const { user } = useAuthContext();
  const [reviewedModules, setReviewedModules] = useState([]);
  const [completedModules, setCompletedModules] = useState([]);

  const screenSize = useScreenSize();
  const router = useRouter();

  const updateModules = async () => {
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);
    setReviewedModules(
      userSnap._document.data.value.mapValue.fields.reviewedModules.arrayValue
        .values
    );
    setCompletedModules(
      userSnap._document.data.value.mapValue.fields.completedModules.arrayValue
        .values
    );
  };

  useEffect(() => {
    if (user) updateModules();
  }, []);

  const DisplayRoad = ({ chunk }) => {
    return chunk.map((item, i) => {
      return (
        <li key={i} className="">
          <hr className="bg-neutral" />

          <div className="timeline-middle m-0">
            {completedModules.map((item) => item.stringValue).includes(item) ? (
              <img
                src="/completed.png"
                alt={`learn arabic ${item} online free`}
                width="30px"
                height="30px"
              />
            ) : reviewedModules
                .map((item) => item.stringValue)
                .includes(item) ? (
              <img
                src="/reviewed.png"
                alt={`learn arabic ${item} online free`}
                width="30px"
                height="30px"
              />
            ) : (
              <span className="loading loading-ring loading-md bg-neutral"></span>
            )}
          </div>

          <div className="timeline-end timeline-box bg-transparent border-0 p-0 m-1">
            <MyButton
              classRest="m-0 bg-neutral"
              func={() => {
                document.getElementById("my_lesson_summary").showModal();
                setModule(item);
              }}
              text={chunk[i]}
            />
          </div>

          <hr className="bg-neutral" />
        </li>
      );
    });
  };

  const ShowRoads = () => {
    const chunkSize =
      screenSize.width < 600 ? 4 : screenSize.width < 1100 ? 6 : 10;
    const roads = [];
    for (let i = 0; i < Object.keys(AllModules).length; i += chunkSize) {
      const chunk = Object.keys(AllModules).slice(i, i + chunkSize);
      roads.push(chunk);
    }
    return roads.map((road, i) => {
      return (
        <div key={i}>
          <ul className="timeline w-full flex justify-center ">
            <DisplayRoad chunk={road} />
          </ul>
        </div>
      );
    });
  };

  const startLesson = () => {
    router.push(`/lesson/?topic=${module}`);
  };

  const startQuiz = () => {
    router.push(`/quiz/?topic=${module}`);
  };

  return (
    <div className=" w-full flex flex-col  justify-start gap-0">
      <Profile />
      <Stats reviewedModules={reviewedModules} />
      <ShowRoads className="justify-self-start" />

      <dialog id="my_lesson_summary" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Module: {module}</h3>

          <p className="py-4">
            Learn the essentials of the {module} module with this lesson.
          </p>
          <div className="modal-action ">
            <form
              method="dialog"
              className="flex flex-col sm:flex-row gap-3 items-end"
            >
              <a href={`/lesson?topic=${module}`}>
                <MyButton
                  text={"Begin Lesson"}
                  func={startLesson}
                  classRest={"bg-secondary text-neutral mb-2"}
                />
              </a>

              <a href={`/quiz?topic=${module}`}>
                <MyButton
                  text={"Begin Quiz"}
                  func={startQuiz}
                  classRest={"bg-secondary text-neutral mb-2"}
                />
              </a>

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
