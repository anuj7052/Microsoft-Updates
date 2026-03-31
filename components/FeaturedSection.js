export default function FeaturedSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="bg-gradient-to-br from-ms-purple/10 to-ms-blue/10 rounded-2xl border border-ms-purple/20 p-6 md:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left - Content */}
          <div>
            <span className="inline-flex items-center gap-1.5 bg-ms-purple/15 text-ms-purple text-xs font-bold px-3 py-1 rounded-full mb-4">
              🔷 DEEP DIVE
            </span>
            <h2 className="font-syne font-extrabold text-xl sm:text-2xl md:text-3xl text-[var(--text-primary)] leading-snug md:leading-tight mb-4 tracking-tight">
              Microsoft Fabric: The Unified Analytics Platform Reshaping Enterprises
            </h2>
            <p className="font-dm text-[var(--text-secondary)] text-sm md:text-base leading-relaxed mb-6 font-light">
              Microsoft Fabric brings together data engineering, data warehousing, real-time analytics, data science, and business intelligence into a single SaaS platform. Leading enterprises worldwide are already building their next-generation data estates on Fabric&apos;s OneLake architecture.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="badge-fabric text-xs px-2.5 py-1 rounded-full font-dm">Microsoft Fabric</span>
              <span className="badge-azure text-xs px-2.5 py-1 rounded-full font-dm">OneLake</span>
              <span className="badge-copilot text-xs px-2.5 py-1 rounded-full font-dm">AI-Powered</span>
            </div>
          </div>

          {/* Right - Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-ms-card/60 backdrop-blur rounded-xl border border-[var(--border)] p-5 text-center">
              <p className="font-syne font-extrabold text-2xl md:text-3xl text-ms-purple tracking-tight">25K+</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-dm">Organizations on Fabric</p>
            </div>
            <div className="bg-ms-card/60 backdrop-blur rounded-xl border border-[var(--border)] p-5 text-center">
              <p className="font-syne font-extrabold text-2xl md:text-3xl text-ms-accent tracking-tight">60%</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-dm">Reduced Data Silos</p>
            </div>
            <div className="bg-ms-card/60 backdrop-blur rounded-xl border border-[var(--border)] p-5 text-center">
              <p className="font-syne font-extrabold text-2xl md:text-3xl text-ms-green tracking-tight">3x</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-dm">Faster Time-to-Insight</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
