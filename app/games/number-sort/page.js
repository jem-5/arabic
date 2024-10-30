"use client";
import MyButton from "@/components/Button";
import { useState, useEffect } from "react";

const OrderGame = () => {
  const [numbers, setNumbers] = useState([]);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const arabicNumbers = {
    1: "واحد",
    2: "اثنان",
    3: "ثلاثة",
    4: "أربعة",
    5: "خمسة",
    6: "ستة",
    7: "سبعة",
    8: "ثمانية",
    9: "تسعة",
    10: "عشرة",
    11: "أحد عشر",
    12: "اثنا عشر",
    13: "ثلاثة عشر",
    14: "أربعة عشر",
    15: "خمسة عشر",
    16: "ستة عشر",
    17: "سبعة عشر",
    18: "ثمانية عشر",
    19: "تسعة عشر",
    20: "عشرون",
  };
  const toArabic = (num) => arabicNumbers[num] || num;

  // Start or restart the game
  const startGame = () => {
    setNumbers(generateRandomNumbers());
    setTimer(30);
    setScore(0);
    setIsGameOver(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  // Generate random numbers in Arabic between 1 and 100
  const generateRandomNumbers = () => {
    const uniqueNumbers = new Set();
    while (uniqueNumbers.size < 5) {
      uniqueNumbers.add(Math.floor(Math.random() * 20) + 1);
    }

    return Array.from(uniqueNumbers).map((num) => ({
      num,
      arabic: toArabic(num),
      id: Math.random(),
    }));
  };

  // Timer countdown
  useEffect(() => {
    if (timer > 0 && !isGameOver) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else if (timer === 0) {
      setIsGameOver(true);
    }
  }, [timer, isGameOver]);

  // Check if numbers are in ascending order
  const checkOrder = (numbers) => {
    const isOrdered = numbers.every(
      (val, i, arr) => !i || arr[i - 1].num <= val.num
    );
    if (isOrdered) {
      setScore((prev) => prev + 1);
      setNumbers((prev) => generateRandomNumbers()); // Load new numbers
    }
  };

  // Handle reordering of the numbers
  const moveNumber = (index, direction) => {
    const newNumbers = [...numbers];
    const [movedItem] = newNumbers.splice(index, 1);
    newNumbers.splice(index + direction, 0, movedItem);
    setNumbers((prev) => newNumbers);
    checkOrder(newNumbers); // Check order after each move
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center bg-gray-100">
      {!isGameOver ? (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-neutral">
              Arrange Numbers in Order!
            </h1>
            <p className="text-lg text-neutral">Time Left: {timer}s</p>
            <p className="text-lg text-neutral">Score: {score}</p>
          </div>
          <div className="mt-6 space-y-3">
            {numbers.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center space-x-4 justify-center text-lg bg-blue-100 p-2 rounded shadow-md cursor-pointer bg-primary"
              >
                <button
                  onClick={() => moveNumber(index, -1)}
                  disabled={index === 0}
                  className="px-2 py-1 bg-blue-500 text-neutral rounded disabled:opacity-50"
                >
                  ↑
                </button>
                <span className="text-neutral font-semibold">
                  {item.arabic}
                </span>
                <button
                  onClick={() => moveNumber(index, 1)}
                  disabled={index === numbers.length - 1}
                  className="px-2 py-1 bg-blue-500 text-neutral rounded disabled:opacity-50"
                >
                  ↓
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-6 text-center">
          <h2 className="text-xl font-bold mb-4  text-neutral">Game Over!</h2>
          <p className="text-lg  text-neutral">Final Score: {score}</p>
          <MyButton
            classRest="w-fit m-auto"
            func={startGame}
            text="Play again"
          />
        </div>
      )}
    </div>
  );
};

export default OrderGame;
