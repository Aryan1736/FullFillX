import { PageHeader } from '../common/PageHeader'

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
        <p className="text-sm text-slate-500">Content for {title} will be implemented here.</p>
      </div>
    </div>
  )
}
