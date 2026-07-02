import { Link, useLocation } from "react-router-dom";
import { BookOpen, Bookmark, ChevronRight, Home, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface NavbarProps {
  breadcrumbs?: { label: string; to?: string }[];
}

export function Navbar({ breadcrumbs }: NavbarProps) {
  const location = useLocation();
  const showBreadcrumbs = Boolean(breadcrumbs?.length);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl transition-all duration-300">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group inline-flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-teal-500 text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-300 group-hover:-translate-y-0.5">
            <BookOpen className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-base font-semibold tracking-tight text-foreground">
              LearnQuest
            </span>
            <span className="block text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Student QA Hub
            </span>
          </span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          {showBreadcrumbs ? (
            <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-primary/70" />
              {breadcrumbs?.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1;

                return (
                  <div key={`${crumb.label}-${idx}`} className="flex min-w-0 items-center gap-2">
                    {crumb.to && !isLast ? (
                      <Link
                        to={crumb.to}
                        className="truncate transition-colors hover:text-primary"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="truncate font-medium text-foreground">
                        {crumb.label}
                      </span>
                    )}
                    {!isLast && <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50" />}
                  </div>
                );
              })}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              A calmer way to revise and review.
            </span>
          )}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Button
            asChild
            variant={location.pathname === "/" ? "secondary" : "ghost"}
            size="sm"
            className={cn("rounded-full px-2.5 sm:px-4", location.pathname === "/" && "shadow-xs")}
          >
            <Link to="/">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>

          <Button
            asChild
            variant={location.pathname === "/bookmarks" ? "secondary" : "ghost"}
            size="sm"
            className={cn("rounded-full px-2.5 sm:px-4", location.pathname === "/bookmarks" && "shadow-xs")}
          >
            <Link to="/bookmarks">
              <Bookmark className="h-4 w-4" />
              <span className="hidden sm:inline">Saved QAs</span>
            </Link>
          </Button>

          <div className="hidden h-5 w-px bg-border/60 mx-1 sm:block" />

          <ThemeToggle />
        </div>
      </div>

      {showBreadcrumbs && (
        <div className="border-t border-border/50 px-4 py-2 text-sm text-muted-foreground md:hidden sm:px-6">
          <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/70 px-3 py-1 font-medium text-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              {breadcrumbs?.[breadcrumbs.length - 1]?.label}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
export default Navbar;
