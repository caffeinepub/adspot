import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import type { Ad } from "../backend";
import { getCategoryBadgeClass } from "../lib/categoryColors";

interface AdCardProps {
  ad: Ad;
  index: number;
  onViewDetail: (ad: Ad) => void;
}

export default function AdCard({ ad, index, onViewDetail }: AdCardProps) {
  const imageUrl = ad.imageId.getDirectURL();

  return (
    <div
      className="group rounded-2xl overflow-hidden border border-border bg-card shadow-card card-hover flex flex-col"
      data-ocid={`ads.item.${index}`}
    >
      {/* Clickable image area */}
      <button
        type="button"
        onClick={() => onViewDetail(ad)}
        className="relative h-48 overflow-hidden bg-muted w-full text-left"
        aria-label={`View details for ${ad.title}`}
      >
        <img
          src={imageUrl}
          alt={ad.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryBadgeClass(ad.category)}`}
          >
            {ad.category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <button
          type="button"
          onClick={() => onViewDetail(ad)}
          className="text-left mb-2"
        >
          <h3 className="font-semibold text-lg leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {ad.title}
          </h3>
        </button>
        <p className="text-sm text-muted-foreground line-clamp-3 flex-1 leading-relaxed">
          {ad.description}
        </p>

        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(Number(ad.createdAt) / 1_000_000).toLocaleDateString(
              "en-US",
              {
                month: "short",
                day: "numeric",
                year: "numeric",
              },
            )}
          </span>
          <Button
            size="sm"
            className="rounded-full bg-primary text-primary-foreground hover:opacity-90 gap-1.5 text-xs font-semibold"
            onClick={() => onViewDetail(ad)}
            data-ocid={`ads.view.button.${index}`}
          >
            View Ad <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
