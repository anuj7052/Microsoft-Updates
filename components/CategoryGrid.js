import Link from 'next/link'
import { categories } from '../data/news'

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="font-syne font-extrabold text-2xl text-[var(--text-primary)] mb-6 tracking-tight">
        Browse by Category
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/${cat.id}`}
            className="group bg-ms-card rounded-xl border border-[var(--border)] p-5 hover:border-ms-blue/40 transition-all duration-300 hover:-translate-y-1 text-center"
          >
            <div className="text-3xl mb-2">{cat.icon}</div>
            <h3 className="font-syne font-bold text-sm text-[var(--text-primary)] group-hover:text-ms-accent transition-colors tracking-tight">
              {cat.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-dm">{cat.count} articles</p>
            <div
              className="h-0.5 w-8 mx-auto mt-3 rounded-full opacity-60"
              style={{ backgroundColor: cat.color }}
            ></div>
          </Link>
        ))}
      </div>
    </section>
  )
}
