"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full bg-base shadow-md z-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-xl font-bold">
            <a className="btn btn-ghost text-xl  h-full" href="/">
              <img alt="Arabic Road Logo" src="/logo.png" className="h-18" />
            </a>
          </div>
          <div className="hidden md:flex p-1 md:gap-2 lg:gap-4">
            <Link href="/dashboard/" className="font-bold text-sm md:text-lg ">
              🏺Lessons
            </Link>

            <Link href="/verbs/" className="font-bold text-sm md:text-lg ">
              🌙Verbs
            </Link>

            <Link
              href="/conversation/"
              className="font-bold text-sm md:text-lg "
            >
              💬Conversation
            </Link>

            <Link href="/games/" className="font-bold text-sm md:text-lg ">
              🐫Games
            </Link>

            <Link href="/pricing/" className="font-bold text-sm md:text-lg ">
              🪙Pricing
            </Link>

            <Link href="/profile/" className="font-bold text-sm md:text-lg ">
              🏠Account
            </Link>
          </div>

          <div className="md:hidden">
            <button
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {isOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-40 z-40"
              onClick={() => setIsOpen(false)}
            ></div>
          )}

          <div
            className={`fixed top-16 right-0  w-48 bg-base-100 text-secondary border-l border-[secondary] shadow-xl z-50 transform transition-transform duration-300 ease-in-out rounded-l-2xl shadow-[0_0_20px_rgba(0,0,0,0.2)] p-2 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div
              className=" gap-2  flex flex-col text-xl"
              onClick={() => setIsOpen(false)}
            >
              <Link href="/dashboard/" className="font-bold ">
                <button className="  text-sm md:text-lg  hover:scale-110">
                  Lessons
                </button>
              </Link>

              <Link href="/verbs/" className="font-bold">
                <button className="  text-sm md:text-lg hover:scale-110 ">
                  Verbs
                </button>
              </Link>

              <Link href="/conversation/" className="font-bold">
                <button className="  text-sm md:text-lg hover:scale-110 ">
                  Conversation
                </button>
              </Link>

              <Link href="/games/" className="font-bold">
                <button className="   text-sm md:text-lg hover:scale-110 ">
                  Games
                </button>
              </Link>

              <Link href="/pricing/" className="font-bold">
                <button className="   text-sm md:text-lg hover:scale-110">
                  Pricing
                </button>
              </Link>

              <Link href="/profile/" className="font-bold">
                <button className="   text-sm md:text-lg hover:scale-110">
                  Account
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
