interface Props {
  title: string
  subtitle?: string
}

export function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-12 pt-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-3">{title}</h1>
      <div className="h-1 w-16 bg-primary rounded" />
      {subtitle && <p className="text-muted-foreground mt-4 text-base max-w-xl">{subtitle}</p>}
    </div>
  )
}
