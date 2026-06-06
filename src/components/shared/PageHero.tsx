import type { ReactNode } from "react"

interface PageHeroProps {
  title: string
  subtitle?: string
  description?: string
  /** Optional decorative accent element */
  accent?: ReactNode
  /** Orientation: default centered, "left" for left-aligned */
  align?: "center" | "left"
  /** Optional breadcrumb */
  breadcrumb?: ReactNode
}

export function PageHero({
  title,
  subtitle,
  description,
  accent,
  align = "center",
  breadcrumb,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/[0.04] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]">
          <pattern id="hero-grid-2" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" className="fill-primary" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#hero-grid-2)" />
        </svg>
      </div>

      <div
        className={`container mx-auto px-4 py-12 md:py-16 relative ${
          align === "center" ? "text-center" : ""
        }`}
      >
        {/* Breadcrumb */}
        {breadcrumb && (
          <div className={`mb-4 ${align === "center" ? "flex justify-center" : ""}`}>
            <nav className="text-xs text-muted-foreground/60">{breadcrumb}</nav>
          </div>
        )}

        {/* Accent decorative element */}
        {accent && (
          <div className={`mb-3 ${align === "center" ? "flex justify-center" : ""}`}>
            {accent}
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground/60 font-heading italic">
            {subtitle}
          </p>
        )}

        {/* Description */}
        {description && (
          <p
            className={`mt-3 text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed ${
              align === "center" ? "mx-auto" : ""
            }`}
          >
            {description}
          </p>
        )}
      </div>
    </section>
  )
}
