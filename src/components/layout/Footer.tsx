import Link from "next/link"
import { SITE_NAME } from "@/constants"

export function Footer() {
  return (
    <footer className="border-t mt-16">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold mb-3">{SITE_NAME}</h3>
            <p className="text-xs text-muted-foreground">
              为终身学习者打造的通识阅读地图。<br />
              助力你生发出自己独特的知识结构。
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">探索</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li><Link href="/wise-persons" className="hover:text-foreground transition-colors">智者库</Link></li>
              <li><Link href="/questions" className="hover:text-foreground transition-colors">十大问题</Link></li>
              <li><Link href="/book-lists" className="hover:text-foreground transition-colors">书单推荐</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-3">关于</h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>数据来源：《聪明的阅读者》</li>
              <li>AI 生成内容仅供参考</li>
              <li>&copy; {new Date().getFullYear()} {SITE_NAME}</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
