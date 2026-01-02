import Greetings from "./Greetings.js";
import Animals from "./Animals.js";
import Colors from "./Colors.js";
import Letters from "./Letters.js";
import Numbers from "./Numbers.js";
import Weather from "./Weather.js";
import Body from "./Body.js";
import House from "./House.js";
import Foods from "./Foods.js";
import Produce from "./Produce.js";
import Drinks from "./Drinks.js";
import Clothing from "./Clothing.js";
import Vacation from "./Vacation.js";
import School from "./School.js";
import Jobs from "./Jobs.js";
import Directions from "./Directions.js";
import Doctor from "./Doctor.js";
import Countries from "./Countries.js";
import Prayers from "./Prayers.js";
import Verbs from "./Verbs.js";
import Prepositions from "./Prepositions.js";
import Transitions from "./Transitions.js";
import Adjectives from "./Adjectives.js";
import Adverbs from "./Adverbs.js";
import Pronouns from "./Pronouns.js";
import Commands from "./Commands.js";
import Restaurant from "./Restaurant.js";
import Love from "./Love.js";
import Nature from "./Nature.js";
import Calendar from "./Calendar.js";
import Onomatopoeia from "./Onomatopoeia.js";
import Insults from "./Insults.js";
import Proverbs from "./Proverbs.js";
import City from "./City.js";
import Endearment from "./Endearment.js";
import Relatives from "./Relatives.js";
import Conflict from "./Conflict.js";

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
  Relatives,
  Restaurant,

  Clothing,
  Vacation,
  School,
  Jobs,
  Love,
  City,
  Directions,
  Doctor,
  Countries,
  Nature,
  Prayers,
  Calendar,
  Conflict,

  Letters,
  Verbs,
  Prepositions,
  Transitions,
  Adjectives,
  Adverbs,
  Pronouns,
  Endearment,
  Insults,
  Onomatopoeia,
  Commands,
  Proverbs,
};

export const searchableModules = Object.entries(AllModules).flatMap(
  ([name, data]) => data.map((item) => ({ ...item, module: name }))
);

export const freeModules = {
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
  Relatives,
};

const moduleLengths = [];
Object.values(AllModules).forEach((item) => {
  moduleLengths.push(item.length);
});

export const totalWords = moduleLengths.reduce((a, b) => a + b, 0);
