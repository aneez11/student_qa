import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowUp, BookOpen, Filter, Layers3, Search } from "lucide-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "katex/dist/katex.min.css";
import { BlockMath, InlineMath } from "react-katex";

import QuestionCard from "@/components/QuestionCard";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDataFetch } from "@/hooks/useDataFetch";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { API_ENDPOINTS, SCROLL_THRESHOLD } from "@/lib/constants";
import { filterQuestions, scrollToTop } from "@/lib/helpers";
import type { Chapters, Question } from "@/lib/types";

const TableRenderer = memo(({ data }: { data: Question }) => {
  return (
    <div className="question-html space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">Q</span>
        Question
      </div>
      <div className="text-lg font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: data.question }} />
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">A</span>
        Answer
      </div>
      <div className="space-y-3 text-sm leading-7 text-foreground/90" dangerouslySetInnerHTML={{ __html: data.answer }} />
      <div className="overflow-x-auto rounded-2xl border border-border/60 bg-background/70">
        <table className="min-w-full">
          <thead>
            <tr>
              {data.table_data?.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.table_data?.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} dangerouslySetInnerHTML={{ __html: cell }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});
TableRenderer.displayName = "TableRenderer";

const EquationRenderer = memo(({ equation }: { equation: string }) => {
  return (
    <div className="question-html rounded-2xl border border-border/60 bg-muted/30 p-5 text-center shadow-sm">
      <BlockMath math={equation} />
    </div>
  );
});
EquationRenderer.displayName = "EquationRenderer";

const MathProblemRenderer = memo(({ question }: { question: Question }) => {
  const renderMathText = useCallback((text: string) => {
    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

    return parts.map((part, index) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        return <BlockMath key={index} math={part.slice(2, -2)} />;
      }

      if (part.startsWith("$") && part.endsWith("$")) {
        return <InlineMath key={index} math={part.slice(1, -1)} />;
      }

      return <span key={index}>{part}</span>;
    });
  }, []);

  return (
    <div className="question-html space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">Q</span>
        Question
      </div>
      <h3 className="text-xl font-semibold leading-snug">{renderMathText(question.question)}</h3>
      {question.answer && (
        <div className="mt-5 border-t border-border/60 pt-5">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">A</span>
            Solution
          </div>
          <div className="mt-3 space-y-3 text-sm leading-7 text-foreground/90">
            {renderMathText(question.answer)}
          </div>
        </div>
      )}
    </div>
  );
});
MathProblemRenderer.displayName = "MathProblemRenderer";

