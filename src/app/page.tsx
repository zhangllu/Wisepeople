import Link from "next/link"
import { ROUTES, SITE_TAGLINE, SITE_DESCRIPTION, DIMENSION_LABELS } from "@/constants"
import { WisePersonGrid } from "@/components/wise-person/WisePersonGrid"
import { QuestionCard } from "@/components/question/QuestionCard"
import { BookListCard } from "@/components/book-list/BookListCard"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockWisePersons, mockBookLists } from "@/lib/stores/mock-data"
import { getAllQuestions, getBooksByQuestion, getMinimumBookList, getClassicsBooks } from "@/lib/data"

export default function HomePage() {
  const featuredWisePersons = mockWisePersons.slice(0, 6)
  const questions = getAllQuestions()
  const featuredQuestions = questions.slice(0, 4)
  const featuredBookLists = mockBookLists.slice(0, 3)
  const minBooks = getMinimumBookList()
  const classicsBooks = getClassicsBooks()

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <section className="text-center py-12 md:py-20">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
          {SITE_TAGLINE}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {SITE_DESCRIPTION}
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            href={ROUTES.wisePersons}
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground text-sm font-medium px-6 py-2.5 hover:bg-primary/90 transition-colors"
          >
            探索智者库
          </Link>
          <Link
            href={ROUTES.questions}
            className="inline-flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium px-6 py-2.5 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            从问题出发
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-12">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-primary">1197</p>
            <p className="text-xs text-muted-foreground">本著作</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">778</p>
            <p className="text-xs text-muted-foreground">位作者</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">50</p>
            <p className="text-xs text-muted-foreground">个主题方向</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-primary">10</p>
            <p className="text-xs text-muted-foreground">大问题</p>
          </div>
        </div>
      </section>

      {/* Featured Wise Persons */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">推荐智者</h2>
          <Link href={ROUTES.wisePersons} className="text-xs text-primary hover:underline">
            查看全部 →
          </Link>
        </div>
        <WisePersonGrid wisePersons={featuredWisePersons} />
      </section>

      {/* Questions */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">十大问题导览</h2>
          <Link href={ROUTES.questions} className="text-xs text-primary hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {featuredQuestions.map((q) => (
            <QuestionCard key={q.code} question={q} />
          ))}
        </div>
      </section>

      {/* Minimum Book List Preview */}
      {minBooks.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">最小限度书单</h2>
              <p className="text-xs text-muted-foreground mt-0.5">56 本通识教育核心书目</p>
            </div>
            <Link href={ROUTES.bookListDetail("minimum-56")} className="text-xs text-primary hover:underline">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {minBooks.slice(0, 8).map((b) => (
              <Card key={b.slug} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{b.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{b.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* 元典 Preview */}
      {classicsBooks.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold">元典：人类文明十三经</h2>
              <p className="text-xs text-muted-foreground mt-0.5">轴心时代四大文明的根本经典</p>
            </div>
            <Link href={ROUTES.topicDetail("0")} className="text-xs text-primary hover:underline">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {classicsBooks.slice(0, 8).map((b) => (
              <Card key={b.slug} className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-3">
                  <p className="text-sm font-medium truncate">{b.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{b.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Book Lists */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">精选书单</h2>
          <Link href={ROUTES.bookLists} className="text-xs text-primary hover:underline">
            查看全部 →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {featuredBookLists.map((bl) => (
            <BookListCard key={bl.id} bookList={bl} />
          ))}
        </div>
      </section>
    </div>
  )
}
