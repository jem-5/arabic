"use client";

import { useEffect, useRef, useState } from "react";
import MyButton from "../../components/Button";
import ImageMapper from "react-img-mapper";
import Cairo from "@/data/map/Cairo";
import Alexandria from "@/data/map/Alexandria";
import Giza from "@/data/map/Giza";
import Luxor from "@/data/map/Luxor";
import Aswan from "@/data/map/Aswan";
import PortSaid from "@/data/map/PortSaid";
import Mansoura from "@/data/map/Mansoura";
import SharmElSheikh from "@/data/map/SharmElSheikh";

const Mapper = ({ onRegionClick }) => {
  const [parentWidth, setParentWidth] = useState(400);

  useEffect(() => {
    const handleResize = () => {
      setParentWidth(window.innerWidth >= 768 ? 700 : 400);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });
  const url = "/egypt.png";
  const areas = [
    {
      alt: "alexandria",
      name: "alexandria",
      title: "alexandria",
      coords: [674, 213, 462, 133],
      shape: "rect",
    },

    {
      alt: "portsaid",
      name: "portsaid",
      title: "portsaid",
      coords: [1106, 185, 881, 105],
      shape: "rect",
    },

    {
      alt: "mansoura",
      name: "mansoura",
      title: "mansoura",
      coords: [1048, 265, 837, 185],
      shape: "rect",
    },

    {
      alt: "cairo",
      name: "cairo",
      title: "cairo",
      coords: [805, 345, 928, 265],
      shape: "rect",
    },

    {
      alt: "giza",
      name: "giza",
      title: "giza",
      coords: [675, 330, 820, 410],
      shape: "rect",
    },

    {
      alt: "sharmelsheikh",
      name: "sharmelsheikh",
      title: "sharmelsheikh",
      coords: [1345, 537, 1088, 457],
      shape: "rect",
    },

    {
      alt: "luxor",
      name: "luxor",
      title: "luxor",
      coords: [1071, 720, 890, 640],
      shape: "rect",
    },

    {
      alt: "aswan",
      name: "aswan",
      title: "aswan",
      coords: [1013, 870, 844, 790],
      shape: "rect",
    },
  ];

  return (
    <ImageMapper
      src={url}
      name="egypt-map"
      areas={areas}
      responsive
      toggle={true}
      imgWidth={1536}
      parentWidth={parentWidth}
      onClick={(area) => {
        onRegionClick(area.name);
      }}
    />
  );
};

export default function ClickableMap() {
  const [region, setRegion] = useState("cairo");
  const [questionNum, setQuestionNum] = useState(0);
  const [topic, setTopic] = useState(null);

  const Regions = {
    cairo: Cairo,
    alexandria: Alexandria,
    giza: Giza,
    luxor: Luxor,
    aswan: Aswan,
    portsaid: PortSaid,
    mansoura: Mansoura,
    sharmelsheikh: SharmElSheikh,
  };

  const handleRegionClick = (name) => {
    setRegion(name);
    console.log("region", region);
  };

  const handleClickNext = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    const length = Regions[region][topic].length;
    if (questionNum < length - 1) {
      setQuestionNum((prev) => prev + 1);
      return;
    } else {
      setQuestionNum(0);
    }
  };

  const handleClickPrevious = (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    if (questionNum > 0) setQuestionNum((prev) => prev - 1);
  };

  const openModal = (name) => {
    setQuestionNum(0);
    setTopic(name);
    document.getElementById("my_modal_1").showModal();
    document.getElementById("modal_bg").style.filter = "blur(5px)";
  };

  return (
    <main
      className="flex flex-col     gap-4   w-[400px]  md:w-[700px]    items-center justify-start"
      id="modal_bg"
    >
      <h1 className="text-2xl  font-bold text-center text-neutral">
        Explore Egypt{" "}
      </h1>

      <Mapper onRegionClick={handleRegionClick} />

      {Regions[region] && (
        <div className=" gap-2 bg-[white] opacity-85 p-2 rounded-lg    border-3 border-[gray] ">
          <img
            src={Regions[region].image}
            alt="city"
            className="w-1/2 float-right"
          />

          <div className="  text-[black]">
            <div className="text-xl">
              Selected City: {Regions[region].name} | {Regions[region].arabic} |{" "}
              {Regions[region].transliteration}
            </div>
            {Regions[region].region ? (
              <>
                <div className="text-bold">
                  {" "}
                  Region: {Regions[region].region}
                </div>
              </>
            ) : null}

            <div>
              <hr />
              {Regions[region].description.english}
              <br />
              {Regions[region].description.arabic}
            </div>
            <hr />

            <h5
              className="text-lg font-bold  hover:cursor-pointer"
              onClick={() => openModal("vocabulary")}
            >
              📚Explore Vocabulary
            </h5>
            <h5
              className="text-lg font-bold hover:cursor-pointer"
              onClick={() => openModal("expressions")}
            >
              🗣️Explore Expressions
            </h5>
            <h5
              className="text-lg font-bold hover:cursor-pointer"
              onClick={() => openModal("foods")}
            >
              🍽️Explore Foods
            </h5>
            <h5
              className="text-lg font-bold hover:cursor-pointer"
              onClick={() => openModal("landmarks")}
            >
              🏛️Explore Landmarks
            </h5>
            <h5
              className="text-lg font-bold
            
            hover:cursor-pointer"
              onClick={() => openModal("culturalFacts")}
            >
              💡️Explore Cultural Facts
            </h5>

            <div tabIndex={0} className="collapse collapse-arrow border-2 ">
              <input type="checkbox" />

              <div className="collapse-title   text-lg font-bold pl-0">
                🔗Explore Related Modules
              </div>
              <div className="collapse-content text-sm">
                {Regions[region]["relatedModules"].map((module, idx) => {
                  return (
                    <div key={idx}>
                      <a
                        className="block text-lg underline"
                        href={`/lesson/?topic=${module}`}
                      >
                        •{module}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <dialog id="my_modal_1" className="modal ">
        <div className="modal-box bg-[white] text-neutral md:card-side  w-2/3 h-fit">
          {Regions[region] && (
            <div className="flex flex-row justify-between">
              <h3 className="text-xs text-center uppercase ">
                {Regions[region].name}: {topic}
              </h3>

              <h3>
                {questionNum + 1}/{Regions[region]?.[topic]?.length}{" "}
              </h3>
            </div>
          )}

          {Regions[region] && topic && (
            <div className="card  bg-neutral  w-full  z-100 text-[white]  border-1 border-neutral p-5">
              <div className="text-4xl">
                {Regions[region][topic][questionNum]
                  ? Regions[region][topic][questionNum]?.english
                  : null}
              </div>
              <div className="card md:card-side  bg-neutral  w-full  z-100 text-[white]  border-1 border-neutral ">
                <div className="card-body flex flex-col justify-between  w-full border-1 border-neutral ">
                  <div className="flex items-center justify-end ">
                    <div className="chat chat-end  ">
                      <div className="chat-bubble   bg-secondary text-2xl leading-relaxed  text-[white]   min-w-fit">
                        {Regions[region][topic][questionNum]
                          ? Regions[region][topic][questionNum]?.arabic
                          : null}
                      </div>
                    </div>
                  </div>

                  <div className="text-2xl text-right place-content-end italic">
                    {Regions[region][topic][questionNum]
                      ? Regions[region][topic][questionNum]?.transliteration
                      : null}
                  </div>
                </div>
                {Regions[region][topic][questionNum]?.image ? (
                  <figure className=" w-full self-center ">
                    <img
                      src={Regions[region][topic][questionNum]?.image}
                      alt="egypt"
                    />
                  </figure>
                ) : null}
              </div>
              {Regions[region][topic][questionNum].description ? (
                <div className="text-md text-left place-content-end italic">
                  <span className="not-italic">💡</span>
                  {Regions[region][topic][questionNum]?.description}
                </div>
              ) : null}
            </div>
          )}

          <div className="flex flex-row justify-between mt-1 w-full">
            <MyButton
              classRest={questionNum === 0 ? "invisible" : "visible"}
              text={
                <svg
                  className="w-5 h-5 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m15 19-7-7 7-7"
                  />
                </svg>
              }
              func={handleClickPrevious}
            />

            <MyButton
              classRest="bg-neutral"
              text={
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m9 5 7 7-7 7"
                  />
                </svg>
              }
              func={handleClickNext}
            />
          </div>
        </div>{" "}
        <form
          method="dialog"
          className="modal-backdrop"
          onClick={() =>
            (document.getElementById("modal_bg").style.filter = "blur(0px)")
          }
        >
          <button>Close</button>
        </form>
      </dialog>
    </main>
  );
}
