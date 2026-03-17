import { ExternalBlob } from "../backend";
import type { Ad } from "../backend";

export const SAMPLE_ADS: Ad[] = [
  {
    id: BigInt(1),
    title: "TechVision Pro — Next-Gen 4K Display",
    description:
      "Experience stunning visuals with our award-winning 4K monitor designed for creative professionals and gamers who demand the best.",
    imageId: ExternalBlob.fromURL("https://picsum.photos/seed/tech1/800/500"),
    externalLink: "https://example.com/techvision",
    category: "Technology",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(2),
    title: "Lumière Skincare — Radiance Collection",
    description:
      "Discover the science behind luminous skin. Our plant-based formulas deliver visible results in just 14 days, guaranteed.",
    imageId: ExternalBlob.fromURL("https://picsum.photos/seed/beauty2/800/500"),
    externalLink: "https://example.com/lumiere",
    category: "Lifestyle",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(3),
    title: "NovaTrade — Smarter Investments",
    description:
      "Join 2 million investors who trust NovaTrade for AI-powered portfolio management and real-time market insights.",
    imageId: ExternalBlob.fromURL(
      "https://picsum.photos/seed/finance3/800/500",
    ),
    externalLink: "https://example.com/novatrade",
    category: "Business",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(4),
    title: "StreamFlix Ultra — 4K Streaming Redefined",
    description:
      "Unlimited movies, series, and live events in stunning 4K HDR. Start your 30-day free trial today.",
    imageId: ExternalBlob.fromURL("https://picsum.photos/seed/stream4/800/500"),
    externalLink: "https://example.com/streamflix",
    category: "Entertainment",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(5),
    title: "SkyBound Adventures — Curated Expeditions",
    description:
      "From Himalayan treks to Caribbean retreats. Our expert guides craft unforgettable journeys tailored to your spirit of adventure.",
    imageId: ExternalBlob.fromURL("https://picsum.photos/seed/travel5/800/500"),
    externalLink: "https://example.com/skybound",
    category: "Travel",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
  {
    id: BigInt(6),
    title: "PulseNews — Breaking Stories First",
    description:
      "Stay ahead with real-time global news coverage, in-depth analysis, and exclusive interviews from 500+ journalists worldwide.",
    imageId: ExternalBlob.fromURL("https://picsum.photos/seed/news6/800/500"),
    externalLink: "https://example.com/pulsenews",
    category: "News",
    isActive: true,
    createdAt: BigInt(Date.now()),
  },
];
