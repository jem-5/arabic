"use client";
import MyButton from "@/components/Button";
import { useState, useEffect } from "react";
import { AllModules } from "@/data/AllModules";

const EchoMatch = () => {
  const [allWords, setAllWords] = useState([]);

  const [isGameOver, setIsGameOver] = useState(false);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [questionNum, setQuestionNum] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [question, setQuestion] = useState("");

  const [status, setStatus] = useState("");
  const [questionsWrong, setQuestionsWrong] = useState([]);

  function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const generateRandomAnswer = () => {
    let randomIndex = Math.floor(Math.random() * allWords.length);
    const randomAnswer = allWords[randomIndex].english;
    return randomAnswer;
  };

  let statusWidth = 75;
  let statusHeight = 75;

  const populateAnswers = (questionNum) => {
    if (!allWords.length) return;
    const randomSpot = Math.floor(Math.random() * 4);
    let arabicWord = allWords[questionNum].arabic;
    setQuestion(arabicWord);
    let englishWord = allWords[questionNum].english;
    let answerArr = [0, 0, 0, 0];
    answerArr[randomSpot] = englishWord;
    for (let i = 0; i < 4; i++) {
      if (i !== randomSpot) {
        let randomAnswer = generateRandomAnswer();

        while (answerArr.includes(randomAnswer)) {
          randomAnswer = generateRandomAnswer();
        }
        answerArr[i] = randomAnswer;
        if (!answerArr.includes(0)) break;
      }
    }
    setAnswers(answerArr);
  };

  const playAudio = () => {
    let audio = new Audio(allWords[questionNum].audio);
    audio.play();
  };

  const checkAnswer = (e) => {
    let correctAnswer = allWords[questionNum].english;
    let selectedAnswer = e.target.innerText;

    if (correctAnswer.trim() === selectedAnswer.trim()) {
      setScore((prev) => prev + 1);
      setStatus("correct");
    } else {
      setQuestionsWrong((prev) => [...prev, question]);
      setStatus("wrong");
    }
    setTimeout(() => advanceQuestion(), 500);
  };

  const advanceQuestion = () => {
    setStatus("");
    if (questionNum === 29) {
      endQuiz();
      return;
    }
    setQuestionNum((prev) => prev + 1);

    populateAnswers(questionNum);
  };

  const endQuiz = () => {
    setIsGameOver(true);
    setQuestionNum(0);
    setAnswers([]);

    setQuestion("");
  };

  const startGame = () => {
    setAllWords(shuffleArray([...allWords]));
    setIsGameOver(false);
    setScore(0);
    populateAnswers(questionNum);
  };
  useEffect(() => {
    const words = Object.values(AllModules).flat();
    setAllWords(shuffleArray(words));
  }, []);

  useEffect(() => {
    if (allWords.length) {
      populateAnswers(questionNum);
    }
  }, [allWords, questionNum]);

  return (
    <div>
      {!isGameOver ? (
        <>
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-neutral">
              Select the Matching English Word
            </h1>
            <h3 className="font-bold text-lg align-end justify-end  text-neutral">
              {"Question "}
              {questionNum + 1} {"of 30"}
            </h3>
          </div>

          <div className="divider"></div>

          <h3 className="font-bold text-lg align-end justify-end  text-neutral text-center">
            Total Correct: {score}
          </h3>

          <div className="card bg-neutral min-w-80 shadow-xl flex flex-col justify-center items-center">
            <div className="card-body flex flex-col justify-center items-center">
              <h2 className="card-title ">
                {question}

                <svg
                  onClick={playAudio}
                  className="w-8 h-8 text-gray-800 dark:text-white cursor-pointer"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="white"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.5 8.43A4.985 4.985 0 0 1 17 12a4.984 4.984 0 0 1-1.43 3.5m2.794 2.864A8.972 8.972 0 0 0 21 12a8.972 8.972 0 0 0-2.636-6.364M12 6.135v11.73a1 1 0 0 1-1.64.768L6 15H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2l4.36-3.633a1 1 0 0 1 1.64.768Z"
                  />
                </svg>
              </h2>

              <div className="card-actions flex flex-col items-center w-full   ">
                <div className="flex flex-row items-center justify-center gap-3 w-full  ">
                  <MyButton
                    classRest="bg-secondary  "
                    func={checkAnswer}
                    text={answers[0]}
                  />
                </div>

                <div className="flex flex-row items-center justify-center gap-3 w-full  ">
                  <MyButton
                    text={answers[1]}
                    classRest="bg-secondary  "
                    func={checkAnswer}
                  />
                </div>

                <div className="flex flex-row items-center justify-center gap-3 w-full  ">
                  <MyButton
                    text={answers[2]}
                    classRest="bg-secondary  "
                    func={checkAnswer}
                  />
                </div>
                <div className="flex flex-row items-center justify-center gap-3 w-full  ">
                  <MyButton
                    text={answers[3]}
                    classRest="bg-secondary"
                    func={checkAnswer}
                  />
                </div>
              </div>
            </div>
          </div>

          {status === "correct" ? (
            <img
              src="/checkmark.png"
              alt="check"
              width={statusWidth}
              height={statusHeight}
            />
          ) : status === "wrong" ? (
            <img
              src="/xmark.png"
              alt="x"
              width={statusWidth}
              height={statusHeight}
            />
          ) : (
            <img
              src="/clear.png"
              alt="x"
              width={statusWidth}
              height={statusHeight}
            />
          )}
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

export default EchoMatch;
