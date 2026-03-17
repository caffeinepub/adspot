import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Ad } from "../backend";
import AdCard from "../components/AdCard";
import AdDetailModal from "../components/AdDetailModal";
import { SAMPLE_ADS } from "../data/sampleAds";
import { useGetAdsByCategory } from "../hooks/useQueries";
import { CATEGORIES } from "../lib/categoryColors";

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [detailAd, setDetailAd] = useState<Ad | null>(null);

  const { data: fetchedAds, isLoading } = useGetAdsByCategory(selectedCategory);
  const ads = fetchedAds && fetchedAds.length > 0 ? fetchedAds : SAMPLE_ADS;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Premium Ad Platform
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
          >
            Reach Your
            <span className="text-primary block">Perfect Audience</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            AdSpot connects forward-thinking businesses with engaged audiences.
            Discover premium sponsored content across technology, lifestyle,
            business, and more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("ads-grid")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity teal-glow"
              data-ocid="hero.browse.button"
            >
              Browse Ads <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/advertise"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border text-foreground font-semibold text-base hover:border-primary hover:text-primary transition-colors"
              data-ocid="hero.advertise.button"
            >
              Start Advertising <TrendingUp className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-3xl mx-auto mt-16 grid grid-cols-3 gap-6 rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-6"
        >
          {[
            { value: "50K+", label: "Monthly Visitors" },
            { value: "200+", label: "Active Advertisers" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Category Filter + Grid */}
      <section
        id="ads-grid"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20"
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Ads</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Curated sponsored content from top brands
            </p>
          </div>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-8" data-ocid="ads.filter.tab">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
              data-ocid={`ads.category.${cat.toLowerCase().replace(/ /g, "_")}.tab`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            data-ocid="ads.loading_state"
          >
            {SKELETON_KEYS.map((key) => (
              <div
                key={key}
                className="rounded-2xl overflow-hidden border border-border"
              >
                <Skeleton className="h-48 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : ads.length === 0 ? (
          <div
            className="text-center py-20 rounded-2xl border border-border/50 bg-card/30"
            data-ocid="ads.empty_state"
          >
            <p className="text-muted-foreground">
              No ads found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad, i) => (
              <motion.div
                key={ad.id.toString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
              >
                <AdCard ad={ad} index={i + 1} onViewDetail={setDetailAd} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl border border-primary/20 bg-primary/5 p-10 text-center overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-48 bg-primary/10 rounded-full blur-2xl" />
          </div>
          <h2 className="relative text-3xl font-bold mb-4">
            Ready to Grow Your Brand?
          </h2>
          <p className="relative text-muted-foreground mb-6 max-w-md mx-auto">
            Join hundreds of businesses that trust AdSpot to connect with their
            ideal customers.
          </p>
          <Link
            to="/advertise"
            className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            data-ocid="cta.advertise.button"
          >
            Get Started Today <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <AdDetailModal
        ad={detailAd}
        open={!!detailAd}
        onClose={() => setDetailAd(null)}
      />
    </div>
  );
}
