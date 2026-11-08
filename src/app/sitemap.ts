import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

const atualizado = new Date("2026-11-07");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, lastModified: atualizado, changeFrequency: "monthly", priority: 1, images: [`${SITE_URL}/images/casa-17h-1920.webp`] },
    { url: `${SITE_URL}/simulacao`, lastModified: atualizado, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/empresas`, lastModified: atualizado, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/lei-14300`, lastModified: atualizado, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/privacidade`, lastModified: new Date("2026-11-08"), changeFrequency: "yearly", priority: 0.3 },
  ];
}
