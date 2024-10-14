import Link from "next/link";
import React from "react";

export const metadata = {
  alternates: {
    canonical: "https://arabicroad.com/about/",
  },
};

export default function About() {
  return (
    <main className="flex-grow flex flex-col items-left p-3 text-neutral w-1/2 bg-[white] rounded-md mt-2 drop-shadow-xl border gap-3  max-[999px]:w-4/5">
      <h3 className="font-bold text-xl  self-center ">Welcome!</h3>
      <div className="divider "></div>

      <div className="card lg:card-side bg-base-100 shadow-xl bg-transparent">
        <figure>
          <img src="/jenn.JPG" alt="Jennifer" className="max-w-1/2" />
        </figure>
        <div className="card-body ">
          <h2 className="card-title">Who am I?</h2>
          <p>
            Hey there! Thanks for visiting Arabic Road. My name is Jennifer and
            I built this site to help myself (and others) learn Arabic. As
            someone with Egyptian roots, the Arabic language has always
            captivated me, not only for its linguistic complexity but also for
            its cultural richness.
          </p>
        </div>
      </div>

      <h4 className="text-4xl mx-5  my-4 text-primary">
        <q>
          Learning Arabic has been a lifelong dream of mine and I&apos;m finally
          diving into it. Join me!
        </q>
      </h4>

      <div className="card lg:card-side bg-base-100 shadow-xl bg-transparent">
        <div className="card-body ">
          <h2 className="card-title">Why this site?</h2>
          <p>
            The platform is designed to address the common challenges faced by
            Arabic learners at all stages. Features of ArabicRoad include:
            <ul>
              <li>
                Comprehensive Learning Tools: Lessons range from basic to
                advanced levels of Arabic proficiency
              </li>
              <li>
                Interactive Content: Each lesson includes a relevant image to
                enhance understanding, audio narration for proper pronunciation
                of Arabic words and English transliterations
              </li>
              <li>
                Progress Tracking: Users can track completed lessons and review
                incorrect answers with a free account
              </li>
            </ul>
          </p>
        </div>
        <figure>
          <img
            src="/computer.png"
            alt="Arabic Road on computer"
            className="max-w-1/2"
          />
        </figure>
      </div>

      <h4 className="text-4xl mx-5  my-4 text-primary">
        <q>
          Let us explore the depth and beauty of the Arabic language together!
        </q>
      </h4>

      <div className="card lg:card-side bg-base-100 shadow-xl bg-transparent">
        <figure>
          <img src="/welcome.png" alt="Girl welcoming" />
        </figure>
        <div className="card-body ">
          <h2 className="card-title">What next?</h2>
          <p>
            My hope is that ArabicRoad becomes a valuable resource for your
            Arabic learning journey. Learning a new language is challenging but
            incredibly rewarding. With patience, practice, and the right
            guidance, anyone can learn to understand and speak Arabic.
            <p className="my-2 text-xl font-bold text-primary">
              What are you waiting for? Visit your{" "}
              <Link href="/dashboard" className="underline">
                Dashboard
              </Link>{" "}
              to start learning Arabic!
            </p>
          </p>
        </div>
      </div>
    </main>
  );
}
