// /data/conversationNodes.js

export const NODES = {
  START: {
    prompt: "إزيك؟",
    choices: [
      { text: "كويس الحمد لله", intent: "FEELING_GOOD", goto: "RANDOM" },
      { text: "تعبان شوية", intent: "FEELING_TIRED", goto: "RANDOM" },
      { text: "مشغول", intent: "FEELING_BUSY", goto: "RANDOM" },
    ],
  },

  DAILY_LIFE: {
    prompt: "بتعمل إيه دلوقتي؟",
    choices: [
      { text: "بشتغل", intent: "WORK", goto: "WORK_TALK" },
      { text: "قاعد في البيت", intent: "HOME", goto: "HOME_TALK" },
      { text: "برا", intent: "OUT", goto: "OUT_TALK" },
    ],
  },

  WORK_TALK: {
    prompt: "شغلك عامل إيه؟",
    choices: [
      { text: "تمام", intent: "POSITIVE", goto: "RANDOM" },
      { text: "مجهد", intent: "FEELING_TIRED", goto: "RANDOM" },
    ],
  },

  HOME_TALK: {
    prompt: "بتعمل إيه في البيت؟",
    choices: [
      { text: "بذاكر", intent: "STUDY", goto: "RANDOM" },
      { text: "بترتاح", intent: "RELAX", goto: "RANDOM" },
    ],
  },

  OUT_TALK: {
    prompt: "طالع فين؟",
    choices: [
      { text: "مشوار", intent: "ERRAND", goto: "RANDOM" },
      { text: "قابل صحابي", intent: "SOCIAL", goto: "RANDOM" },
    ],
  },

  WEATHER_TALK: {
    prompt: "الجو عامل إيه؟",
    choices: [
      { text: "مشمس", intent: "SUNNY", goto: "RANDOM" },
      { text: "ممطر", intent: "RAINY", goto: "RANDOM" },
    ],
  },

  MARRIED_TALK: {
    prompt: "إنت متجوز؟",
    choices: [
      { text: "أيوة، متجوز", intent: "MARRIED", goto: "SPOUSE_TALK" },
      { text: "لأ، مش متجوز", intent: "SINGLE", goto: "FIND_SPOUSE_TALK" },
    ],
  },

  SPOUSE_TALK: {
    prompt: "إزاي جوزك؟",
    choices: [
      { text: "كويس الحمد لله", intent: "POSITIVE", goto: "RANDOM" },
      { text: "مش كويس", intent: "FEELING_TIRED", goto: "RANDOM" },
    ],
  },

  FIND_SPOUSE_TALK: {
    prompt: "نفسك تتجوزي في المستقبل؟",
    choices: [
      { text: "أيوة، نفسي", intent: "POSITIVE", goto: "RANDOM" },
      { text: "مش أكيد", intent: "FEELING_BUSY", goto: "RANDOM" },
    ],
  },
  KIDS_TALK: {
    prompt: "عندك أولاد؟",
    choices: [
      {
        text: "أيوة، عندي أولاد",
        intent: "POSITIVE",
        goto: "RANDOM",
      },
      {
        text: "لأ، معنديش أولاد",
        intent: "FEELING_BUSY",
        goto: "RANDOM",
      },
    ],
  },
  TIME_OF_DAY_TALK: {
    prompt: " كم الساعة دلوقتي؟",
    choices: [
      { text: "صباح", intent: "MORNING", goto: "RANDOM" },
      { text: "مساء", intent: "EVENING", goto: "RANDOM" },
      { text: "ليل", intent: "NIGHT", goto: "RANDOM" },
    ],
  },

  WEEKEND_TALK: {
    prompt: "بتعمل إيه في الويك إند؟",
    choices: [
      { text: "بذاكر", intent: "STUDY", goto: "RANDOM" },
      { text: "برتاح", intent: "RELAX", goto: "RANDOM" },
      { text: "بخرج مشاوير", intent: "ERRAND", goto: "RANDOM" },
      { text: "بقابل صحابي", intent: "SOCIAL", goto: "RANDOM" },
    ],
  },

  FAVORITE_FOOD_TALK: {
    prompt: "إيه أكلك المفضل؟",
    choices: [
      { text: "الكشري", intent: "POSITIVE", goto: "RANDOM" },
      { text: "الملوخية", intent: "POSITIVE", goto: "RANDOM" },
      { text: " الطعمية", intent: "POSITIVE", goto: "RANDOM" },
    ],
  },

  TEA_OR_COFFEE_TALK: {
    prompt: "بتحب تشرب إيه؟",
    choices: [
      { text: "شاي", intent: "POSITIVE", goto: "RANDOM" },
      { text: "قهوة", intent: "POSITIVE", goto: "RANDOM" },
    ],
  },
  FAVORITE_SEASON: {
    prompt: "إيه فصلك السنة المفضل؟",
    choices: [
      { text: "الصيف", intent: "SUNNY", goto: "RANDOM" },
      { text: "الشتا", intent: "RAINY", goto: "RANDOM" },
      { text: "الربيع", intent: "POSITIVE", goto: "RANDOM" },
      { text: "الخريف", intent: "POSITIVE", goto: "RANDOM" },
    ],
  },

  TYPICAL_TRANSPORTATION: {
    prompt: "بتسافر ازاي عادةً؟",
    choices: [
      { text: "بالمترو", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بالأتوبيس", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بالعربية", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بالتاكسي", intent: "POSITIVE", goto: "RANDOM" },
      { text: "ماشي", intent: "POSITIVE", goto: "RANDOM" },
    ],
  },

  MOOD: {
    prompt: "حاسس بطاقة ولا مرهق؟",
    choices: [
      { text: "عندي طاقة", intent: "POSITIVE", goto: "RANDOM" },
      { text: "حاسس مرهق", intent: "FEELING_TIRED", goto: "RANDOM" },
    ],
  },

  HOBBIES: {
    prompt: "بتحب تعمل إيه في وقت فراغك؟",
    choices: [
      { text: "بقرأ كتب", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بسمع موسيقى", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بمشي", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بطبخ", intent: "POSITIVE", goto: "RANDOM" },
    ],
  },

  EAT_OUT_OR_HOME: {
    prompt: "بتحب تأكل بره ولا في البيت؟",
    choices: [
      { text: "بحب أكل بره", intent: "POSITIVE", goto: "FAVORITE_RESTAURANT" },
      {
        text: "بحب أكل في البيت",
        intent: "POSITIVE",
        goto: "FAVORITE_FOOD_TO_COOK",
      },
    ],
  },

  FAVORITE_RESTAURANT: {
    prompt: "إيه مطعمك المفضل؟",
    choices: [
      { text: "مطعم مصري", intent: "POSITIVE", goto: "RANDOM" },
      { text: "مطعم إيطالي", intent: "POSITIVE", goto: "RANDOM" },
      { text: "مطعم صيني", intent: "POSITIVE", goto: "RANDOM" },
      { text: "مطعم هندي", intent: "POSITIVE", goto: "RANDOM" },
    ],
  },

  FAVORITE_FOOD_TO_COOK: {
    prompt: "إيه أكلك المفضل تطبخه؟",
    choices: [
      { text: "مكرونة", intent: "POSITIVE", goto: "RANDOM" },
      { text: "شوربة", intent: "POSITIVE", goto: "RANDOM" },
      { text: "فراخ", intent: "POSITIVE", goto: "RANDOM" },
    ],
  },

  TECH_USAGE: {
    prompt: "بتستخدم الموبايل كتير؟",

    choices: [
      { text: "أيوة، كتير", intent: "POSITIVE", goto: "RANDOM" },
      { text: "لأ، مش كتير", intent: "FEELING_BUSY", goto: "RANDOM" },
    ],
  },

  PLANS_UPCOMING: {
    prompt: "عندك خطط قريبة؟",
    choices: [
      { text: "أيوة، عندي خطط", intent: "POSITIVE", goto: "VACATION_GOALS" },
      { text: "لأ، مفيش خطط", intent: "FEELING_BUSY", goto: "RANDOM" },
    ],
  },

  VACATION_GOALS: {
    prompt: "نفسك تسافر فين؟",
    choices: [
      { text: "بحب البحر", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بحب الجبال", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بحب المدن الكبيرة", intent: "POSITIVE", goto: "RANDOM" },
    ],
  },

  SOCIAL_TALK: {
    prompt: "عندك صحاب قريبين منك؟",
    choices: [
      {
        text: "أيوة، عندي صحاب كتير",
        intent: "POSITIVE",
        goto: "FRIENDS_ACTIVITIES",
      },
      { text: "لأ، معنديش صحاب كتير", intent: "FEELING_BUSY", goto: "RANDOM" },
    ],
  },

  FRIENDS_ACTIVITIES: {
    prompt: "بتعمل إيه مع صحابك؟",
    choices: [
      { text: "بخرج معاهم", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بقعد في البيت معاهم", intent: "FEELING_TIRED", goto: "RANDOM" },
    ],
  },

  HEALTH_TALK: {
    prompt: "صحتك عاملة إيه؟",
    choices: [
      { text: "كويسة الحمد لله", intent: "POSITIVE", goto: "RANDOM" },
      { text: "محتاج أرتاح", intent: "FEELING_TIRED", goto: "RANDOM" },
    ],
  },

  MORNING_ROUTINE: {
    prompt: "بتعمل إيه أول ما تصحى؟",
    choices: [
      { text: "بشرب قهوة", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بفطر", intent: "POSITIVE", goto: "RANDOM" },
      { text: "بفتح الموبايل", intent: "TECH", goto: "RANDOM" },
    ],
  },

  SLEEP_TALK: {
    prompt: "بتنام بدري ولا متأخر؟",
    choices: [
      { text: "بدري", intent: "POSITIVE", goto: "RANDOM" },
      { text: "متأخر", intent: "FEELING_TIRED", goto: "RANDOM" },
    ],
  },
  CITY_TALK: {
    prompt: "ساكن في مدينة ولا قرية؟",
    choices: [
      { text: "مدينة", intent: "CITY", goto: "RANDOM" },
      { text: "قرية", intent: "VILLAGE", goto: "RANDOM" },
    ],
  },

  FAVORITE_PLACE: {
    prompt: "بتحب تخرج فين؟",
    choices: [
      { text: "كافيه", intent: "SOCIAL", goto: "RANDOM" },
      { text: "مول", intent: "ERRAND", goto: "RANDOM" },
      { text: "مكان هادي", intent: "RELAX", goto: "RANDOM" },
    ],
  },

  EATING_TIME: {
    prompt: "بتاكل كام مرة في اليوم؟",
    choices: [
      { text: "مرتين", intent: "POSITIVE", goto: "RANDOM" },
      { text: "تلاتة", intent: "POSITIVE", goto: "RANDOM" },
    ],
  },

  STREET_FOOD: {
    prompt: "بتحب أكل الشارع؟",
    choices: [
      { text: "أيوة", intent: "POSITIVE", goto: "RANDOM" },
      { text: "لأ", intent: "FEELING_BUSY", goto: "RANDOM" },
    ],
  },
  DAY_RATING: {
    prompt: "يومك كان حلو؟",
    choices: [
      { text: "أيوة", intent: "POSITIVE", goto: "RANDOM" },
      { text: "عادي", intent: "NEUTRAL", goto: "RANDOM" },
      { text: "مش قوي", intent: "FEELING_TIRED", goto: "RANDOM" },
    ],
  },

  LOOKING_FORWARD: {
    prompt: "مستني حاجة حلوة قريب؟",
    choices: [
      { text: "أيوة", intent: "POSITIVE", goto: "RANDOM" },
      { text: "مش دلوقتي", intent: "FEELING_BUSY", goto: "RANDOM" },
    ],
  },

  END: {
    prompt: "تشرفت بالكلام معاك 😊",
    choices: [],
  },
};
