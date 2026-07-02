import { memo, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  Copy,
  Check,
  Star,
  Code,
  Table,
  HelpCircle,
  Variable,
} from "lucide-react";
import { useBookmarks } from "@/hooks/useBookmarks";
import type { Question } from "@/lib/types";

interface QuestionCardProps {
  question: Question;
  groupName: string;
  renderContent: (q: Question) => React.ReactNode;
  gradeId?: string;
  chapterId?: string;
  chapterName?: string;
}

const QuestionCard = memo(
  ({
    question,
    groupName,
    renderContent,
    gradeId,
    chapterId,
    chapterName,
  }: QuestionCardProps) => {
    const { isBookmarked, toggleBookmark } = useBookmarks();
    const [copied, setCopied] = useState(false);

    const bookmarked =
      gradeId && chapterId
        ? isBookmarked(gradeId, chapterId, question.id, groupName)
        : false;

    const handleCopy = useCallback(async () => {
      const tempDiv = document.createElement("div");

      tempDiv.innerHTML = question.question || "";
      const qText = tempDiv.textContent || tempDiv.innerText || "";

      tempDiv.innerHTML = question.answer || "";
      const aText = tempDiv.textContent || tempDiv.innerText || "";

      const codeSection = question.code ? `\n\nCode:\n${question.code}` : "";
      const copyText = `Question:\n${qText}\n\nAnswer:\n${aText}${codeSection}`;

      try {
        await navigator.clipboard.writeText(copyText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }, [question]);

    const handleBookmarkToggle = useCallback(() => {
      if (gradeId && chapterId && chapterName) {
        toggleBookmark(gradeId, chapterId, chapterName, groupName, question);
      }
    }, [gradeId, chapterId, chapterName, groupName, question, toggleBookmark]);

    const getContentTypeMeta = () => {
      switch (question.content_type) {
        case "programming":
          return {
            label: "Programming",
            icon: Code,
            color:
              "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/50 dark:border-amber-900/40",
          };
        case "table":
          return {
            label: "Table Data",
            icon: Table,
            color:
              "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/50 dark:border-blue-900/40",
          };
        case "equation":
        case "math_problem":
          return {
            label: "Mathematical",
            icon: Variable,
            color:
              "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-900/40",
          };
        default:
          return {
            label: "General",
            icon: HelpCircle,
            color:
              "bg-slate-100 text-slate-800 dark:bg-slate-950/40 dark:text-slate-300 border-slate-200/50 dark:border-slate-900/40",
          };
      }
    };

    const meta = getContentTypeMeta();
    const MetaIcon = meta.icon;

    return (
      <Card
        key={`${groupName}-${question.id}`}
        className="group relative overflow-hidden rounded-3xl border-border/60 bg-card/95 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl"
      >
        <div className="absolute inset-y-0 left-0 w-1.5 bg-linear-to-b from-primary via-teal-500 to-emerald-400 opacity-80 transition-opacity group-hover:opacity-100" />

        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-5 py-4 sm:px-6">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Star className="h-3.5 w-3.5 fill-current" />
                Q #{question.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.color}`}>
                <MetaIcon className="h-3.5 w-3.5" />
                {meta.label}
              </span>
              <span className="truncate text-xs font-medium text-muted-foreground">
                {groupName}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                className="h-8 w-8 rounded-full text-muted-foreground transition-all duration-200 hover:bg-muted/80 hover:text-primary"
                title="Copy QA details"
                aria-label="Copy question and answer"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-500 animate-in zoom-in-50 duration-200" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>

              {gradeId && chapterId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBookmarkToggle}
                  className={`h-8 w-8 rounded-full transition-all duration-200 ${
                    bookmarked
                      ? "text-amber-500 bg-amber-500/10 hover:bg-amber-500/20"
                      : "text-muted-foreground hover:text-amber-500 hover:bg-muted/80"
                  }`}
                  title={bookmarked ? "Remove bookmark" : "Bookmark question"}
                    aria-label={bookmarked ? "Remove bookmark" : "Bookmark question"}
                >
                  {bookmarked ? (
                    <Star className="h-4 w-4 fill-current animate-in spin-in-12 duration-300" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

            <div className="px-5 py-5 sm:px-6">{renderContent(question)}</div>
        </CardContent>
      </Card>
    );
  }
);

QuestionCard.displayName = "QuestionCard";

export default QuestionCard;
