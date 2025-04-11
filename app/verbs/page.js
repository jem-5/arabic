"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AllModules } from "@/data/AllModules";
import { useAuthContext } from "@/context/AuthContext";
import { Profile } from "@/components/Profile";
import MyButton from "@/components/Button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import VerbPresentConjugations from "@/data/VerbPresentConjugations";

export default function Verb() {
  const { user } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const baseUrl = "https://arabicroad.com";
  const [currVerb, setCurrVerb] = useState(VerbPresentConjugations[0]);
  const [tense, setTense] = useState("presentTense");

  useEffect(() => {
    const canonicalUrl = `${baseUrl}${pathname}`;
    let link = document.querySelector("link[rel='canonical']");

    if (link) {
      link.setAttribute("href", canonicalUrl);
    } else {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      link.setAttribute("href", canonicalUrl);
      document.head.appendChild(link);
      console.log(canonicalUrl);
    }
  }, [pathname]);

  console.log(VerbPresentConjugations[0]);

  return (
    <main className="flex-grow flex flex-col items-center p-2 ">
      <div className="flex items-center mt-4 w-full flex-col md:flex-row md:justify-between ">
        <h3 className="font-bold text-lg text-neutral">Verb Conjugator</h3>
      </div>
      <div className="divider"></div>
      <div className="card md:card-side bg-base-100 shadow-xl bg-neutral w-full ">
        <div
          className="card-body flex flex-col 
        justify-between  items-center"
        >
          <div className="dropdown dropdown-bottom  ">
            <div
              tabIndex={0}
              role="button"
              className="btn m-1 bg-secondary    "
            >
              Change Verb
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow  "
            >
              <div className="overflow-y-auto max-h-96">
                {VerbPresentConjugations.map((item, i) => {
                  return (
                    <li
                      key={i}
                      onClick={() => {
                        setCurrVerb(item);
                        document.activeElement.blur();
                      }}
                    >
                      <a>{item.english}</a>
                    </li>
                  );
                })}
              </div>
            </ul>
          </div>

          <div className="flex ">
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="radio-2"
                className="radio radio-secondary mx-2"
                defaultChecked
                onClick={() => setTense((prev) => "presentTense")}
              />
              <span className="label-text">Present</span>
            </label>

            <label className="label cursor-pointer">
              <input
                type="radio"
                name="radio-2"
                className="radio radio-secondary mx-2"
                onClick={() => setTense((prev) => "pastTense")}
              />
              <span className="label-text">Past</span>
            </label>
            <label className="label cursor-pointer">
              <input
                type="radio"
                name="radio-2"
                className="radio radio-secondary mx-2"
                onClick={() => setTense((prev) => "futureTense")}
              />
              <span className="label-text">Future</span>
            </label>
          </div>
          <div className="divider "></div>

          <div className="text-3xl text-center place-content-end">
            {currVerb.english}: {currVerb.verb} | {currVerb.transliteration}
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <tbody>
                <tr>
                  <td>I</td>
                  <td>
                    {currVerb[tense]["I"]["arabic"]} |{" "}
                    {currVerb[tense]["I"]["transliteration"]}
                  </td>
                  <td>We</td>
                  <td>
                    {currVerb[tense]["we"]["arabic"]} |{" "}
                    {currVerb[tense]["we"]["transliteration"]}
                  </td>
                </tr>
                <tr>
                  <td>You (m)</td>
                  <td>
                    {currVerb[tense]["youM"]["arabic"]} |{" "}
                    {currVerb[tense]["youM"]["transliteration"]}
                  </td>
                  <td>You (pl)</td>
                  <td>
                    {currVerb[tense]["youPl"]["arabic"]} |{" "}
                    {currVerb[tense]["youPl"]["transliteration"]}
                  </td>
                </tr>
                <tr>
                  <td>You (f)</td>
                  <td>
                    {currVerb[tense]["youF"]["arabic"]} |{" "}
                    {currVerb[tense]["youF"]["transliteration"]}
                  </td>
                  <td>They</td>
                  <td>
                    {currVerb[tense]["they"]["arabic"]} |{" "}
                    {currVerb[tense]["they"]["transliteration"]}
                  </td>
                </tr>
                <tr>
                  <td>He</td>
                  <td>
                    {currVerb[tense]["he"]["arabic"]} |{" "}
                    {currVerb[tense]["he"]["transliteration"]}
                  </td>
                </tr>
                <tr>
                  <td>She</td>
                  <td>
                    {currVerb[tense]["she"]["arabic"]} |{" "}
                    {currVerb[tense]["she"]["transliteration"]}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="divider "></div>

      <Profile />
    </main>
  );
}
