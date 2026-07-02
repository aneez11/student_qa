import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, ChevronRight, FileText, Loader2, Layers3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import type { Chapters } from "@/lib/types";
import { GRADE_DATA, API_ENDPOINTS } from "@/lib/constants";
import { getTotalQuestions } from "@/lib/helpers";

const Grade = () => {
  const { gradeId } = useParams();
  const [chapterIds, setChapterIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const numericGradeId = Number(gradeId);
  const currentGrade =
    numericGradeId in GRADE_DATA
      ? GRADE_DATA[numericGradeId as keyof typeof GRADE_DATA]
      : undefined;

  const [chapters, setChapters] = useState<Record<string, Chapters[]>>({});
  const breadcrumbs = useMemo(
    () => [
      { label: "Home", to: "/" },
      { label: currentGrade?.name || `Grade ${gradeId}` },
    ],
    [currentGrade?.name, gradeId],
  );

  useEffect(() => {
    const fetchChapters = async () => {
      if (!gradeId) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(API_ENDPOINTS.CHAPTER_INDEX(gradeId));
        if (!response.ok) {
          throw new Error(`Failed to load index.json for grade ${gradeId}`);
        }

        const chapterFiles: string[] = await response.json();
        const chapterIds = chapterFiles.map((file) =>
          file.replace(/\.json$/, "")
        );

        setChapterIds(chapterIds);
      } catch (err) {
        console.error(err);
        setError("Failed to load chapter list. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [gradeId]);

  useEffect(() => {
    const fetchChapters = async (gradeId: string) => {
      if (chapterIds.length === 0) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch chapters with better error handling and caching
        const chapterPromises = chapterIds.map(async (id) => {
          const response = await fetch(API_ENDPOINTS.CHAPTER_DATA(gradeId, id));
          if (!response.ok) {
            throw new Error(
              `Failed to fetch chapter ${id}: ${response.statusText}`
            );
          }
          return response.json();
        });

        const chapterData = await Promise.all(chapterPromises);

        if (currentGrade && currentGrade.subjects.length > 0) {
          setChapters({
            [currentGrade.subjects[0]]: chapterData,
          });
        }
      } catch (err) {
        console.error("Error loading chapter list for", gradeId, err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load chapters. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };
    if (gradeId) {
      fetchChapters(gradeId);
    }
  }, [gradeId, currentGrade, chapterIds]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar breadcrumbs={breadcrumbs} />
        <div className="flex items-center justify-center px-4 py-24">
          <div className="rounded-[2rem] border border-border/60 bg-card/80 px-8 py-10 text-center shadow-xl backdrop-blur">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Loading chapter library...</p>
            <p className="mt-2 text-sm text-muted-foreground">Pulling the latest chapter index and question counts.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar breadcrumbs={breadcrumbs} />
        <div className="flex items-center justify-center px-4 py-24">
          <div className="max-w-md rounded-[2rem] border border-border/60 bg-card/80 p-8 text-center shadow-xl backdrop-blur">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
              <Layers3 className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold">Error loading content</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{error}</p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/">Back to home</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = Object.values(chapters)
    .flatMap((subjectChapters) => subjectChapters)
    .reduce((total, chapter) => total + getTotalQuestions(chapter), 0);

  return (
    <div className="min-h-screen pb-16">
      <Navbar breadcrumbs={breadcrumbs} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-[2rem] border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <BookOpen className="h-3.5 w-3.5" />
                {currentGrade?.name || "Grade"}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Chapter library
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                Jump into the subject overview, scan chapter counts, and open the reading view from here.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Subjects</div>
                <div className="mt-1 text-lg font-semibold">{currentGrade?.subjects.length || 0}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Chapters</div>
                <div className="mt-1 text-lg font-semibold">{chapterIds.length}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Questions</div>
                <div className="mt-1 text-lg font-semibold">{totalQuestions}</div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers3 className="h-5 w-5 text-primary" />
                  Subjects
                </CardTitle>
                <CardDescription>
                  Available subjects for {currentGrade?.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {currentGrade?.subjects.map((subject) => (
                  <a
                    key={subject}
                    href={`#${subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                    className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm font-medium transition-all hover:border-primary/30 hover:bg-primary/5"
                  >
                    <span>{subject}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </a>
                ))}
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-8">
            {Object.entries(chapters).map(([subject, subjectChapters]) => (
              <section key={subject} id={subject.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">{subject}</h2>
                    <p className="text-sm text-muted-foreground">Select a chapter to start reading.</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {subjectChapters.map((chapter) => (
                    <Link key={chapter.chapter_no} to={`/grade/${gradeId}/${chapter.chapter_no}`} className="group">
                      <Card className="relative h-full overflow-hidden rounded-[1.75rem] border-border/60 bg-card/90 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-xl">
                        <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-teal-500 to-emerald-400" />
                        <CardHeader className="pb-3 pt-6">
                          <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                              Chapter {chapter.chapter_no}
                            </span>
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                              {getTotalQuestions(chapter)} questions
                            </span>
                          </div>
                          <CardTitle className="pt-2 text-xl leading-snug transition-colors group-hover:text-primary">
                            {chapter.name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-6">
                          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-muted">
                            <div className="h-full w-2/3 rounded-full bg-linear-to-r from-primary to-teal-500 transition-all duration-300 group-hover:w-full" />
                          </div>
                          <Button className="w-full rounded-full" variant="outline">
                            View chapter <ArrowLeft className="h-4 w-4 rotate-180" />
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Grade;
