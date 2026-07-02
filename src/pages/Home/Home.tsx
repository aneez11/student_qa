import { Link } from "react-router-dom";
import {
  // Award,
  ArrowRight,
  BookOpen,
  // Code,
  GraduationCap,
  HelpCircle,
  // Sparkles,
  // Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { AVAILABLE_GRADES } from "@/lib/constants";
// import { useBookmarks } from "@/hooks/useBookmarks";

function Home() {
  // const { bookmarks } = useBookmarks();

  return (
    <div className="min-h-screen pb-16">
      <Navbar />

      {/* <section className="relative overflow-hidden px-4 pb-6 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card/70 p-8 shadow-xl shadow-primary/5 backdrop-blur-xl sm:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.primary/15),transparent_35%),radial-gradient(circle_at_bottom_left,theme(colors.emerald.400/12),transparent_30%)]" />
            <div className="relative z-10 max-w-2xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Award className="h-3.5 w-3.5" />
                <span>Interactive learning hub</span>
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Study with a calmer, sharper
                <span className="mt-2 block bg-linear-to-r from-primary via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                  question-first workspace.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Browse grade-wise chapters, jump straight into focused answers,
                and keep the important material bookmarked for later review.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Suggested: start with Grade 9
                </span>
                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Suggested: save tricky answers
                </span>
                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Suggested: use search on chapters
                </span>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#explore">
                  <Button size="lg" className="rounded-full px-6 shadow-lg shadow-primary/20">
                    Explore grades <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                {bookmarks.length > 0 ? (
                  <Link to="/bookmarks">
                    <Button variant="outline" size="lg" className="rounded-full px-6">
                      <Star className="h-4 w-4 fill-current text-amber-500" />
                      Saved questions ({bookmarks.length})
                    </Button>
                  </Link>
                ) : null}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="text-sm font-semibold text-foreground">Grade-wise flow</div>
                  <div className="mt-1 text-sm text-muted-foreground">Fast entry into chapters and topics.</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="text-sm font-semibold text-foreground">Bookmark memory</div>
                  <div className="mt-1 text-sm text-muted-foreground">Saved locally for quick revision.</div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                  <div className="text-sm font-semibold text-foreground">Rich answers</div>
                  <div className="mt-1 text-sm text-muted-foreground">Tables, math, and code stay readable.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Card className="border-border/60 bg-card/90 shadow-lg backdrop-blur">
              <CardHeader className="space-y-0 pb-3 pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Built for focused revision</CardTitle>
              </CardHeader>
              <CardContent className="pb-6 text-sm leading-7 text-muted-foreground">
                Filter by chapter, search within answers, and keep your study
                trail organized without leaving the page.
              </CardContent>
            </Card>

            <Card className="border-border/60 bg-card/90 shadow-lg backdrop-blur">
              <CardHeader className="space-y-0 pb-3 pt-6">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <BookOpen className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Clear chapter structure</CardTitle>
              </CardHeader>
              <CardContent className="pb-6 text-sm leading-7 text-muted-foreground">
                Chapter cards now surface chapter numbers, question counts, and
                quick entry points to the reading view.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
            <div className="inline-flex rounded-2xl bg-blue-500/10 p-3 text-blue-600 dark:text-blue-400">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Complete syllabus</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Structured, grade-based content that keeps the path from topic to answer easy to follow.
            </p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
            <div className="inline-flex rounded-2xl bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
              <Code className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Programming-friendly answers</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Code blocks, snippets, and explanatory text stay readable on small and large screens.
            </p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
            <div className="inline-flex rounded-2xl bg-emerald-500/10 p-3 text-emerald-600 dark:text-emerald-400">
              <HelpCircle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Searchable study space</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Find specific questions quickly and keep the important ones bookmarked.
            </p>
          </div>
        </div>
      </section> */}

      <section id="explore" className="px-4 py-8 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Select your grade</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Choose a grade to open the chapter library and begin reviewing.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
            {AVAILABLE_GRADES.map((grade) => (
              <Link key={grade.id} to={`/grade/${grade.id}`} className="group block">
                <Card className="relative overflow-hidden rounded-[2rem] border-border/60 bg-card/90 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,theme(colors.primary/12),transparent_36%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <CardHeader className="relative px-6 pb-4 pt-8 sm:px-8">
                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-primary-foreground">
                      <GraduationCap className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-center text-2xl font-bold">
                      {grade.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative px-6 pb-8 sm:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium">
                        <BookOpen className="h-4 w-4 text-primary" />
                        {grade.subjects} subjects
                      </span>
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-medium">
                        <HelpCircle className="h-4 w-4 text-emerald-500" />
                        {grade.questions}+ QAs
                      </span>
                    </div>
                    <Button className="mt-6 w-full rounded-full shadow-sm transition-transform group-hover:translate-y-0.5" variant="outline">
                      Open grade <ArrowRight className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
