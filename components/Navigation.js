"use client";
import React from "react";

export const Navigation = () => {
  return (
    <div className="navbar bg-base-100 opacity-80 h-24 flex flex-row   ">
      <div className="w-3/4 m-auto max-[999px]:w-full">
        <div className="flex-1  ">
          <a className="btn btn-ghost text-xl text-black h-20" href="/">
            <img alt="Arabic Road Logo" src="/logo.png" className="h-20" />
          </a>
        </div>
        <div className="flex-none flex gap-2 ">
          <a href="/dashboard">
            <button className="btn  text-lg">Lessons</button>
          </a>

          <a href="/blog">
            <button className="btn    text-lg">Blog</button>
          </a>
          <a href="/about">
            <button className="btn    text-lg">About</button>
          </a>
        </div>
      </div>
    </div>
  );
};
