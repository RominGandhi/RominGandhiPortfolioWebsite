import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ArrowUpRight, GitBranch } from 'lucide-react'

// ─── Live chart for Market Microstructure ────────────────────────────────────
function LiveChart() {
  const [data, setData] = useState(() =>
    Array.from({ length: 40 }, (_, i) => 50 + Math.sin(i * 0.4) * 15 + (Math.random() - 0.5) * 8)
  )

  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1]!
        const next = Math.max(10, Math.min(90, last + (Math.random() - 0.48) * 4))
        return [...prev.slice(1), next]
      })
    }, 120)
    return () => clearInterval(id)
  }, [])

  const W = 400, H = 100
  const min = Math.min(...data), max = Math.max(...data)
  const norm = (v: number) => H - ((v - min) / (max - min + 1)) * H
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${norm(v)}`).join(' ')
  const area = `0,${H} ${pts} ${W},${H}`

  return (
    <div className="relative h-28 w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#cg)" />
        <polyline points={pts} fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" />
        {/* current price dot */}
        <circle cx={W} cy={norm(data[data.length - 1]!)} r="3" fill="#22d3ee" />
      </svg>
      {/* price label */}
      <div className="absolute right-2 top-1 font-mono text-[10px] text-[#22d3ee]">
        {data[data.length - 1]!.toFixed(2)}
      </div>
      {/* axis labels */}
      <div className="absolute bottom-1 left-0 right-0 flex justify-between px-1 font-mono text-[9px] text-white/20">
        <span>SPREAD</span><span>DEPTH</span><span>VOL</span>
      </div>
    </div>
  )
}

// ─── SQL snippet ─────────────────────────────────────────────────────────────
function SQLCard() {
  const code = [
    { t: 'kw', v: 'WITH' },     { t: 'txt', v: ' first_touch ' },   { t: 'kw', v: 'AS' },      { t: 'txt', v: ' (\n' },
    { t: 'txt', v: '  ' },      { t: 'kw', v: 'SELECT' },            { t: 'txt', v: ' user_id,\n' },
    { t: 'txt', v: '    ' },    { t: 'fn', v: 'DATE_TRUNC' },         { t: 'txt', v: "('month', " }, { t: 'fn', v: 'MIN' }, { t: 'txt', v: '(event_time))\n' },
    { t: 'txt', v: '    ' },    { t: 'kw', v: 'AS' },                 { t: 'txt', v: ' cohort_month\n' },
    { t: 'txt', v: '  ' },      { t: 'kw', v: 'FROM' },              { t: 'txt', v: ' events\n' },
    { t: 'txt', v: '  ' },      { t: 'kw', v: 'GROUP BY' },          { t: 'txt', v: ' 1\n)\n' },
    { t: 'kw', v: 'SELECT' },   { t: 'txt', v: ' cohort_month,\n' },
    { t: 'txt', v: '  ' },      { t: 'fn', v: 'AVG' },               { t: 'txt', v: '(active_30d) ' }, { t: 'kw', v: 'AS' }, { t: 'txt', v: ' ret_30d\n' },
    { t: 'kw', v: 'FROM' },     { t: 'txt', v: ' activity\n' },
    { t: 'kw', v: 'GROUP BY' }, { t: 'txt', v: ' 1' },
  ]

  const color: Record<string, string> = {
    kw: '#c084fc', fn: '#fbbf24', str: '#86efac', txt: '#94a3b8',
  }

  return (
    <div className="h-32 overflow-hidden rounded-lg bg-[#0d0d12] p-3 font-mono text-[10px] leading-[1.7]">
      {code.map((tok, i) => (
        <span key={i} style={{ color: color[tok.t] }} className="whitespace-pre">{tok.v}</span>
      ))}
    </div>
  )
}

// ─── Terminal output for Quant Research ──────────────────────────────────────
function TerminalCard() {
  const lines = [
    { t: 'dim',  v: '$ python backtest.py --strategy momentum' },
    { t: 'dim',  v: 'Loading data...  ████████████  done' },
    { t: 'txt',  v: '' },
    { t: 'grn',  v: '✓ Sharpe Ratio     1.84' },
    { t: 'grn',  v: '✓ Max Drawdown    -8.3%' },
    { t: 'grn',  v: '✓ Win Rate        61.2%' },
    { t: 'txt',  v: '' },
    { t: 'cyan', v: '→ Annualised Return   +24.7%' },
    { t: 'dim',  v: '  Benchmark (SPY)     +11.2%' },
    { t: 'txt',  v: '' },
    { t: 'dim',  v: 'Export: results.csv  [OK]' },
  ]

  const color: Record<string, string> = {
    dim: '#475569', txt: '#94a3b8', grn: '#4ade80', cyan: '#67e8f9',
  }

  return (
    <div className="h-32 overflow-hidden rounded-lg bg-[#0d0d12] p-3 font-mono text-[10px] leading-[1.7]">
      {lines.map((l, i) => (
        <div key={i} style={{ color: color[l.t] }}>{l.v || ' '}</div>
      ))}
    </div>
  )
}

// ─── Mini UI mockup for Campus Finance ───────────────────────────────────────
function UICard() {
  const categories = [
    { label: 'Housing',  pct: 45, color: '#a78bfa' },
    { label: 'Food',     pct: 22, color: '#34d399' },
    { label: 'Transit',  pct: 13, color: '#fbbf24' },
    { label: 'Other',    pct: 20, color: '#f87171' },
  ]

  return (
    <div className="h-32 overflow-hidden rounded-lg bg-[#0d0d12] p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[9px] text-white/40 uppercase tracking-wider">Monthly Budget</span>
        <span className="font-mono text-[10px] text-white/70">$1,840</span>
      </div>
      {/* bar */}
      <div className="mb-3 flex h-2 w-full overflow-hidden rounded-full">
        {categories.map(c => (
          <motion.div key={c.label}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-full"
            style={{ originX: 0, background: c.color, width: `${c.pct}%` }} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-1">
        {categories.map(c => (
          <div key={c.label} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: c.color }} />
            <span className="font-mono text-[9px] text-white/40">{c.label}</span>
            <span className="ml-auto font-mono text-[9px] text-white/60">{c.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
type CardProps = {
  title: string
  description: string
  tags: string[]
  accent: string
  visual: React.ReactNode
  href?: string
  repo?: string
  featured?: boolean
  delay?: number
}

function ProjectCard({ title, description, tags, accent, visual, href, repo, featured, delay = 0 }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border"
      style={{
        background:  'rgba(10,10,14,0.85)',
        borderColor: 'rgba(255,255,255,0.07)',
      }}
    >
      {/* top accent line on hover */}
      <motion.div className="absolute left-0 right-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        initial={{ opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.2 }}
      />

      {/* visual area */}
      <div className="relative p-4 pb-0">
        {visual}
      </div>

      {/* content */}
      <div className="flex flex-1 flex-col justify-between p-5 pt-4">
        <div>
          <h3 className={`font-[650] tracking-tight text-white leading-snug ${featured ? 'text-[1.15rem]' : 'text-[1rem]'}`}>
            {title}
          </h3>
          <p className="mt-1.5 text-[13px] text-[rgba(255,255,255,0.45)] leading-relaxed">
            {description}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span key={tag} className="rounded-full px-2 py-0.5 text-[11px]"
                style={{ background: accent + '12', border: `1px solid ${accent}25`, color: accent }}>
                {tag}
              </span>
            ))}
          </div>
          <div className="flex shrink-0 gap-1">
            {href && (
              <a href={href} target="_blank" rel="noreferrer"
                className="rounded-full p-1.5 transition hover:bg-white/10" style={{ color: accent }}>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {repo && (
              <a href={repo} target="_blank" rel="noreferrer"
                className="rounded-full p-1.5 text-white/30 transition hover:bg-white/10 hover:text-white/70">
                <GitBranch className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function ProjectsSection() {
  return (
    <div className="relative w-full border-t border-[rgba(255,255,255,0.06)] py-28 px-6">
      <div className="mx-auto max-w-5xl">

        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.3)]">Technical Projects</p>
          <h2 className="text-[2.2rem] font-[650] tracking-[-0.03em] text-white">What I've built.</h2>
          <p className="mt-3 text-[15px] text-[rgba(255,255,255,0.45)]">Engineering meets markets.</p>
        </motion.div>

        {/* bento grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <ProjectCard
            title="Market Microstructure Dashboard"
            description="Spreads, depth, and volatility regimes — live. Built for explainability and speed."
            tags={['TypeScript', 'React', 'Finance']}
            accent="#22d3ee"
            visual={<LiveChart />}
            delay={0}
            featured
          />
          <ProjectCard
            title="Quant Research → Web Product"
            description="Upload data, run strategies, compare metrics, export. A full research workflow in the browser."
            tags={['Python', 'React', 'Backtesting']}
            accent="#a855f7"
            visual={<TerminalCard />}
            delay={0.08}
          />
          <ProjectCard
            title="SQL Cohort Retention Library"
            description="Production-ready cohort retention queries with result previews and decision takeaways."
            tags={['SQL', 'Analytics', 'Cohorts']}
            accent="#f59e0b"
            visual={<SQLCard />}
            delay={0.16}
          />
          <ProjectCard
            title="Campus Finance Companion"
            description="Student budgeting with delightful UX and strict privacy defaults."
            tags={['UX', 'Product', 'React']}
            accent="#34d399"
            visual={<UICard />}
            delay={0.24}
          />
        </div>

      </div>
    </div>
  )
}
