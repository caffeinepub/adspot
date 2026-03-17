import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExternalLink, X } from "lucide-react";
import type { Ad } from "../backend";
import { getCategoryBadgeClass } from "../lib/categoryColors";

interface AdDetailModalProps {
  ad: Ad | null;
  open: boolean;
  onClose: () => void;
}

export default function AdDetailModal({
  ad,
  open,
  onClose,
}: AdDetailModalProps) {
  if (!ad) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-2xl p-0 overflow-hidden border-border bg-card rounded-2xl"
        data-ocid="ads.detail.dialog"
      >
        {/* Image */}
        <div className="relative h-64 bg-muted overflow-hidden">
          <img
            src={ad.imageId.getDirectURL()}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4">
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${getCategoryBadgeClass(ad.category)}`}
            >
              {ad.category}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-background transition-colors"
            data-ocid="ads.detail.close_button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold leading-tight">
              {ad.title}
            </DialogTitle>
          </DialogHeader>
          <p className="mt-3 text-muted-foreground leading-relaxed">
            {ad.description}
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <span>Published:</span>
            <span>
              {new Date(Number(ad.createdAt) / 1_000_000).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            </span>
          </div>

          <div className="mt-6">
            <a
              href={ad.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
            >
              <Button
                className="w-full rounded-full bg-primary text-primary-foreground font-semibold py-3 hover:opacity-90 gap-2"
                data-ocid="ads.detail.visit.button"
              >
                Visit Website <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
