import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, Tag } from "lucide-react";
import { researches } from "@/lib/data";

export function generateStaticParams() {
  return researches.map((research) => ({
    study: research.id,
  }));
}

export default async function ResearchDetailPage({
  params,
}: {
  params: Promise<{ study: string }>;
}) {
  const { study: studyId } = await params;
  const research = researches.find((r) => r.id === studyId);

  if (!research) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/research"
          className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к исследованиям
        </Link>

        <div className="mb-8">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full mb-4">
            {research.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 leading-tight">
            {research.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-2">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-gray-400" />
              {research.authors.join(", ")}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
              {research.date}
            </div>
            <div className="flex items-center">
              <Tag className="h-4 w-4 mr-2 text-gray-400" />
              {research.category}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10">
          <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
            {research.summary.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
