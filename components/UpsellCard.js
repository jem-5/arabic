"use client";

import UpsellData from "@/data/upsell/UpsellData";
import { useEffect, useRef, useState } from "react";
import MyButton from "./Button";
import { useRouter } from "next/navigation";

export default function UpsellCard({ questionNum, lessonData }) {
  const [showUpsell, setShowUpsell] = useState(false);
  const [upsellId, setUpsellId] = useState(0);
  const position0 = useRef(0);
  const position1 = useRef(0);
  const position2 = useRef(0);
  const upsellOptions = useRef([]);
  const router = useRouter();

  const shuffleArray = ([...arr]) => {
    let m = arr.length;
    while (m) {
      const i = Math.floor(Math.random() * m--);
      [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    return arr;
  };

  const selectRandomItems = (array, numToSelect) => {
    if (numToSelect >= array.length) {
      return shuffleArray(array);
    }
    return shuffleArray(array).slice(0, numToSelect);
  };

  useEffect(() => {
    const upsells = selectRandomItems(UpsellData, 3);
    upsellOptions.current = upsells;
  }, []);

  useEffect(() => {
    let first = Math.floor(Math.random() * 6) + 4;
    let second = first + Math.floor(Math.random() * 6) + 5;
    let third = second + Math.floor(Math.random() * 5) + 5;
    position0.current = first;
    position1.current = second;
    position2.current = third;
  }, []);

  useEffect(() => {
    const positions = [position0.current, position1.current, position2.current];
    for (let i = 0; i < 3; i++) {
      if (questionNum === positions[i]) {
        setUpsellId(i);
        setShowUpsell(true);
        console.log("showing upsell");
        break;
      } else {
        setShowUpsell(false);
      }
    }
  }, [lessonData, questionNum]);

  return (
    <>
      {showUpsell && (
        <div className="absolute card md:card-side inset-0 h-5/6 shadow-xl bg-neutral z-20  ">
          <div className="p-5 flex flex-col gap-3  justify-center items-center w-full">
            <span
              className="absolute top-2 right-3 cursor-pointer text-2xl font-bold"
              onClick={() => setShowUpsell(false)}
            >
              ×
            </span>
            <h1 className="text-3xl">
              {upsellOptions.current[upsellId]?.title}
            </h1>
            <h2>{upsellOptions.current[upsellId]?.subtitle}</h2>
            <p className="text-xl">
              {upsellOptions.current[upsellId]?.description}
            </p>

            <MyButton
              text={upsellOptions.current[upsellId]?.cta}
              classRest="btn bg-secondary text-2xl"
              func={() => router.push("/pricing")}
            />
            <MyButton
              text="Back to Lesson"
              classRest="btn bg-secondary text-md"
              func={() => setShowUpsell(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
