import Link from "next/link";
import { FileText, Users, Calendar } from "lucide-react";
import { researches } from "@/lib/data";

export default function ResearchPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            База исследований
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Научные исследования и аналитические работы в области промпт-инжиниринга
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researches.map((research) => (
            <Link key={research.id} href={`/research/${research.id}`}>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full">
                    {research.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {research.title}
                </h3>
                <p className="text-gray-600 text-sm flex-1 mb-4">
                  {research.summary}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    {research.authors.join(", ")}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {research.date}
                  </div>
                </div>
                <div className="flex items-center text-purple-600 text-sm font-medium mt-4">
                  <FileText className="h-4 w-4 mr-2" />
                  Подробнее
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
