import Greetings from "@/data/Greetings";
import Animals from "@/data/Animals";
import Colors from "@/data/Colors";
import Letters from "./Letters";
import Numbers from "./Numbers";
import Weather from "./Weather";
import Body from "./Body";
import House from "./House";
import Foods from "./Foods";
import Produce from "./Produce";
import Drinks from "./Drinks";
import Clothing from "./Clothing";

export const AllModules = {
  Letters,
  Greetings,
  Colors,
  Numbers,
  Animals,
  Weather,
  Body,
  House,
  Foods,
  Produce,
  Drinks,
  Clothing,

  // Vacation,
  // School,
  // Jobs,
  // City,
  // Doctor,
  // Countries,
  // Courtesies,
  // Prayers,

  // Verbs,
  // Prepositions,
  // Adjectives,
  // Tenses,
  // Cases
};

const moduleLengths = [];

Object.values(AllModules).forEach((item) => {
  moduleLengths.push(item.length);
});

export const totalWords = moduleLengths.reduce((a, b) => a + b, 0);
