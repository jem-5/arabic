// app/sitemap.js
import { AllModules } from "@/data/AllModules";
import { getAllPosts } from "@/helpers/parseBlog";

export default async function sitemap() {
  const URL = "https://arabicroad.com";
  const posts = await getAllPosts();

  const postRoutes = posts.map(({ id, date }) => ({
    url: `${URL}/blog/${id}/`,
    lastModified: date,
  }));

  const routes = [
    "/",
    "/dashboard/",
    "/lesson/",
    "/quiz/",
    "/blog/",
    "/about/",
    "/contact/",
    "/privacy/",
    "/terms/",
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  const lessonRoutes = Object.keys(AllModules).map((topic) => ({
    url: `${URL}/lesson/?topic=${topic}`,
    lastModified: new Date().toISOString(),
  }));

  const quizRoutes = Object.keys(AllModules).map((topic) => ({
    url: `${URL}/quiz/?topic=${topic}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes, ...postRoutes, ...lessonRoutes, ...quizRoutes];
}
