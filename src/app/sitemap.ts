import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/catalog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/editor`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/knowledge`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/research`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0,
    },
    {
      url: `${baseUrl}/profile/my-prompts`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0,
    },
    {
      url: `${baseUrl}/profile/my-templates`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0,
    },
    {
      url: `${baseUrl}/profile/settings`,
      lastModified: new Date(),
      changeFrequency: "never",
      priority: 0,
    },
  ];

  // Dynamic routes (e.g. /catalog/[id], /knowledge/[id]) are excluded from this static sitemap
  // since we don't have a database to query. In production, these would be fetched from an API
  // and appended to the array above, e.g.:
  //
  // const prompts = await fetch(`${baseUrl}/api/prompts`).then(r => r.json());
  // const dynamicRoutes = prompts.map((prompt) => ({
  //   url: `${baseUrl}/catalog/${prompt.id}`,
  //   lastModified: new Date(prompt.updatedAt),
  //   changeFrequency: "weekly",
  //   priority: 0.8,
  // }));
  // return [...staticRoutes, ...dynamicRoutes];
}
