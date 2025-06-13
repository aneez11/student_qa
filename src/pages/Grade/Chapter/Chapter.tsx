import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Chapters, Question, QuestionGroup, TableData } from "@/lib/types";
import { ArrowLeft, Search, Code, Calculator } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import "katex/dist/katex.min.css";
import { InlineMath, BlockMath } from "react-katex";

const TableRenderer = ({ data }: { data: TableData }) => {
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
};

const EquationRenderer = ({ equation }: { equation: string }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-md font-mono text-center my-4">
      {equation}
    </div>
  );
};

const MathProblemRenderer = ({
  problem,
  solution,
}: {
  problem: string;
  solution: string;
}) => {
  const renderMathText = (text: string) => {
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
  };

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
};

const ProgrammingQuestionRenderer = ({
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
  return (
    <>
      <h1 className="font-bold text-blue-800 text-xl">Q. {question}</h1>
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
};

const GeneralQuestionRenderer = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  return (
    <>
      <h1 className="font-bold text-blue-800 text-xl">Q. {question}</h1>
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="font-medium mb-2 text-green-700">Answer</h4>
        <div className=" space-y-3">{answer}</div>
      </div>
    </>
  );
};

const Chapter = () => {
  const { gradeId, chapterId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [chapterData, setChapterData] = useState<Chapters | null>(null);
  const [filteredGroups, setFilteredGroups] = useState<QuestionGroup[]>([]);
  const [contentFilter, setContentFilter] = useState<string>("all");

  useEffect(() => {
    const fetchChapters = async (gradeId: string, chapterId: string) => {
      try {
        const response = await fetch(`/data/${gradeId}/${chapterId}.json`);
        const data: Chapters = await response.json();
        setChapterData(data);
        setFilteredGroups(data.questions);
      } catch (err) {
        console.error("Error loading chapter list for", gradeId, err);
      }
    };

    if (gradeId && chapterId) {
      fetchChapters(gradeId, chapterId);
    }
  }, [gradeId, chapterId]);

  useEffect(() => {
    if (chapterData) {
      const filtered = chapterData.questions
        .map((group) => ({
          ...group,
          questions: group.questions.filter((q) => {
            // Content type filter
            const matchesContentType =
              contentFilter === "all" || q.content_type === contentFilter;

            // Search filter
            const matchesSearch =
              q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
              q.answer.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesContentType && matchesSearch;
          }),
        }))
        .filter((group) => group.questions.length > 0);

      setFilteredGroups(filtered);
    }
  }, [searchQuery, chapterData, contentFilter]);

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
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
        </div>

        {/* Questions List */}
        <div className="space-y-8">
          {filteredGroups.map((group) => (
            <div key={group.question_group} className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {group.question_group}
              </h2>
              <div className="space-y-4">
                {group.questions.map((q) => (
                  <Card
                    key={`${group.question_group}-${q.id}`}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent>
                      <div className="mb-4">{renderContent(q)}</div>
                    </CardContent>
                  </Card>
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
    </div>
  );
};

export default Chapter;
