import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function Header() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        if (error?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks = [
    { to: "/" as const, label: "Home" },
    { to: "/advertise" as const, label: "Advertise With Us" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">
              AdSpot
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              data-ocid="nav.home.link"
            >
              Home
            </Link>
            <Link
              to="/"
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              data-ocid="nav.browse.link"
            >
              Browse Ads
            </Link>
            <Link
              to="/advertise"
              className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              data-ocid="nav.advertise.link"
            >
              Advertise With Us
            </Link>
            {isAuthenticated && (
              <Link
                to="/admin"
                className="px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                data-ocid="nav.admin.link"
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              type="button"
              onClick={handleAuth}
              disabled={isLoggingIn}
              variant="outline"
              className="rounded-full border-border hover:border-primary hover:text-primary hover:bg-primary/10 transition-all"
              data-ocid="nav.login.button"
            >
              {isLoggingIn
                ? "Logging in..."
                : isAuthenticated
                  ? "Logout"
                  : "Login"}
            </Button>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
                data-ocid="nav.mobile.link"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                to="/admin"
                className="block px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Admin
              </Link>
            )}
            <div className="pt-2 pb-1">
              <Button
                type="button"
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant="outline"
                className="w-full rounded-full"
                data-ocid="nav.mobile.login.button"
              >
                {isLoggingIn
                  ? "Logging in..."
                  : isAuthenticated
                    ? "Logout"
                    : "Login"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
