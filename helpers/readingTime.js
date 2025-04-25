import readingTime from "reading-time";

const calculateReadingTime = (text) => {
  const stats = readingTime(text);
  return stats.text;
};

export default calculateReadingTime;
