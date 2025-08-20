import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { AVAILABLE_GRADES } from "@/lib/constants";

function Home() {
  return (
    <>
      {" "}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">QA</h1>
                  <p className="text-sm text-gray-600">
                    Question & Answer Platform
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}

        {/* Grade Selection */}
        <section className="pb-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Select Your Grade Level
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {AVAILABLE_GRADES.map((grade) => (
                <Link key={grade.id} to={`/grade/${grade.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                    <CardHeader className="text-center pb-2">
                      <div
                        className={`w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
                      >
                        <span className="text-2xl font-bold text-white">
                          {grade.id}
                        </span>
                      </div>
                      <CardTitle className="text-lg">{grade.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center pt-0">
                      <Button className="w-full mt-4" variant="outline">
                        Explore Grade {grade.id}
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;
