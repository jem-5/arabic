import React from "react";
import Link from "next/link";
import MyButton from "@/components/Button";

const Games = () => {
  return (
    <div className="h-screen w-screen flex flex-col items-center  relative overflow-hidden flex flex-col gap-2 mb-2">
      <h1 className="text-2xl font-bold text-neutral z-10">
        Arabic Learning Games
      </h1>

      <div className="card  image-full w-96 shadow-xl">
        <figure>
          <img src="/balloon-game.jpg" alt="Balloon Color Game" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Balloon Color Drop</h2>
          <p>
            Pop the balloons that match the colors written in Arabic. How many
            can you pop in 30 seconds?
          </p>
          <div className="card-actions justify-end">
            <Link href="/games/balloon-color-drop/">
              <MyButton text="Play Now" />
            </Link>
          </div>
        </div>
      </div>

      <div className="card   image-full bg-neutral   w-96 shadow-xl">
        <figure>
          <img src="/number-game.jpg" alt="Number Sort Game" />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Number Tile Sort</h2>
          <p>
            Sort the Arabic numbers in order of increasing value. How many sets
            of numbers can you get through in 30 seconds?
          </p>
          <div className="card-actions justify-end">
            <Link href="/games/number-sort/">
              <MyButton text="Play Now" />
            </Link>
          </div>
        </div>
      </div>

      <div className="card bg-neutral w-96 shadow-xl ">
        <div className="card-body">
          <p>More games coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Games;
