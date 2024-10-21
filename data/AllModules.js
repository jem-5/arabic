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
import Vacation from "./Vacation";
import School from "./School";
import Jobs from "./Jobs";
import Directions from "./Directions";
import Doctor from "./Doctor";
import Countries from "./Countries";
import Prayers from "./Prayers";
import Verbs from "./Verbs";
import Prepositions from "./Prepositions";
import Transitions from "./Transitions";
import Adjectives from "./Adjectives";
import Adverbs from "./Adverbs";
import Pronouns from "./Pronouns";
import Commands from "./Commands";
import Restaurant from "./Restaurant";

export const AllModules = {
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
  Restaurant,

  Clothing,
  Vacation,
  School,
  Jobs,
  Directions,
  Doctor,
  Countries,
  Prayers,
  Letters,
  Verbs,
  Prepositions,
  Transitions,
  Adjectives,
  Adverbs,
  Pronouns,
  Commands,

  // Idioms / Proverbs,
  // Nature,
  // Curses,
  // Onomatopeia,
  // Questions,
  // Wedding,
  // Phone,
  // Calendar inc yester, today,tmrw,
  // Store ,
  // Meals of day ,
  // More Adjectives ,
  // More Verbs,
  // City Structures ,
};

const moduleLengths = [];

Object.values(AllModules).forEach((item) => {
  moduleLengths.push(item.length);
});

export const totalWords = moduleLengths.reduce((a, b) => a + b, 0);
