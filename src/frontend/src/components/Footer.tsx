import { Link } from "@tanstack/react-router";
import { Zap } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  return (
    <footer className="border-t border-border/50 bg-card/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary" />
              </div>
              <span className="text-xl font-bold">AdSpot</span>
            </div>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed">
              The premier platform for businesses to reach their target audience
              with precision and impact.
            </p>
            <Link
              to="/advertise"
              className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              data-ocid="footer.advertise.button"
            >
              Become an Advertiser
            </Link>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="footer.home.link"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/advertise"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="footer.advertise.link"
                >
                  Advertise
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  data-ocid="footer.admin.link"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground">
              Categories
            </h4>
            <ul className="space-y-2">
              {["Technology", "Lifestyle", "Business", "Entertainment"].map(
                (cat) => (
                  <li key={cat}>
                    <span className="text-sm text-muted-foreground">{cat}</span>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {year}. Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground">All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
