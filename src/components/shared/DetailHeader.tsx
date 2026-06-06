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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(circle, var(--primary) 0.5px, transparent 0.5px)",
            backgroundSize: "32px 32px",
            opacity: 0.12,
          }}
        />
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
