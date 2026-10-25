import type { Metadata } from "next"
import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  ExternalLink,
  HeartHandshake,
  PenLine,
  Quote,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react"
import { ROUTES } from "@/constants"

export const metadata: Metadata = {
  title: "吾与尔｜共读空间 - 智者网",
  description:
    "“鸣鹤在阴，其子和之；我有好爵，吾与尔靡之。”吾与尔共读空间是一个共同维护的阅读空间：带着真实的阅读进入现场，与智者对话，与伙伴切磋，在彼此回应中让思想逐渐丰厚。",
}

const DOC_LINKS = {
  intro: "https://hiym5dc96z.feishu.cn/wiki/NcdXwC9KhicTCskIm94c89M9nge?from=from_copylink",
  roles: "https://hiym5dc96z.feishu.cn/wiki/PELTwnvAWiHbrskUPvxcxuiMn3f?from=from_copylink",
  plan: "https://hiym5dc96z.feishu.cn/wiki/HZDEwtDwCiz9JHk4elwcmpvmnyh?from=from_copylink",
  session1: "https://hiym5dc96z.feishu.cn/wiki/J5MiwbJ50itv66kR6Scc07rfn3e?from=from_copylink",
  session2: "https://hiym5dc96z.feishu.cn/wiki/KL2swKY4Ai2obokn4XlcJ11Inte?from=from_copylink",
  review: "https://book.douban.com/review/10203264/",
  fromm: "https://cupblog.org/2013/02/14/lawrence-j-friedman-valentines-day-erich-fromm-and-the-art-of-loving/",
}

const sessions = [
  {
    title: "第一次",
    dates: "10.23 周五 09:30 / 10.25 周日 08:00",
    note: "第一场共读流程说明",
    href: DOC_LINKS.session1,
  },
  {
    title: "第二次",
    dates: "10.30 周五 09:30 / 11.1 周日 08:00",
    note: "《爱情哲学30讲》×《爱的艺术》对话",
    href: DOC_LINKS.session2,
  },
  {
    title: "第三次",
    dates: "时间待公布",
    note: "",
  },
]

const materials = [
  { title: "《爱的艺术》共读版（三次）总说明", href: DOC_LINKS.plan },
  { title: "第一场共读流程说明", href: DOC_LINKS.session1 },
  { title: "《爱情哲学30讲》×《爱的艺术》对话", href: DOC_LINKS.session2 },
  { title: "延伸阅读：一个人要走过多少路，才可以称他为男人？", href: DOC_LINKS.review },
  { title: "延伸阅读：弗洛姆与《爱的艺术》背后的爱情", href: DOC_LINKS.fromm },
]

const agreements = [
  {
    title: "支持沉浸式观察期",
    description: "新成员可以先观察和体验一个月。超过一个月未参与任何活动的成员，将被移出本群。",
  },
  {
    title: "支持自主退出",
    description: "如果参与一段时间后，发现空间的理念、节奏或参与方式与自己不匹配，可以随时退出。",
  },
  {
    title: "支持共同建设",
    description:
      "每个人都可以成为共读发起者，也可以认领单场主持。选书、阅读设计、问题准备和现场流程，都可以在实践中共同完善。",
  },
]

const nots = [
  "不是由带领者单向讲解、参与者负责吸收的课程",
  "不是以完成任务为目的的阅读打卡",
  "不是脱离文本的泛泛聊天，也不要求大家分享相同的感受",
  "不是辩论或观点竞赛，不以说服他人、展示知识或形成统一答案为目标",
]

const pastReads = [
  {
    title: "不存在真实的自我，如何在行动中成为自己",
    href: "https://mp.weixin.qq.com/s/QmMp_93ScT2UFLsrmlvMyQ",
  },
  {
    title: "转变不只是跳出旧生活，而是走过一段身份之间的路",
    href: "https://mp.weixin.qq.com/s/ygeGO88jYDZAOba_OPHUew",
  },
  {
    title: "不要等待人生突然改变：在小步行动中重塑自己",
    href: "https://mp.weixin.qq.com/s/HiS38OdPb-iB5DJB5z7_WQ",
  },
]

