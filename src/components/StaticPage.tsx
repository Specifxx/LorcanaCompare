export function StaticPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="page-title">{title}</h1>
      <div className="prose-site mt-6">{children}</div>
    </article>
  );
}
