"use client";
import MyButton from "@/components/Button";
import { useState, useEffect } from "react";

const colors = [
  { color: "red", arabic: "أحمر" },
  { color: "blue", arabic: "أزرق" },
  { color: "green", arabic: "أخضر" },
  { color: "yellow", arabic: "أصفر" },
  { color: "orange", arabic: "برتقالي" },
  { color: "purple", arabic: "بنفسجي" },
  { color: "pink", arabic: "وردي" },
  { color: "black", arabic: "أسود" },
  { color: "white", arabic: "أبيض" },
];

const Game = () => {
  const [targetColor, setTargetColor] = useState({});
  const [score, setScore] = useState(0);
  const [balloons, setBalloons] = useState([]);
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    startGame();
    const interval = setInterval(updateBalloons, 50);
    const timerInterval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
    };
  }, []);

  const startGame = () => {
    setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
    setScore(0);
    setTimer(30);
    setGameOver(false);
    setBalloons([]);
    createBalloon();
    setInterval(createBalloon, 1000);
  };

  const createBalloon = () => {
    setBalloons((prev) => [
      ...prev,
      {
        id: Math.random(),
        color: colors[Math.floor(Math.random() * colors.length)].color,
        bottom: 100,
        left: `${Math.floor(Math.random() * 80)}vw`,
      },
    ]);
  };

  const updateBalloons = () => {
    setBalloons((prev) =>
      prev
        .map((balloon) => ({
          ...balloon,
          bottom: balloon.bottom - 1,
        }))
        .filter((balloon) => balloon.bottom > -10)
    );
  };

  const popBalloon = (balloon) => {
    if (balloon.color === targetColor.color) {
      setScore((prev) => prev + 1);
      setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
    } else {
      setScore((prev) => (prev > 0 ? prev - 1 : 0));
    }
    setBalloons((prev) => prev.filter((b) => b.id !== balloon.id));
  };

  useEffect(() => {
    if (timer === 0) {
      setTimer((prev) => 0);
      setGameOver(true);
      setBalloons((prev) => []);
    }
  }, [timer]);

  return (
    <div className="h-screen w-screen flex flex-col items-center bg-gray-100 relative overflow-hidden">
      {!gameOver ? (
        <>
          <div className="absolute top-5 text-center z-10">
            <h1 className="text-2xl font-bold text-neutral z-10">
              Pop the balloon with the color:{" "}
              <span className="text-blue-500">{targetColor.arabic}</span>
            </h1>
            <div className="text-lg mt-2 text-neutral">Score: {score}</div>
            <div className="text-lg mt-2  text-neutral">
              Time Left: {timer}s
            </div>
          </div>
          <div className="absolute inset-0 flex items-end justify-center -z-1 ">
            {balloons.map((balloon) => (
              <div
                key={balloon.id}
                onClick={() => popBalloon(balloon)}
                style={{
                  backgroundColor: balloon.color,
                  left: balloon.left,
                  bottom: `${balloon.bottom}%`,
                }}
                className={`absolute w-20 h-24 rounded-full mb-2 cursor-pointer transition-all transform   hover:scale-110 fall balloon -z-1`}
              >
                <div class="string absolute top-full left-1/2 transform -translate-x-1/2 bg-neutral w-1 h-24"></div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col  text-center bg-gray-200 bg-opacity-90">
          <h1 className="text-3xl font-bold mb-4 text-neutral">Game Over!</h1>
          <p className="text-xl text-neutral">Final Score: {score}</p>
          <MyButton
            classRest="w-fit m-auto"
            func={() => {
              setScore(0);
              setTimer(30);
              setGameOver(false);
              startGame();
            }}
            text="Play again"
          />
        </div>
      )}
    </div>
  );
};

export default Game;
