"use client";
import Link from "next/link";
import React from "react";

export const Navigation = () => {
  return (
    <div className="navbar bg-base-100 opacity-80 h-18 flex flex-row   ">
      <div className="w-3/4 m-auto max-[999px]:w-full">
        <div className="flex-1  ">
          <a className="btn btn-ghost text-xl text-black h-full" href="/">
            <img alt="Arabic Road Logo" src="/logo.png" className="h-18" />
          </a>
        </div>
        <div className="flex-none flex gap-2 ">
          <Link href="/" className="font-bold">
            <button className="btn  text-lg">Home</button>
          </Link>

          <Link href="/dashboard" className="font-bold">
            <button className="btn  text-lg">Lessons</button>
          </Link>

          <Link href="/blog" className="font-bold">
            <button className="btn    text-lg">Blog</button>
          </Link>
          <Link href="/about" className="font-bold">
            <button className="btn    text-lg">About</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