function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id?: string
  index: string
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border/70 py-12 md:py-16">
      <div className="grid gap-6 md:grid-cols-[190px_minmax(0,1fr)] md:gap-12">
        <div>
          <span className="font-mono text-[11px] tracking-widest text-accent/70">{index}</span>
          <h2 className="mt-2 font-heading text-lg font-semibold tracking-tight md:text-xl">
            {title}
          </h2>
          {intro && <p className="mt-2 text-xs leading-6 text-muted-foreground">{intro}</p>}
        </div>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  )
}

function ExternalItem({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-4 border-b border-border/60 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      <span>{title}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-accent/50 transition-colors group-hover:text-accent" />
    </a>
  )
}

export default function WuyuerPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4">
      {/* 页头：小 Logo 固定于左上角 */}
      <header className="flex flex-wrap items-center justify-between gap-4 pt-8">
        <div className="flex items-center gap-5">
          <Image
            src="/images/wuyuer-logo.svg"
            alt="吾与尔共读 Logo"
            width={128}
            height={128}
            className="h-32 w-32"
            priority
            unoptimized
          />
          <div>
            <p className="text-xs tracking-[0.3em] text-muted-foreground/60">
              WISEPEOPLE · READING SPACE
            </p>
            <p className="mt-1.5 font-heading text-2xl font-bold tracking-wide md:text-3xl">
              吾与尔共读空间
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              与智者对话、与伙伴切磋，在彼此回应中让思想和精神逐渐丰厚。
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-accent-foreground">
            <Sparkles className="h-3 w-3" />
            内测阶段 · 免费开放
          </span>
          <span className="hidden items-center gap-1.5 rounded-full border border-border px-3 py-1 text-muted-foreground sm:inline-flex">
            <CalendarDays className="h-3 w-3" />
            每周五、周日
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border/70 pb-14 pt-14 md:pb-20 md:pt-20">
        <p className="text-[11px] tracking-[0.3em] text-accent/70">《周易 · 中孚》</p>
        <h1 className="mt-5 max-w-3xl font-heading text-3xl font-semibold leading-[1.45] tracking-tight md:text-4xl md:leading-[1.4]">
          鸣鹤在阴，其子和之；
          <br />
          我有好爵，吾与尔靡之。
        </h1>
        <p className="mt-6 max-w-2xl text-sm leading-8 text-muted-foreground">
          我所读到的、所理解的、所珍视的思想，愿意带来与你共同研讨；你也带着自己的阅读和判断回应于我。共读不是一起完成一本书，而是与智者对话、与伙伴切磋，在彼此回应中让思想和精神逐渐丰厚。
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent/70" />
            周五 09:30 · 周日 08:00
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Video className="h-3.5 w-3.5 text-accent/70" />
            线上腾讯会议 · 约 2 小时
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a
            href="#join"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            了解如何加入
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="#current"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
          >
            查看当前共读
          </a>
        </div>
      </section>

      {/* 名字由来 */}
      <Section
        index="01"
        title="「吾与尔」从何而来"
        intro="名字出自《周易·中孚》，不只是分享美酒，更指向彼此切磋、共同研习。"
      >
        <div className="space-y-4 text-sm leading-8 text-muted-foreground">
          <p>
            其中的「好爵」，可以理解为孟子所说的「天爵」——仁义、忠信等内在的美好德性；「靡」则与「琢磨」相通，指彼此切磋、共同研习。
          </p>
          <p>
            「鸣鹤在阴，其子和之」呈现的是一种真实的回应：一个声音从幽微之处发出，另一个声音听见后与之相和。发出声音的可以是书的作者、文本中的智者，也可以是参与者自己；回应它的，则是远方的读者、当下的伙伴，以及另一个被触动的自己。
          </p>
          <p className="flex gap-3 border-l-2 border-accent/40 pl-4 text-foreground/80">
            <Quote className="mt-1 h-4 w-4 shrink-0 text-accent" />
            「尔」并不只是普通意义上的「你」——它可以是书背后的作者和智者，可以是共读中的伙伴，也可以是通过阅读重新遇见的自己。
          </p>
        </div>
      </Section>

      {/* 提供什么 */}
      <Section index="02" title="共读空间提供什么">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent">
              <BookOpen className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">个人与阅读的相遇</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              在相对稳定、被支持的环境中进入一本书或一个主题，让阅读成为滋养精神世界、理解自身与世界的过程。阅读不只是获得信息，也是在与作者、思想者和文本背后的人相遇。
            </p>
          </div>
          <div>
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent/10 text-accent">
              <Users className="h-4 w-4" />
            </div>
            <h3 className="mt-4 text-sm font-semibold">阅读者之间的相遇</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              带着各自的阅读经验进入交流，通过分享、碰撞和彼此启发，接触不同的理解路径，让自己的阅读被拓宽、被扰动，产生新的心理体验。
            </p>
          </div>
        </div>
        <p className="mt-8 border-t border-border/60 pt-5 text-sm leading-7 text-muted-foreground">
          个人阅读是交流的基础，交流则让个人阅读进入更丰富的经验之中。我们不要求所有人得出相同的结论，也不以说服他人或证明自己为目标。
        </p>
      </Section>

      {/* 不希望变成什么 */}
      <Section index="03" title="我们不希望共读变成什么">
        <ul>
          {nots.map((item) => (
            <li
              key={item}
              className="flex items-start gap-3 border-b border-border/60 py-3 text-sm leading-7 text-muted-foreground"
            >
              <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
              {item}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm leading-7 text-foreground/80">
          共读更像一个共同维护的空间：每个人保有自己的阅读路径，也在交流中接触其他人的理解。
        </p>
      </Section>

      {/* 当前共读 */}
      <Section
        id="current"
        index="04"
        title="正在共读"
        intro="《爱的艺术》· 发起人：漫步 · 共读 3 次"
      >
        <div className="grid gap-8 sm:grid-cols-[160px_minmax(0,1fr)] md:gap-10">
          <div className="relative flex aspect-[3/4] flex-col justify-between overflow-hidden rounded-md bg-accent p-5 text-accent-foreground">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(255,255,255,0.18),transparent_60%)]"
              aria-hidden
            />
            <p className="relative text-[9px] tracking-[0.3em] text-accent-foreground/70">
              WU YU ER · NO.01
            </p>
            <div className="relative">
              <p className="font-heading text-xs text-accent-foreground/70">艾里希·弗洛姆</p>
              <h3 className="mt-1.5 font-heading text-2xl font-bold leading-snug">
                爱的
                <br />
                艺术
              </h3>
              <p className="mt-3 text-[9px] tracking-[0.2em] text-accent-foreground/70">
                THE ART OF LOVING
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm leading-7 text-muted-foreground">
              弗洛姆把爱视为一种需要学习与实践的能力，而不是偶然降临的运气。这一轮共读围绕爱的理论、爱的对象与爱的实践展开。
            </p>

            <div className="mt-6">
              <h4 className="text-xs font-medium tracking-wide text-muted-foreground/70">
                共读安排
              </h4>
              <ul className="mt-2">
                {sessions.map((session) => (
                  <li
                    key={session.title}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border/60 py-3 text-sm"
                  >
                    <span className="font-medium">{session.title}</span>
                    <span className="text-xs text-muted-foreground">{session.dates}</span>
                    {session.href ? (
                      <a
                        href={session.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline"
                      >
                        {session.note}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs leading-6 text-muted-foreground">
                每场约 2 小时，线上腾讯会议；会议链接与会议号以群内最新通知为准。
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-xs font-medium tracking-wide text-muted-foreground/70">
            相关资料
          </h4>
          <div className="mt-2 grid gap-x-8 sm:grid-cols-2">
            {materials.map((material) => (
              <ExternalItem key={material.title} title={material.title} href={material.href} />
            ))}
          </div>
        </div>
      </Section>

      {/* 会前准备 */}
      <Section
        id="prepare"
        index="05"
        title="共读前的基本准备"
        intro="从下周开始，每次会前在知识星球发布至少 100 字的阅读记录。"
      >
        <div className="rounded-md border border-accent/20 bg-accent/[0.04] p-5 md:p-6">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <PenLine className="h-4 w-4 text-accent" />
            和文本发生真实的链接
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            内容不需要完整，也不要求观点正确。你可以写下一个触动、一个疑问、一处困惑，或一段与自身经验有关的联想。我们更在意的是，你是否和文本发生了真实的链接，并带着自己的阅读进入共读。
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            这是一个基础性的门槛，目的是让交流建立在个人阅读的基础上，而不是让共读变成临场聊天。
          </p>
        </div>

        <p className="mt-5 flex items-start gap-2 text-sm leading-7 text-foreground/80">
          <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-accent" />
          如未在当次共读会开始前完成这项准备，我们将无法继续保留你在本群中的参与资格，并将你一次性移出本群。
        </p>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">
          PS：我们不会根据内容评判你的阅读水平，也不会要求你写得深入或精彩；完成不少于 100 字的真实阅读记录即可。
        </p>
      </Section>

      {/* 时间与参与 */}
      <Section
        id="join"
        index="06"
        title="时间与参与"
        intro="内测阶段暂时免费开放，采取「双向匹配」的参与原则。"
      >
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-b border-border/60 pb-5 text-sm">
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent/70" />
            每周五 上午 09:30
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-accent/70" />
            每周日 上午 08:00
          </span>
          <span className="text-xs text-muted-foreground">每场约 2 小时</span>
        </div>

        <ul className="mt-2">
          {agreements.map((item, index) => (
            <li key={item.title} className="border-b border-border/60 py-4">
              <div className="flex gap-3">
                <span className="font-mono text-xs text-accent/70">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
          <p className="flex items-center gap-2 text-muted-foreground">
            <HeartHandshake className="h-4 w-4 text-accent/70" />
            你可以成为共读发起者，也可以认领单场主持。
          </p>
          <a
            href={DOC_LINKS.roles}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-accent hover:underline"
          >
            发起人与主持人职责说明
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </Section>

      {/* 往期 */}
      <Section index="07" title="之前读过的书" intro="《第二人生》共读回顾">
        <div>
          {pastReads.map((read, index) => (
            <a
              key={read.href}
              href={read.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-4 border-b border-border/60 py-4 transition-colors hover:text-accent"
            >
              <span className="font-mono text-xs text-accent/60">0{index + 1}</span>
              <span className="text-sm leading-7">{read.title}</span>
              <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
            </a>
          ))}
        </div>
      </Section>

      {/* 加入 */}
      <section className="border-t border-border/70 py-12 md:py-16">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] tracking-[0.3em] text-accent/70">JOIN THE SPACE</p>
            <h2 className="mt-2 font-heading text-xl font-semibold md:text-2xl">
              从一次真实的阅读开始
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-7 text-muted-foreground">
              共读空间目前处于内测阶段，免费开放。先读一读我们的共读说明，再决定是否加入。
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href={DOC_LINKS.intro}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
            >
              阅读共读空间总说明
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href={DOC_LINKS.roles}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/40 hover:text-accent"
            >
              了解职责说明
            </a>
          </div>
        </div>
      </section>

      {/* 页脚说明 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 py-6 text-xs text-muted-foreground">
        <p>内容整理自《吾与尔｜共读空间（进群必读！）》，本页信息持续完善中。</p>
        <Link
          href={ROUTES.bookLists}
          className="inline-flex items-center gap-1 text-accent hover:text-accent/80 hover:underline"
        >
          逛逛智者网书单
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}
