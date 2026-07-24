import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock, ArrowLeft } from "lucide-react";
import { knowledgeArticles } from "@/lib/data";

export function generateStaticParams() {
  return knowledgeArticles.map((article) => ({
    article: article.id,
  }));
}

export default async function KnowledgeArticlePage({
  params,
}: {
  params: Promise<{ article: string }>;
}) {
  const { article: articleId } = await params;
  const article = knowledgeArticles.find((a) => a.id === articleId);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/knowledge"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Назад к базе знаний
        </Link>

        <article>
          <div className="mb-8">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {article.readTime} мин чтения
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10">
            <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
              {article.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
