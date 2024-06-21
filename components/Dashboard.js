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

export const Dashboard = () => {
  const [module, setModule] = useState("Greetings");
  const { user } = useAuthContext();
  const [reviewedModules, setReviewedModules] = useState([]);
  const screenSize = useScreenSize();
  const router = useRouter();

  const updateReviewedModules = async () => {
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);
    console.log(userSnap);
    setReviewedModules(
      userSnap._document.data.value.mapValue.fields.reviewedModules.arrayValue
        .values
    );
  };

  useEffect(() => {
    if (user) updateReviewedModules();
  }, []);

  const DisplayRoad = ({ chunk }) => {
    return chunk.map((item, i) => {
      return (
        <li key={i} className="">
          <hr className="bg-neutral" />

          <div className="timeline-middle m-0">
            {reviewedModules.map((item) => item.stringValue).includes(item) ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-8 h-8 text-primary absolute"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="loading loading-ring loading-lg bg-neutral opacity-0"></span>
              </>
            ) : (
              <span className="loading loading-ring loading-lg bg-neutral"></span>
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
    const chunkSize = screenSize.width < 1000 ? 3 : 5;
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

  // const startLesson = () => {
  //   router.push({
  //     pathname: "/lesson",
  //     query: { topic: module },
  //   });

  //   // router.push(`/lesson/?topic=${module}`);
  // };

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
            <form method="dialog">
              <Link href={{ pathname: "/lesson", query: { topic: module } }}>
                <MyButton
                  text={
                    "Begin Lesson"
                    // <svg // eslint-disable-line
                    //   className="w-6 h-6 text-gray-800 dark:text-white"
                    //   aria-hidden="true"
                    //   xmlns="http://www.w3.org/2000/svg"
                    //   width="24"
                    //   height="24"
                    //   fill="none"
                    //   viewBox="0 0 24 24"
                    // >
                    //   <path
                    //     stroke="currentColor"
                    //     strokeLinecap="round"
                    //     strokeLinejoin="round"
                    //     strokeWidth="2"
                    //     d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"
                    //   />
                    // </svg>,
                  }
                  // func={startLesson}
                  classRest={"bg-secondary text-neutral mb-2"}
                />
              </Link>

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
