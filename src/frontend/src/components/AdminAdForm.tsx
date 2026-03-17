import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import type { Ad } from "../backend";
import { ExternalBlob } from "../backend";
import { CATEGORIES } from "../lib/categoryColors";

interface AdminAdFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    imageId: ExternalBlob;
    externalLink: string;
    category: string;
  }) => Promise<void>;
  editAd?: Ad | null;
  isPending: boolean;
}

export default function AdminAdForm({
  open,
  onClose,
  onSubmit,
  editAd,
  isPending,
}: AdminAdFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [category, setCategory] = useState("Technology");
  const [imageBlob, setImageBlob] = useState<ExternalBlob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // biome-ignore lint/correctness/useExhaustiveDependencies: setState setters are stable
  useEffect(() => {
    if (editAd) {
      setTitle(editAd.title);
      setDescription(editAd.description);
      setExternalLink(editAd.externalLink);
      setCategory(editAd.category);
      setImageBlob(editAd.imageId);
      setImagePreview(editAd.imageId.getDirectURL());
    } else {
      setTitle("");
      setDescription("");
      setExternalLink("");
      setCategory("Technology");
      setImageBlob(null);
      setImagePreview(null);
    }
    setErrors({});
    setUploadProgress(0);
  }, [editAd, open]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((p) =>
      setUploadProgress(p),
    );
    setImageBlob(blob);
    setImagePreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required";
    if (!description.trim()) e.description = "Description is required";
    if (!externalLink.trim()) e.externalLink = "Link is required";
    if (!imageBlob) e.image = "Image is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !imageBlob) return;
    await onSubmit({
      title,
      description,
      imageId: imageBlob,
      externalLink,
      category,
    });
  };

  const cats = CATEGORIES.filter((c) => c !== "All");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg border-border bg-card"
        data-ocid="admin.ad.dialog"
      >
        <DialogHeader>
          <DialogTitle>{editAd ? "Edit Ad" : "Create New Ad"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-1.5">
            <Label htmlFor="ad-title">Title</Label>
            <Input
              id="ad-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ad title"
              className="bg-muted border-border"
              data-ocid="admin.ad.title.input"
            />
            {errors.title && (
              <p
                className="text-xs text-destructive"
                data-ocid="admin.ad.title.error_state"
              >
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="ad-desc">Description</Label>
            <Textarea
              id="ad-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this ad"
              className="bg-muted border-border resize-none"
              rows={3}
              data-ocid="admin.ad.description.textarea"
            />
            {errors.description && (
              <p
                className="text-xs text-destructive"
                data-ocid="admin.ad.description.error_state"
              >
                {errors.description}
              </p>
            )}
          </div>

          {/* External Link */}
          <div className="space-y-1.5">
            <Label htmlFor="ad-link">Destination URL</Label>
            <Input
              id="ad-link"
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://yourwebsite.com"
              className="bg-muted border-border"
              data-ocid="admin.ad.link.input"
            />
            {errors.externalLink && (
              <p
                className="text-xs text-destructive"
                data-ocid="admin.ad.link.error_state"
              >
                {errors.externalLink}
              </p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger
                className="bg-muted border-border"
                data-ocid="admin.ad.category.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {cats.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <Label>Image</Label>
            <label
              htmlFor="ad-image"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors relative overflow-hidden"
              data-ocid="admin.ad.image.dropzone"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Click to upload image</span>
                </div>
              )}
            </label>
            <input
              id="ad-image"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
              data-ocid="admin.ad.upload_button"
            />
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            )}
            {errors.image && (
              <p
                className="text-xs text-destructive"
                data-ocid="admin.ad.image.error_state"
              >
                {errors.image}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full border-border"
              data-ocid="admin.ad.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="rounded-full bg-primary text-primary-foreground"
              data-ocid="admin.ad.submit_button"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : editAd ? (
                "Update Ad"
              ) : (
                "Create Ad"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
