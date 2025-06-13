import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, BookOpen, FileText, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import type { Chapters } from "@/lib/types";

const gradeData = {
  9: {
    name: "Grade 9",
    subjects: ["Computer Science"],
  },
  10: {
    name: "Grade 10",
    subjects: ["Computer Science"],
  },
};

const Grade = () => {
  const { gradeId } = useParams();
  const [chapterIds, setChapterIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const numericGradeId = Number(gradeId);
  const currentGrade =
    numericGradeId in gradeData
      ? gradeData[numericGradeId as keyof typeof gradeData]
      : undefined;

  const [chapters, setChapters] = useState<Record<string, Chapters[]>>({});

  const getTotalQuestions = (chapter: Chapters) => {
    return chapter.questions.reduce(
      (total, group) => total + group.questions.length,
      0
    );
  };

  useEffect(() => {
    const fetchChapters = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/data/${gradeId}/index.json`);
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
        const chapterPromises = chapterIds.map((id) =>
          fetch(`/data/${gradeId}/${id}.json`).then((res) => {
            if (!res.ok) throw new Error("Failed to fetch chapter");
            return res.json();
          })
        );
        const chapterData = await Promise.all(chapterPromises);

        if (currentGrade && currentGrade.subjects.length > 0) {
          setChapters({
            [currentGrade.subjects[0]]: chapterData,
          });
        }
      } catch (err) {
        console.error("Error loading chapter list for", gradeId, err);
        setError("Failed to load chapters. Please try again later.");
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">
            Loading content...
          </p>
        </div>
      </div>
    );
  }

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
            Error loading content
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Grades</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {currentGrade?.name}
                </h1>
                <p className="text-sm text-gray-600">
                  Choose a subject to explore chapters
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Subjects</span>
                </CardTitle>
                <CardDescription>
                  Available subjects for {currentGrade?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentGrade?.subjects.map((subject) => (
                    <Button
                      key={subject}
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to={`#`}>{subject}</Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-8">
            {Object.entries(chapters).map(([subject, subjectChapters]) => (
              <div key={subject} id={subject.toLowerCase()}>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-blue-600 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {subject}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subjectChapters.map((chapter) => (
                    <Link
                      key={chapter.chapter_no}
                      to={`/grade/${gradeId}/${chapter.chapter_no}`}
                    >
                      <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                        <CardHeader>
                          <CardDescription className="font-medium">
                            Chapter {chapter.chapter_no}
                          </CardDescription>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                              {chapter.name}
                            </CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <FileText className="h-4 w-4" />
                              <span>
                                {getTotalQuestions(chapter)} Questions
                              </span>
                            </div>
                          </div>
                          <Button className="w-full mt-4" variant="outline">
                            View QAs
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Grade;