const ProgrammingQuestionRenderer = memo(({ question }: { question: Question }) => {
  const questionRef = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (questionRef.current && !questionRef.current.shadowRoot) {
      const shadow = questionRef.current.attachShadow({ mode: "open" });
      shadow.innerHTML = `<style>:host { font: inherit; color: inherit; }</style>${question.question}`;
    }
  }, [question.question]);

  useEffect(() => {
    if (answerRef.current && !answerRef.current.shadowRoot) {
      const shadow = answerRef.current.attachShadow({ mode: "open" });
      shadow.innerHTML = `<style>:host { font: inherit; color: inherit; }</style>${question.answer}`;
    }
  }, [question.answer]);

  return (
    <div className="question-html space-y-4">
      <div ref={questionRef} className="text-lg font-semibold leading-snug" />
      <div className="border-t border-border/60 pt-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">A</span>
          Answer
        </div>
        <div ref={answerRef} className="mt-3 space-y-3 text-sm leading-7 text-foreground/90" />
      </div>
      {question.code && (
        <div className="overflow-hidden rounded-2xl border border-border/60 shadow-sm">
          <SyntaxHighlighter
            language={question.language || "javascript"}
            style={atomOneDark}
            customStyle={{ margin: 0, padding: "1.25rem", fontSize: "0.875rem" }}
          >
            {question.code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
});
ProgrammingQuestionRenderer.displayName = "ProgrammingQuestionRenderer";

const GeneralQuestionRenderer = memo(({ question }: { question: Question }) => {
  return (
    <div className="question-html space-y-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">Q</span>
        Question
      </div>
      <h3 className="text-xl font-semibold leading-snug" dangerouslySetInnerHTML={{ __html: question.question }} />
      <div className="border-t border-border/60 pt-5">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-600 dark:text-emerald-400">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/10">A</span>
          Answer
        </div>
        <div className="mt-3 space-y-3 text-sm leading-7 text-foreground/90" dangerouslySetInnerHTML={{ __html: question.answer }} />
      </div>
    </div>
  );
});
GeneralQuestionRenderer.displayName = "GeneralQuestionRenderer";

const Chapter = () => {
  const { gradeId, chapterId } = useParams();
  const [contentFilter, setContentFilter] = useState("all");
  const [groupFilter, setGroupFilter] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { searchValue, debouncedSearchValue, setSearchValue } = useDebouncedSearch();
  const chapterUrl = gradeId && chapterId ? API_ENDPOINTS.CHAPTER_DATA(gradeId, chapterId) : null;
  const { data: chapterData, loading, error } = useDataFetch<Chapters>(chapterUrl);

  const breadcrumbs = useMemo(
    () => [
      { label: "Home", to: "/" },
      { label: `Grade ${gradeId}`, to: `/grade/${gradeId}` },
      { label: chapterData?.name || `Chapter ${chapterId}` },
    ],
    [chapterData?.name, chapterId, gradeId],
  );

  const filteredGroups = useMemo(() => {
    if (!chapterData) return [];
    return filterQuestions(chapterData.questions, debouncedSearchValue, contentFilter, groupFilter);
  }, [chapterData, debouncedSearchValue, contentFilter, groupFilter]);

  const clearFilters = useCallback(() => {
    setGroupFilter("all");
    setContentFilter("all");
    setSearchValue("");
  }, [setSearchValue]);

  const handleScrollToTop = useCallback(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const renderContent = (question: Question) => {
    switch (question.content_type) {
      case "text":
        return question.question && <GeneralQuestionRenderer question={question} />;
      case "table":
        return question.table_data && <TableRenderer data={question} />;
      case "equation":
        return question.equation && <EquationRenderer equation={question.equation} />;
      case "math_problem":
        return <MathProblemRenderer question={question} />;
      case "programming":
        return <ProgrammingQuestionRenderer question={question} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar breadcrumbs={breadcrumbs} />
        <div className="flex items-center justify-center px-4 py-24">
          <div className="rounded-[2rem] border border-border/60 bg-card/80 px-8 py-10 text-center shadow-xl backdrop-blur">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-lg font-medium">Loading chapter...</p>
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
              <BookOpen className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-semibold">Error loading chapter</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{error}</p>
            <Button asChild className="mt-6 rounded-full">
              <Link to={`/grade/${gradeId}`}>Back to grade</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalQuestions = chapterData?.questions.reduce((total, group) => total + group.questions.length, 0) || 0;
  const hasActiveFilters = groupFilter !== "all" || contentFilter !== "all" || searchValue.trim().length > 0;

  return (
    <div className="min-h-screen pb-16">
      <Navbar breadcrumbs={breadcrumbs} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-[2rem] border border-border/60 bg-card/75 p-5 shadow-sm backdrop-blur sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Layers3 className="h-3.5 w-3.5" />
                Chapter reading mode
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{chapterData?.name || `Chapter ${chapterId}`}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
                Search across answers, switch by question group, and keep bookmarks close while you study.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Suggested: start with text questions
                </span>
                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Suggested: filter to programming answers
                </span>
                <span className="inline-flex items-center rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                  Suggested: bookmark hard questions
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[320px]">
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Groups</div>
                <div className="mt-1 text-lg font-semibold">{chapterData?.questions.length || 0}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Questions</div>
                <div className="mt-1 text-lg font-semibold">{totalQuestions}</div>
              </div>
              <div className="rounded-2xl border border-border/60 bg-background/80 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Bookmarks</div>
                <div className="mt-1 text-lg font-semibold">Local</div>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-6">
          <section className="relative z-20 rounded-[1.75rem] border border-border/60 bg-card/90 p-3 shadow-sm backdrop-blur sm:p-4 lg:sticky lg:top-20">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search questions or answers..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="h-11 rounded-full pl-10"
                />
              </div>

              <div className="flex items-center gap-2 lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-11 rounded-full px-4"
                  onClick={() => setMobileFiltersOpen((open) => !open)}
                  aria-expanded={mobileFiltersOpen}
                  aria-controls="mobile-filters-panel"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>

              <div className="hidden grid gap-3 sm:grid-cols-2 lg:grid">
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  aria-label="Filter by question group"
                  className="h-11 w-full rounded-full border border-border/60 bg-background px-4 text-sm outline-none transition-colors focus:border-primary/40"
                >
                  <option value="all">All question groups</option>
                  {chapterData?.questions.map((group) => (
                    <option key={group.question_group} value={group.question_group}>
                      {group.question_group}
                    </option>
                  ))}
                </select>

                <select
                  value={contentFilter}
                  onChange={(e) => setContentFilter(e.target.value)}
                  aria-label="Filter by content type"
                  className="h-11 w-full rounded-full border border-border/60 bg-background px-4 text-sm outline-none transition-colors focus:border-primary/40"
                >
                  <option value="all">All content types</option>
                  <option value="text">Text</option>
                  <option value="table">Tables</option>
                  <option value="equation">Equations</option>
                  <option value="math_problem">Math problems</option>
                  <option value="programming">Programming</option>
                </select>
              </div>
            </div>

            <div
              id="mobile-filters-panel"
              className={`${mobileFiltersOpen ? "mt-3" : "hidden"} lg:hidden`}
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={groupFilter}
                  onChange={(e) => setGroupFilter(e.target.value)}
                  aria-label="Filter by question group"
                  className="h-11 w-full rounded-full border border-border/60 bg-background px-4 text-sm outline-none transition-colors focus:border-primary/40"
                >
                  <option value="all">All question groups</option>
                  {chapterData?.questions.map((group) => (
                    <option key={group.question_group} value={group.question_group}>
                      {group.question_group}
                    </option>
                  ))}
                </select>

                <select
                  value={contentFilter}
                  onChange={(e) => setContentFilter(e.target.value)}
                  aria-label="Filter by content type"
                  className="h-11 w-full rounded-full border border-border/60 bg-background px-4 text-sm outline-none transition-colors focus:border-primary/40"
                >
                  <option value="all">All content types</option>
                  <option value="text">Text</option>
                  <option value="table">Tables</option>
                  <option value="equation">Equations</option>
                  <option value="math_problem">Math problems</option>
                  <option value="programming">Programming</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex snap-x gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mt-4">
              <Button variant={groupFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setGroupFilter("all")} className="shrink-0 rounded-full">
                All groups
              </Button>
              {chapterData?.questions.map((group) => (
                <Button
                  key={group.question_group}
                  variant={groupFilter === group.question_group ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGroupFilter(group.question_group)}
                  className="shrink-0 rounded-full"
                >
                  {group.question_group}
                </Button>
              ))}
            </div>
          </section>

          {hasActiveFilters && (
            <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
              <Button onClick={clearFilters} className="rounded-full shadow-xl shadow-primary/20" size="lg">
                <Filter className="h-4 w-4" />
                Clear all filters
              </Button>
            </div>
          )}

          <section className="space-y-8 pt-2">
            {filteredGroups.map((group) => (
              <div key={group.question_group} className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight">{group.question_group}</h2>
                  <p className="text-sm text-muted-foreground">{group.questions.length} question{group.questions.length !== 1 ? "s" : ""}</p>
                </div>

                <div className="space-y-4">
                  {group.questions.map((question) => (
                    <QuestionCard
                      key={`${group.question_group}-${question.id}`}
                      question={question}
                      groupName={group.question_group}
                      renderContent={renderContent}
                      gradeId={gradeId}
                      chapterId={chapterId}
                      chapterName={chapterData?.name}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>

          {filteredGroups.length === 0 && (
            <div className="rounded-[2rem] border border-dashed border-border/60 bg-card/60 px-6 py-16 text-center">
              <Search className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
              <p className="text-lg font-semibold">No questions found</p>
              <p className="mt-2 text-sm text-muted-foreground">Try clearing the filters or using a different search phrase.</p>
            </div>
          )}
        </div>
      </main>

      {showScrollTop && (
        <Button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-xl shadow-primary/20"
          size="sm"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default Chapter;