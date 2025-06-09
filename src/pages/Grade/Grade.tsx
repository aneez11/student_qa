import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, BookOpen, FileText } from "lucide-react";
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
      }
    };

    fetchChapters();
  }, [gradeId]);

  useEffect(() => {
    const fetchChapters = async (gradeId: string) => {
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
      }
    };
    if (gradeId) {
      fetchChapters(gradeId);
    }
  }, [gradeId, currentGrade, chapterIds]);

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
