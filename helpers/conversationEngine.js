export function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function processChoice({ choice, nodes, transitions, visitedNodeIds }) {
  const transitionText = transitions[choice.intent]
    ? randomFrom(transitions[choice.intent])
    : "";

  const randomNodes = [
    "DAILY_LIFE",
    "WEATHER_TALK",
    "MARRIED_TALK",
    "KIDS_TALK",
    "HOBBIES",
    "TIME_OF_DAY_TALK",
    "WEEKEND_TALK",
    "FAVORITE_FOOD_TALK",
    "TEA_OR_COFFEE_TALK",
    "FAVORITE_SEASON",
    "TYPICAL_TRANSPORTATION",
    "MOOD",
    "EAT_OUT_OR_HOME",
    "TECH_USAGE",
    "PLANS_UPCOMING",
    "SOCIAL_TALK",
    "HEALTH_TALK",
    "MORNING_ROUTINE",
    "SLEEP_TALK",
    "CITY_TALK",
    "FAVORITE_PLACE",
    "EATING_TIME",
    "STREET_FOOD",
    "DAY_RATING",
    "LOOKING_FORWARD",
  ];

  const unvisited = randomNodes.filter((nodeId) => !visitedNodeIds.has(nodeId));

  console.log("Unvisited nodes:", unvisited);

  const nextNodeId =
    unvisited.length === 0
      ? "END"
      : choice.goto === "RANDOM"
      ? randomFrom(unvisited)
      : choice.goto;

  console.log("Next node ID:", nextNodeId, nodes[nextNodeId].prompt);

  return {
    npcMessage: transitionText
      ? `${transitionText} ${nodes[nextNodeId].prompt}`
      : nodes[nextNodeId].prompt,
    nextNodeId: nextNodeId,
    choices: nodes[nextNodeId].choices,
  };
}
