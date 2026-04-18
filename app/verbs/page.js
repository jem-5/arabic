"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AllModules } from "@/data/AllModules";
import { useAuthContext } from "@/context/AuthContext";
import { Profile } from "@/components/Profile";
import MyButton from "@/components/Button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import VerbConjugations, {
  freeVerbs,
  verbConjugationsLength,
} from "@/data/VerbConjugations";

export default function Verb() {
  const { user, isPaidMember } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const baseUrl = "https://arabicroad.com";
  const [verbs, setVerbs] = useState(freeVerbs);
  const [currVerb, setCurrVerb] = useState(verbs[0]);
  const [tense, setTense] = useState("presentTense");
  const [query, setQuery] = useState("");
  const [filteredVerbs, setFilteredVerbs] = useState(verbs);

  useEffect(() => {
    const fetchVerbs = async () => {
      if (!user) {
        setVerbs(freeVerbs);
        return;
      }

      if (user) {
        try {
          const token = await user.getIdToken();
          console.log("Token:", token);
          const response = await fetch("/api/verbs", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            console.error("Failed to fetch verbs:", response.status);
            setVerbs(freeVerbs);
            return;
          }

          const data = await response.json();
          setVerbs(data.verbs || freeVerbs);
          console.log(data);
        } catch (error) {
          console.log("Error fetching verbs:", error);
          setVerbs(freeVerbs);
        }
      }
    };

    fetchVerbs();
  }, [user]);

  useEffect(() => {
    if (verbs && verbs.length > 0) {
      setCurrVerb(verbs[0]);
    }
  }, [verbs]);

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

  const LockedTable = ({ currVerb = verbs[0] }) => {
    return (
      <table className="table blur-sm">
        <tbody>
          <tr>
            <td>I</td>
            <td>
              {currVerb?.[tense]["I"]["arabic"]} |{" "}
              {currVerb?.[tense]["I"]["transliteration"]}
            </td>
            <td>We</td>
            <td>
              {currVerb?.[tense]["we"]["arabic"]} |{" "}
              {currVerb?.[tense]["we"]["transliteration"]}
            </td>
          </tr>
          <tr>
            <td>You (m)</td>
            <td>
              {currVerb?.[tense]["youM"]["arabic"]} |{" "}
              {currVerb?.[tense]["youM"]["transliteration"]}
            </td>
            <td>You (pl)</td>
            <td>
              {currVerb?.[tense]["youPl"]["arabic"]} |{" "}
              {currVerb?.[tense]["youPl"]["transliteration"]}
            </td>
          </tr>
          <tr>
            <td>You (f)</td>
            <td>
              {currVerb?.[tense]["youF"]["arabic"]} |{" "}
              {currVerb?.[tense]["youF"]["transliteration"]}
            </td>
            <td>They</td>
            <td>
              {currVerb?.[tense]["they"]["arabic"]} |{" "}
              {currVerb?.[tense]["they"]["transliteration"]}
            </td>
          </tr>
          <tr>
            <td>He</td>
            <td>
              {currVerb?.[tense]["he"]["arabic"]} |{" "}
              {currVerb?.[tense]["he"]["transliteration"]}
            </td>
          </tr>
          <tr>
            <td>She</td>
            <td>
              {currVerb?.[tense]["she"]["arabic"]} |{" "}
              {currVerb?.[tense]["she"]["transliteration"]}
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value === "") {
      setFilteredVerbs(verbs);
      setQuery("");
      return;
    }
    setQuery(value);
    const q = value.toLowerCase().trim();
    const filtered = verbs.filter(
      (item) =>
        item &&
        ((item.english && item.english.toLowerCase().includes(q)) ||
          (item.arabic && item.arabic.includes(q)) ||
          (item.transliteration &&
            item.transliteration.toLowerCase().includes(q))),
    );
    setFilteredVerbs(filtered);
  };

  return (
    <main className="flex-grow flex flex-col items-center p-2 ">
      <div className="flex items-center mt-4 w-full flex-col md:flex-row md:justify-between ">
        <h3 className="font-bold text-lg text-neutral">Verb Conjugator</h3>
        <h3 className="font-bold text-lg text-neutral">
          Total Verbs: {verbConjugationsLength}
        </h3>
      </div>
      <div className="divider"></div>
      <div className="card md:card-side bg-base-100 shadow-xl bg-neutral w-full ">
        <div
          className="card-body flex flex-col 
        justify-between  items-center"
        >
          <div className="dropdown dropdown-bottom  w-1/2 flex flex-col items-center">
            <div
              tabIndex={0}
              role="button"
              className="   btn m-1 bg-secondary text-[black]  w-full "
            >
              Choose Verb
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] p-2 shadow w-full "
            >
              <div className="overflow-y-auto max-h-96 w-full">
                <input
                  type="text"
                  value={query}
                  onChange={handleSearch}
                  placeholder="Type Arabic, English or Transliteration"
                  className="p-3 border border-neutral bg-white/90 rounded-lg mb-4 
              text-[black] placeholder-[black] focus:outline-none w-full "
                />

                {filteredVerbs
                  ? filteredVerbs.map((item, i) => {
                      return (
                        <li
                          key={i}
                          onClick={() => {
                            setCurrVerb(item);
                            document.activeElement.blur();
                          }}
                          className="flex flex-row justify-between"
                        >
                          <span>{item.english}</span>
                          {item.premium && !isPaidMember ? (
                            <span>🔒</span>
                          ) : null}
                        </li>
                      );
                    })
                  : null}
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
            {currVerb?.english}: {currVerb?.verb} | {currVerb?.transliteration}
          </div>

          <div className="overflow-x-auto">
            {isPaidMember || !currVerb.premium ? (
              <table className="table">
                <tbody>
                  <tr>
                    <td>I</td>
                    <td>
                      {currVerb?.[tense]?.["I"]["arabic"]} |{" "}
                      {currVerb?.[tense]?.["I"]["transliteration"]}
                    </td>
                    <td>We</td>
                    <td>
                      {currVerb?.[tense]?.["we"]["arabic"]} |{" "}
                      {currVerb?.[tense]?.["we"]["transliteration"]}
                    </td>
                  </tr>
                  <tr>
                    <td>You (m)</td>
                    <td>
                      {currVerb?.[tense]?.["youM"]["arabic"]} |{" "}
                      {currVerb?.[tense]?.["youM"]["transliteration"]}
                    </td>
                    <td>You (pl)</td>
                    <td>
                      {currVerb?.[tense]?.["youPl"]["arabic"]} |{" "}
                      {currVerb?.[tense]?.["youPl"]["transliteration"]}
                    </td>
                  </tr>
                  <tr>
                    <td>You (f)</td>
                    <td>
                      {currVerb?.[tense]?.["youF"]["arabic"]} |{" "}
                      {currVerb?.[tense]?.["youF"]["transliteration"]}
                    </td>
                    <td>They</td>
                    <td>
                      {currVerb?.[tense]?.["they"]["arabic"]} |{" "}
                      {currVerb?.[tense]?.["they"]["transliteration"]}
                    </td>
                  </tr>
                  <tr>
                    <td>He</td>
                    <td>
                      {currVerb?.[tense]?.["he"]["arabic"]} |{" "}
                      {currVerb?.[tense]?.["he"]["transliteration"]}
                    </td>
                  </tr>
                  <tr>
                    <td>She</td>
                    <td>
                      {currVerb?.[tense]?.["she"]["arabic"]} |{" "}
                      {currVerb?.[tense]?.["she"]["transliteration"]}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <>
                <span className="text-center text-lg text-[red] mb-4 alert">
                  🔒 Locked for premium members only. Please
                  <Link className="underline" href="/pricing">
                    upgrade
                  </Link>
                  for full access.
                </span>
                <LockedTable />
              </>
            )}
          </div>
        </div>
      </div>

      <div className="divider "></div>
      <a href="/verbs-quiz">
        <MyButton
          text="Take a Quiz on Verb Conjugations"
          onClick={() => router.push("/verbs-quiz")}
        />
      </a>
    </main>
  );
}
