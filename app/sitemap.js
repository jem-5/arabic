// app/sitemap.js
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

  return [...routes, ...postRoutes];
}
