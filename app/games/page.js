"use client";
import React from "react";
import Link from "next/link";
import MyButton from "@/components/Button";
import { useAuthContext } from "@/context/AuthContext";

const Games = () => {
  const { user, isPaidMember } = useAuthContext();

  const GamesList = [
    {
      title: "Balloon Color Drop",
      description:
        "Pop the balloons that match the colors written in Arabic. How many can you pop in 30 seconds?",
      image: "/balloon-game.jpg",
      link: "/games/balloon-color-drop/",
      premiumOnly: false,
    },
    {
      title: "Echo Match Game",
      description:
        "Can you find the correct English translation for the Arabic word? This quiz presents 30 questions chosen randomly from the full 1000+ word vocabulary of the curriculum.",
      image: "/echo-game.png",
      link: "/games/echo-match/",
      premiumOnly: true, // Replace with the actual link to the game
    },

    {
      title: "Number Tile Sort",
      description:
        "Sort the Arabic numbers in order of increasing value. How many sets of numbers can you get through in 30 seconds?",
      image: "/number-game.jpg",
      link: "/games/number-sort/",
      premiumOnly: true,
    },
  ];
  return (
    <div className="h-fit w-screen flex flex-col items-center  relative overflow-hidden gap-2 mb-2">
      <h1 className="text-2xl font-bold text-neutral z-10">
        Arabic Learning Games
      </h1>
      {GamesList.map((game, index) => (
        <div key={index} className="card  image-full w-96  ">
          <figure>
            <img src={game.image} alt={game.title} />
          </figure>
          <div className="card-body">
            <h2 className="card-title">{game.title}</h2>
            <p>{game.description}</p>
            <div
              className={`card-actions justify-end ${
                game.premiumOnly && !isPaidMember
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              {" "}
              <Link href={game.link}>
                <MyButton text="Play Now" />
              </Link>
            </div>
            {game.premiumOnly && !isPaidMember && (
              <>
                <span className="text-3xl text-right">🔒 </span>

                <span className="text-md text-right">
                  Game locked for premium users only.
                </span>
              </>
            )}
          </div>
        </div>
      ))}

      <div className="card bg-neutral w-96 shadow-xl ">
        <div className="card-body">
          <p>More games coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Games;
