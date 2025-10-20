export const badges = [
  {
    id: "rising-sun",
    name: "Rising Sun",
    description: "Completed first lesson.",
    icon: "🌞",
    unlocked: true,
    requirement: {
      reviewedModules: 1,
    },
  },
  {
    id: "camel-rider",
    name: "Camel Rider",
    description: "Completed 5 lessons.",
    icon: "🐪",
    unlocked: false,
    requirement: {
      reviewedModules: 5,
    },
  },
  {
    id: "ancient-jar",
    name: "Ancient Jar",
    description: "Aced first quiz.",
    icon: "🏺",
    unlocked: false,
    requirement: {
      completedModules: 1,
    },
  },
  {
    id: "nile-bird",
    name: "Nile Bird",
    description: "Aced 5 quizzes.",
    icon: "🐦",
    unlocked: false,
    requirement: {
      completedModules: 5,
    },
  },
  {
    id: "date-palm",
    name: "Date Palm",
    description: "Completed 15 lessons.",
    icon: "🌴",
    unlocked: false,
    requirement: {
      reviewedModules: 15,
    },
  },
  {
    id: "nile-crocodile",
    name: "Nile Crocodile",
    description: "Aced 15 quizzes.",
    icon: "🐊",
    unlocked: false,
    requirement: {
      completedModules: 15,
    },
  },
  {
    id: "pharaoh-crown",
    name: "Pharaoh's Crown",
    description: "Completed all lessons!",
    icon: "🏆",
    unlocked: false,
    requirement: {
      completedModules: 37,
    },
  },
];

export default function BadgeGrid({ badges: userBadges }) {
  const badgesToRender = userBadges || badges;
  return (
    <div className="p-1">
      <h2 className="font-bold text-2xl   mb-2">Your Badges 🏅</h2>
      <div className="grid grid-cols-3  md:grid-cols-4 lg:grid-cols-5 gap-2 ">
        {badgesToRender.map((badge) => (
          <div
            key={badge.id}
            className={`relative group flex flex-col items-center justify-center p-1 rounded-full shadow-md transition border bg-primary text-neutral w-20 h-20 ${
              badge.unlocked ? "bg-white" : "bg-gray-200 opacity-40"
            }`}
          >
            <h3 className="text-5xl font-semibold text-center">{badge.icon}</h3>
            {!badge.unlocked && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 11c.828 0 1.5.672 1.5 1.5V15a1.5 1.5 0 01-3 0v-2.5c0-.828.672-1.5 1.5-1.5zM17 8V6a5 5 0 00-10 0v2H5v14h14V8h-2zm-6-2a3 3 0 016 0v2H11V6z"
                  />
                </svg>
              </div>
            )}

            {/* tooltip shown on parent hover/focus */}
            <div className="absolute bottom-full left-1/2 mb-2 transform -translate-x-1/2 whitespace-nowrap px-3 py-2 rounded bg-neutral text-[white] text-sm opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity pointer-events-none z-1000 shadow-lg">
              <strong className="block">{badge.name}</strong>
              <span className="block text-sm">{badge.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
