import Link from "next/link"
import { ROUTES, SITE_TAGLINE, SITE_DESCRIPTION, DIMENSION_LABELS } from "@/constants"
import { WisePersonGrid } from "@/components/wise-person/WisePersonGrid"
import { QuestionCard } from "@/components/question/QuestionCard"
import { BookListCard } from "@/components/book-list/BookListCard"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FadeIn } from "@/components/shared/FadeIn"
import { CountUp } from "@/components/shared/CountUp"
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
      <section className="relative text-center py-16 md:py-28 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent" />
          <svg className="absolute inset-0 w-full h-full opacity-[0.025]">
            <pattern id="hero-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" className="fill-primary" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hero-dots)" />
          </svg>
        </div>

        <div className="relative">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            {SITE_TAGLINE}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {SITE_DESCRIPTION}
          </p>

          {/* Quote */}
          <blockquote className="mt-8 text-xs md:text-sm text-muted-foreground/50 italic max-w-md mx-auto leading-relaxed border-l-2 border-accent/30 pl-4 text-left">
            "教育不是注满一桶水，而是点燃一把火。"
            <footer className="mt-1 text-xs not-italic text-muted-foreground/30">—— 威廉·巴特勒·叶芝</footer>
          </blockquote>

          <div className="flex items-center justify-center gap-3 mt-8">
            <Link
              href={ROUTES.wisePersons}
              className="inline-flex items-center justify-center rounded-md bg-accent text-accent-foreground text-sm font-medium px-6 py-2.5 transition-all duration-200 hover:bg-accent/90 hover:-translate-y-0.5 hover:shadow-md"
            >
              探索智者库
            </Link>
            <Link
              href={ROUTES.questions}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background text-sm font-medium px-6 py-2.5 transition-all duration-200 hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5"
            >
              从问题出发
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <FadeIn>
        <section className="mb-12">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-accent"><CountUp end={1197} /></p>
              <p className="text-xs text-muted-foreground">本著作</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent"><CountUp end={778} /></p>
              <p className="text-xs text-muted-foreground">位作者</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent"><CountUp end={50} /></p>
              <p className="text-xs text-muted-foreground">个主题方向</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent"><CountUp end={10} /></p>
              <p className="text-xs text-muted-foreground">大问题</p>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Featured Wise Persons */}
      <FadeIn delay={100}>
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">推荐智者</h2>
            <Link href={ROUTES.wisePersons} className="text-xs text-accent hover:underline">
              查看全部 →
            </Link>
          </div>
          <WisePersonGrid wisePersons={featuredWisePersons} />
        </section>
      </FadeIn>

      {/* Questions */}
      <FadeIn delay={200}>
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">十大问题导览</h2>
            <Link href={ROUTES.questions} className="text-xs text-accent hover:underline">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredQuestions.map((q) => (
              <QuestionCard key={q.code} question={q} />
            ))}
          </div>
        </section>
      </FadeIn>

      {/* Minimum Book List Preview */}
      {minBooks.length > 0 && (
        <FadeIn delay={300}>
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">最小限度书单</h2>
                <p className="text-xs text-muted-foreground mt-0.5">56 本通识教育核心书目</p>
              </div>
              <Link href={ROUTES.bookListDetail("minimum-56")} className="text-xs text-accent hover:underline">
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {minBooks.slice(0, 8).map((b) => (
                <Card key={b.slug} className="transition-all duration-300 hover:-translate-y-0.5">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{b.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* 元典 Preview */}
      {classicsBooks.length > 0 && (
        <FadeIn delay={400}>
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">元典：人类文明十三经</h2>
                <p className="text-xs text-muted-foreground mt-0.5">轴心时代四大文明的根本经典</p>
              </div>
              <Link href={ROUTES.topicDetail("0")} className="text-xs text-accent hover:underline">
                查看全部 →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {classicsBooks.slice(0, 8).map((b) => (
                <Card key={b.slug} className="transition-all duration-300 hover:-translate-y-0.5">
                  <CardContent className="p-3">
                    <p className="text-sm font-medium truncate">{b.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{b.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </FadeIn>
      )}

      {/* Book Lists */}
      <FadeIn delay={500}>
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">精选书单</h2>
            <Link href={ROUTES.bookLists} className="text-xs text-accent hover:underline">
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {featuredBookLists.map((bl) => (
              <BookListCard key={bl.id} bookList={bl} />
            ))}
          </div>
        </section>
      </FadeIn>
    </div>
  )
}
