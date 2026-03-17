export const CATEGORIES = [
  "All",
  "Technology",
  "Lifestyle",
  "Business",
  "Entertainment",
  "Travel",
  "News",
];

export function getCategoryBadgeClass(category: string): string {
  const map: Record<string, string> = {
    Technology: "bg-teal-500/20 text-teal-400 border border-teal-500/30",
    Lifestyle: "bg-pink-500/20 text-pink-400 border border-pink-500/30",
    Business: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
    Entertainment:
      "bg-purple-500/20 text-purple-400 border border-purple-500/30",
    Travel: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
    News: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
  };
  return (
    map[category] ?? "bg-slate-500/20 text-slate-400 border border-slate-500/30"
  );
}
