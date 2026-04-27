import Link from "next/link"
import { BookListCard } from "@/components/book-list/BookListCard"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockBookLists } from "@/lib/stores/mock-data"
import { getAllQuestions, getBooksByQuestion, getMinimumBookList, getClassicsBooks } from "@/lib/data"
import { ROUTES, DIMENSION_LABELS } from "@/constants"

export default function BookListsPage() {
  const questions = getAllQuestions()
  const minBooks = getMinimumBookList()
  const classicsBooks = getClassicsBooks()

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">书单推荐</h1>
        <p className="text-sm text-muted-foreground">
          从精选书单开始您的阅读之旅
        </p>
      </div>

      {/* 最小限度书单 */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">最小限度书单</h2>
            <p className="text-xs text-muted-foreground mt-0.5">精选 56 本必读经典，覆盖天地人三大维度</p>
          </div>
          <Link
            href={ROUTES.bookListDetail("minimum-56")}
            className="text-xs text-primary hover:underline"
          >
            查看全部 {minBooks.length} 本 →
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

      {/* 元典 */}
      {classicsBooks.length > 0 && (
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">元典：人类文明十三经</h2>
              <p className="text-xs text-muted-foreground mt-0.5">轴心时代四大文明的根本经典</p>
            </div>
            <Link
              href={ROUTES.topicDetail("0")}
              className="text-xs text-primary hover:underline"
            >
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

      {/* 大问题主题书单 */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold mb-4">大问题主题书单</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {questions.map((q) => {
            const bookCount = getBooksByQuestion(q.number).length
            return (
              <Link key={q.code} href={ROUTES.bookListDetail(`q-${q.number}`)}>
                <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 h-full">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-mono text-muted-foreground">{q.code}</span>
                      <Badge variant="secondary" className="text-[10px]">
                        {DIMENSION_LABELS[q.dimension]}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{q.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{q.subtitle}</p>
                    <p className="text-xs text-primary/70 mt-2">{bookCount} 本相关著作</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 精选书单（原有 mock） */}
      {mockBookLists.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">精选书单</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockBookLists.map((bl) => (
              <BookListCard key={bl.id} bookList={bl} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
