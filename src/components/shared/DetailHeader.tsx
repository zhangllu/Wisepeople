import type { ReactNode } from "react"

interface DetailHeaderProps {
  title: string
  description?: string
  /** Breadcrumb / back link shown above title */
  breadcrumb?: ReactNode
  /** Optional metadata row (code, badge, tags) shown above title */
  meta?: ReactNode
}

export function DetailHeader({ title, description, breadcrumb, meta }: DetailHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/30">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/[0.03] via-transparent to-transparent" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
          <pattern id="detail-header-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-primary" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#detail-header-dots)" />
        </svg>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-8 md:py-10 relative">
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className="mb-4 text-xs text-muted-foreground/60">{breadcrumb}</div>
        )}

        {/* Meta */}
        {meta && (
          <div className="mb-2">{meta}</div>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
