import { MetadataRoute } from "next";

const SITE_URL = "https://iloveyoumom.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    "",
    "/timeline",
    "/gallery",
    "/voices",
    "/wisdom",
    "/card",
    "/collage",
    "/love-letter",
    "/coupons",
    "/quiz",
    "/photo-booth",
    "/gift-box",
    "/memory-jar",
    "/recipes",
    "/gratitude",
    "/family-tree",
    "/promises",
    "/celebration",
    "/bucket-list",
    "/bedtime",
  ];

  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));
}
