import Link from "next/link";
import React from "react";

export const metadata = {
  alternates: {
    canonical: "https://arabicroad.com/contact/",
  },
};

export default function Contact() {
  return (
    <main className="flex-grow flex flex-col items-left p-3 text-neutral w-1/2 bg-[white] rounded-md mt-2 drop-shadow-xl border gap-3 max-[999px]:w-4/5">
      <h3 className="font-bold text-xl  self-center ">Send a message</h3>
      <div className="divider "></div>

      <div className="card lg:card-side bg-base-100 shadow-xl bg-transparent">
        <figure>
          <img src="/laptop.jpg" alt="Laptop" className="max-w-1/2" />
        </figure>
        <div className="card-body ">
          <p className="my-0">
            Whether you have questions, feedback or need assistance with the
            platform, feel free to reach out. I respond to all inquiries within
            24-48 hours.
            <br />
            Contact me via email at
            <br />
            <Link href="mailto:jenniferengineers@gmail.com">
              <span className="text-sm md:text-xl font-bold">
                jenniferengineers[at]gmail[dot]com{" "}
              </span>
            </Link>
          </p>
        </div>
      </div>

      <h4 className="text-4xl mx-5  my-4 text-primary">
        <q>
          Your experience with ArabicRoad is important to me, and I&apos;m
          committed to providing the support you need.
        </q>
      </h4>
    </main>
  );
}
