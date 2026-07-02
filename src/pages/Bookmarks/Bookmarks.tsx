import { useState, useMemo, memo, useCallback, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Trash2, Bookmark, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Navbar } from "@/components/Navbar";
import type { Question } from "@/lib/types";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

// Reuse high-aesthetic renderers
const TableRenderer = memo(({ data }: { data: Question }) => {
  return (
    <div className="overflow-x-auto mt-4 rounded-xl border border-border/60 bg-muted/20">
      <div className="p-4 border-b border-border/40">
        <h3
          className="font-bold text-primary text-lg"
          dangerouslySetInnerHTML={{ __html: data.question }}
        />
      </div>
      <div className="p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Answer</h4>
        <div
          className="space-y-3 text-foreground/80 text-sm leading-relaxed mb-4"
          dangerouslySetInnerHTML={{ __html: data.answer }}
        />
        <table className="min-w-full divide-y divide-border/40 border border-collapse text-sm">
          <thead className="bg-muted/40">
            <tr>
              {data.table_data?.headers.map((header, index) => (
                <th key={index} className="px-4 py-2.5 text-left font-semibold text-foreground/90 border border-border/40">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 bg-card">
            {data.table_data?.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-muted/10 transition-colors">
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 border border-border/40"
                    dangerouslySetInnerHTML={{ __html: cell }}
                  ></td>
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
    <div className="bg-muted/40 p-5 rounded-xl font-mono text-center my-4 border border-border/30 shadow-xs">
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
      } else if (part.startsWith("$") && part.endsWith("$")) {
        return <InlineMath key={index} math={part.slice(1, -1)} />;
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  }, []);

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-primary text-lg leading-snug">
        Q. {renderMathText(question.question)}
      </h3>
      {question.answer && (
        <div className="mt-4 pt-4 border-t border-border/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Solution</h4>
          <div className="text-foreground/80 text-sm leading-relaxed space-y-3">
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
      shadow.innerHTML = `<style>:host { font-family: inherit; font-size: 1.125rem; font-weight: 700; color: var(--color-primary); }</style>${question.question}`;
    }
  }, [question.question]);

  useEffect(() => {
    if (answerRef.current && !answerRef.current.shadowRoot) {
      const shadow = answerRef.current.attachShadow({ mode: "open" });
      shadow.innerHTML = `<style>:host { font-family: inherit; font-size: 0.875rem; line-height: 1.625; color: var(--color-foreground); opacity: 0.85; }</style>${question.answer}`;
    }
  }, [question.answer]);

  return (
    <div className="space-y-4">
      <div ref={questionRef} className="font-bold text-primary text-lg" />
      <div className="mt-4 pt-4 border-t border-border/40">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Answer</h4>
        <div ref={answerRef} className="space-y-3" />
      </div>
      {question.code && (
        <div className="rounded-xl overflow-hidden my-4 border border-border/40 shadow-sm">
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
    <div className="space-y-4">
      <h3 className="font-bold text-primary text-lg leading-snug">
        Q. <span dangerouslySetInnerHTML={{ __html: question.question }} />
      </h3>
      <div className="mt-4 pt-4 border-t border-border/40">
        <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">Answer</h4>
        <div
          className="text-foreground/80 text-sm leading-relaxed space-y-3"
          dangerouslySetInnerHTML={{ __html: question.answer }}
        />
      </div>
    </div>
  );
});
GeneralQuestionRenderer.displayName = "GeneralQuestionRenderer";

export default function Bookmarks() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const [search, setSearch] = useState("");

  const filteredBookmarks = useMemo(() => {
    if (!search.trim()) return bookmarks;
    const query = search.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.question.question.toLowerCase().includes(query) ||
        b.question.answer?.toLowerCase().includes(query) ||
        b.chapterName.toLowerCase().includes(query) ||
        b.groupName.toLowerCase().includes(query)
    );
  }, [bookmarks, search]);

  const renderContent = (q: Question) => {
    switch (q.content_type) {
      case "text":
        return q.question && <GeneralQuestionRenderer question={q} />;
      case "table":
        return q.table_data && <TableRenderer data={q} />;
      case "equation":
        return q.equation && <EquationRenderer equation={q.equation} />;
      case "math_problem":
        return <MathProblemRenderer question={q} />;
      case "programming":
        return <ProgrammingQuestionRenderer question={q} />;
      default:
        return null;
    }
  };

  const breadcrumbs = useMemo(() => [{ label: "Saved QAs" }], []);

  return (
    <div className="min-h-screen bg-linear-to-b from-background to-muted/20 pb-16">
      <Navbar breadcrumbs={breadcrumbs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text">
              My Saved Questions
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review and study questions you have marked as important
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-full shadow-xs hover:shadow-sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Grades
            </Button>
          </Link>
        </div>

        {/* Search */}
        {bookmarks.length > 0 && (
          <div className="mb-8 relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search saved questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 rounded-full h-10 border-border/60 focus:border-primary focus:ring-primary/20"
            />
          </div>
        )}

        {/* List of bookmarks */}
        {filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredBookmarks.map((bookmark) => (
              <Card
                key={`${bookmark.gradeId}-${bookmark.chapterId}-${bookmark.question.id}-${bookmark.groupName}`}
                className="relative overflow-hidden group shadow-xs hover:shadow-md border-border/50 hover:border-primary/30 transition-all duration-300 rounded-2xl"
              >
                {/* Visual Accent border */}
                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-primary to-indigo-500" />
                
                {/* Header info badge */}
                <div className="px-6 pt-5 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-primary/10 text-primary px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Grade {bookmark.gradeId}
                    </span>
                    <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-full max-w-[180px] truncate">
                      {bookmark.chapterName}
                    </span>
                    <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-full max-w-[150px] truncate">
                      {bookmark.groupName}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeBookmark(
                        bookmark.gradeId,
                        bookmark.chapterId,
                        bookmark.question.id,
                        bookmark.groupName
                      )
                    }
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    title="Remove Bookmark"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="px-6 py-4">
                  {renderContent(bookmark.question)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border/60 rounded-3xl bg-card/50 glass max-w-xl mx-auto">
            <div className="bg-primary/10 text-primary p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 shadow-xs">
              {bookmarks.length === 0 ? (
                <Bookmark className="h-6 w-6" />
              ) : (
                <Search className="h-6 w-6" />
              )}
            </div>
            <h3 className="text-xl font-bold text-foreground">
              {bookmarks.length === 0 ? "No Saved Questions Yet" : "No Matches Found"}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              {bookmarks.length === 0
                ? "Bookmark questions in chapters to save them here for easy reference and review anytime."
                : "No saved questions matched your search query. Try adjusting your search keywords."}
            </p>
            {bookmarks.length === 0 && (
              <Link to="/">
                <Button className="mt-6 rounded-full px-6 shadow-sm hover:shadow-md">
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Browse Chapters
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
