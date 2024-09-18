export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private",
    },
    sitemap: "https://arabicroad.com/sitemap.xml",
  };
}
