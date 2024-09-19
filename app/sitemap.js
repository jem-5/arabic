// app/sitemap.js
import { getAllPosts } from "@/helpers/parseBlog";

export default async function sitemap() {
  const URL = "https://arabicroad.com";
  const posts = await getAllPosts();

  const postRoutes = posts.map(({ id, date }) => ({
    url: `${URL}/blog/${id}`,
    lastModified: date,
  }));

  const routes = [
    "",
    "/dashboard",
    "/lesson",
    "/quiz",
    "/blog",
    "/about",
    "/contact",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...postRoutes, ...routes];
}

// export default function sitemap() {
//   return [
//     {
//       url: "https://arabicroad.com/",
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 1,
//     },
//     {
//       url: "https://arabicroad.com/dashboard/",
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.8,
//     },
//     {
//       url: "https://arabicroad.com/lesson/",
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.8,
//     },
//     {
//       url: "https://arabicroad.com/quiz/",
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.8,
//     },
//     {
//       url: "https://arabicroad.com/blog/",
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 0.5,
//     },
//     {
//       url: "https://arabicroad.com/about/",
//       lastModified: new Date(),
//       changeFrequency: "yearly",
//       priority: 0.3,
//     },
//     {
//       url: "https://arabicroad.com/contact/",
//       lastModified: new Date(),
//       changeFrequency: "yearly",
//       priority: 0.3,
//     },
//     {
//       url: "https://arabicroad.com/privacy/",
//       lastModified: new Date(),
//       changeFrequency: "yearly",
//       priority: 0.3,
//     },
//     {
//       url: "https://arabicroad.com/terms/",
//       lastModified: new Date(),
//       changeFrequency: "yearly",
//       priority: 0.3,
//     },
//   ];
// }
