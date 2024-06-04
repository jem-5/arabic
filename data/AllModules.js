import Greetings from "@/data/Greetings";
import Animals from "@/data/Animals";
import Colors from "@/data/Colors";
import Letters from "./Letters";
import Numbers from "./Numbers";
import Weather from "./Weather";
import Body from "./Body";
import House from "./House";

export const AllModules = {
  Letters,
  Greetings,
  Colors,
  Numbers,
  Animals,
  Weather,
  Body,
  House,
  // Foods,
  // Clothing,
  // Vacation,
  // School,
  // Jobs,
  // Restaurant,
  // Coffee,
  // City,
  // Doctor,
  // Makeup,
  // Verbs,
  // Prepositions,
  // Adjectives,
  // Countries
};

const moduleLengths = [];

Object.values(AllModules).forEach((item) => {
  moduleLengths.push(item.length);
});

export const totalWords = moduleLengths.reduce((a, b) => a + b, 0);
