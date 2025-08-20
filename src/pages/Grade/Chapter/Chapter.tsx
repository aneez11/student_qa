import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import QuestionCard from "@/components/QuestionCard";
import type { Chapters, Question, TableData } from "@/lib/types";
import { ArrowLeft, Search, ArrowUp } from "lucide-react";
import { useEffect, useState, useMemo, useCallback, memo } from "react";
import { Link, useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";
import { useDataFetch } from "@/hooks/useDataFetch";
import { useDebouncedSearch } from "@/hooks/useDebounce";
import { API_ENDPOINTS, SCROLL_THRESHOLD } from "@/lib/constants";
import { filterQuestions, scrollToTop } from "@/lib/helpers";

const TableRenderer = memo(({ data }: { data: TableData }) => {
  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full border">
        <thead>
          <tr>
            {data.headers.map((header, index) => (
              <th key={index} className="border px-4 py-2 bg-gray-50">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="border px-4 py-2">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
TableRenderer.displayName = "TableRenderer";

const EquationRenderer = memo(({ equation }: { equation: string }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md font-mono text-center my-4">
      {equation}
    </div>
  );
});
EquationRenderer.displayName = "EquationRenderer";

const MathProblemRenderer = memo(
  ({ problem, solution }: { problem: string; solution: string }) => {
    const renderMathText = useCallback((text: string) => {
      // Split text into parts that contain LaTeX and parts that don't
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
      <>
        <h1 className="font-bold text-blue-800 text-xl">
          Q. {renderMathText(problem)}
        </h1>

        <div className="text-gray-700 space-y-3"></div>
        {solution && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <h4 className="font-medium text-blue-700 mb-2">Solution</h4>
            <div className="text-gray-700 space-y-3">
              {renderMathText(solution)}
            </div>
          </div>
        )}
      </>
    );
  }
);
MathProblemRenderer.displayName = "MathProblemRenderer";

const ProgrammingQuestionRenderer = memo(
  ({
    question,
    answer,
    language,
    code,
  }: {
    question: string;
    language?: string;
    answer?: string;
    code?: string;
  }) => {
    const formatTextWithBreaks = useCallback(
      (text: string): { __html: string } => {
        return {
          __html: text
            ?.split("\n")
            .map((line, index) =>
              line ? `<span key=${index}>${line}<br /></span>` : "<br />"
            )
            .join(""),
        };
      },
      []
    );

    return (
      <>
        <h1
          className="font-bold text-blue-800 text-xl"
          dangerouslySetInnerHTML={formatTextWithBreaks(question)}
        />
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-2 text-green-700">Answer</h4>
          <div className=" space-y-3">{answer}</div>
        </div>
        <div className="rounded-md my-4">
          {code && (
            <SyntaxHighlighter
              language={language || "javascript"}
              style={atomOneDark}
              className="rounded-md"
            >
              {code}
            </SyntaxHighlighter>
          )}
        </div>
      </>
    );
  }
);
ProgrammingQuestionRenderer.displayName = "ProgrammingQuestionRenderer";

const GeneralQuestionRenderer = memo(
  ({ question, answer }: { question: string; answer: string }) => {
    return (
      <>
        <h1 className="font-bold text-blue-800 text-xl">Q. {question}</h1>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium mb-2 text-green-700">Answer</h4>
          <div className=" space-y-3">{answer}</div>
        </div>
      </>
    );
  }
);
GeneralQuestionRenderer.displayName = "GeneralQuestionRenderer";

const Chapter = () => {
  const { gradeId, chapterId } = useParams();
  const [contentFilter, setContentFilter] = useState<string>("all");
  const [groupFilter, setGroupFilter] = useState<string>("all");
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Use debounced search for better performance
  const { searchValue, debouncedSearchValue, setSearchValue } =
    useDebouncedSearch();

  // Use the optimized data fetching hook
  const chapterUrl =
    gradeId && chapterId
      ? API_ENDPOINTS.CHAPTER_DATA(gradeId, chapterId)
      : null;
  const {
    data: chapterData,
    loading,
    error,
  } = useDataFetch<Chapters>(chapterUrl);

  // Memoized filtered groups using helper function
  const filteredGroups = useMemo(() => {
    if (!chapterData) return [];
    return filterQuestions(
      chapterData.questions,
      debouncedSearchValue,
      contentFilter,
      groupFilter
    );
  }, [chapterData, debouncedSearchValue, contentFilter, groupFilter]);

  // Memoized clear filters function
  const clearFilters = useCallback(() => {
    setGroupFilter("all");
    setContentFilter("all");
    setSearchValue("");
  }, [setSearchValue]);

  // Memoized scroll to top function using helper
  const handleScrollToTop = useCallback(() => {
    scrollToTop();
  }, []);

  // Handle scroll events to show/hide the scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > SCROLL_THRESHOLD);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg font-medium text-gray-700">
            Loading chapter...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error loading chapter
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button asChild>
            <Link to={`/grade/${gradeId}`}>Back to Grade</Link>
          </Button>
        </div>
      </div>
    );
  }

  const renderContent = (q: Question) => {
    switch (q.content_type) {
      case "text":
        return (
          q.question && (
            <GeneralQuestionRenderer question={q.question} answer={q.answer} />
          )
        );
      case "table":
        return q.table_data && <TableRenderer data={q.table_data} />;
      case "equation":
        return q.equation && <EquationRenderer equation={q.equation} />;
      case "math_problem":
        return (
          <MathProblemRenderer
            problem={q.problem || q.question}
            solution={q.answer}
          />
        );
      case "programming":
        return (
          <ProgrammingQuestionRenderer
            question={q.question}
            answer={q.answer}
            language={q.language}
            code={q.code}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-wrap">
              <Link to={`/grade/${gradeId}`}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Grade {gradeId}</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {chapterData?.name || `Chapter ${chapterId}`}
                </h1>
                <p className="text-sm text-gray-600">
                  {chapterData?.questions.reduce(
                    (acc, group) => acc + group.questions.length,
                    0
                  )}{" "}
                  questions available
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search questions or answers..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Question Groups</option>
                {chapterData?.questions.map((group) => (
                  <option
                    key={group.question_group}
                    value={group.question_group}
                  >
                    {group.question_group}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={contentFilter}
                onChange={(e) => setContentFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">All Content Types</option>
                <option value="text">Text Only</option>
                <option value="table">Tables</option>
                <option value="equation">Equations</option>
                <option value="math_problem">Math Problems</option>
                <option value="programming">Programming</option>
              </select>
            </div>
          </div>

          {/* Quick Filter Buttons */}
          {chapterData && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={groupFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setGroupFilter("all")}
                className="text-xs"
              >
                All Groups (
                {chapterData.questions.reduce(
                  (acc, group) => acc + group.questions.length,
                  0
                )}
                )
              </Button>
              {chapterData.questions.map((group) => (
                <Button
                  key={group.question_group}
                  variant={
                    groupFilter === group.question_group ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setGroupFilter(group.question_group)}
                  className="text-xs"
                >
                  {group.question_group} ({group.questions.length})
                </Button>
              ))}
            </div>
          )}

          {/* Filter Status */}
          {(groupFilter !== "all" ||
            contentFilter !== "all" ||
            searchValue) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-blue-800">
                  <span className="font-medium">Active filters:</span>
                  {groupFilter !== "all" && (
                    <span className="ml-2 bg-blue-100 px-2 py-1 rounded">
                      Group: {groupFilter}
                    </span>
                  )}
                  {contentFilter !== "all" && (
                    <span className="ml-2 bg-blue-100 px-2 py-1 rounded">
                      Type: {contentFilter}
                    </span>
                  )}
                  {searchValue && (
                    <span className="ml-2 bg-blue-100 px-2 py-1 rounded">
                      Search: "{searchValue}"
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <div key={group.question_group} className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {group.question_group}
                </h2>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {group.questions.length} question
                  {group.questions.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-4">
                {group.questions.map((q) => (
                  <QuestionCard
                    key={`${group.question_group}-${q.id}`}
                    question={q}
                    groupName={group.question_group}
                    renderContent={renderContent}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No questions found</p>
              <p className="text-sm">Try adjusting your search criteria</p>
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white z-50 transition-all duration-300 ease-in-out"
          size="sm"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default Chapter;
