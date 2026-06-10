"use client";
import React, { useRef } from "react";

export const Navigation = () => {
  const NavigationItems = [
    {
      name: "🏺Learn",
      subLinks: [
        { name: "📜Lessons", href: "/dashboard/" },
        { name: "🧭Verb Oasis", href: "/verbs/" },
      ],
    },
    {
      name: "🌙Practice",
      subLinks: [
        { name: "☕Conversation", href: "/conversation/" },
        { name: "🌴Stories", href: "/stories/" },
        { name: "🎯Verb Quiz", href: "/verbs-quiz/" },
      ],
    },
    {
      name: "🐫Play",
      href: "/games/",
    },
    {
      name: "🏠Profile",
      href: "/profile/",
    },
    {
      name: "💎Pricing",
      href: "/pricing/",
    },
  ];

  return (
    <nav className="w-full bg-base shadow-md z-20">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between ">
          <div className="flex-shrink-0 text-xl font-bold">
            <a className="btn btn-ghost h-16 text-xl" href="/">
              <img alt="Arabic Road Logo" src="/logo.png" className="h-18" />
            </a>
          </div>

          <div className="hidden lg:flex flex-col md:flex-row p-1 md:gap-1 lg:gap-3   ">
            <ul className="menu menu-horizontal px-1 text-left ">
              {NavigationItems.map((item, index) => (
                <li key={index} className="">
                  {!item.subLinks && (
                    <a
                      className="font-bold text-lg overflow-hidden whitespace-nowrap hover:scale-110 "
                      href={item.href}
                    >
                      {item.name}
                    </a>
                  )}
                  {item.subLinks && (
                    <div className="dropdown dropdown-end text-left z-[200]  hover:scale-110">
                      <a
                        tabIndex="0"
                        className="font-bold text-lg   overflow-hidden whitespace-nowrap  "
                      >
                        {item.name}
                      </a>
                      <ul
                        tabIndex="0"
                        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52  left-1/2 -translate-x-1/2 top-1/2 +translate-y-1/2 mt-4 "
                      >
                        {item.subLinks.map((subLink, subIndex) => (
                          <li key={subIndex}>
                            <a
                              className="font-bold text-xl hover:scale-110"
                              href={subLink.href}
                            >
                              {subLink.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:hidden dropdown flex justify-center items-center">
            <div tabIndex={0} className="btn btn-ghost btn-circle ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 self-center"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h7"
                />
              </svg>
            </div>
            <ul
              tabIndex="-1"
              className=" dropdown-content bg-base-100 rounded-box z-[100] mt-3  shadow flex flex-col justify-start items-start p-2 left-1/2 -translate-x-1/2 top-1/2 +translate-y-1/2 w-64 gap-1  "
            >
              {NavigationItems.map((item, index) => (
                <li key={index} className=" list-none">
                  {!item.subLinks && (
                    <span className="font-bold text-sm  cursor-pointer rounded p-1 hover:bg-[black] ">
                      <a href={item.href}>{item.name}</a>
                    </span>
                  )}
                  {item.subLinks && (
                    <>
                      <span className="font-bold text-sm  cursor-default">
                        {item.name}
                      </span>
                      <div className="flex flex-col items-start text-left ml-5 ">
                        {item.subLinks.map((subLink, subIndex) => (
                          <span
                            key={subIndex}
                            className="font-bold text-sm  overflow-hidden whitespace-nowrap rounded p-1 hover:bg-[black] "
                          >
                            <a href={subLink.href}>{subLink.name}</a>
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
