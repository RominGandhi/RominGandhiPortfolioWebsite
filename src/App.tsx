import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  GitBranch,
  LayoutGrid,
  Search,
  Settings,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CursorIDEMockup } from './components/CursorIDEMockup'
import { SkillsSection } from './components/SkillsSection'
import { ExperienceSection } from './components/ExperienceSection'
import { ProjectsSection } from './components/ProjectsSection'

// ─── grain overlay ────────────────────────────────────────────────────────────
function Grain() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div
        style={{
          position: 'absolute',
          inset: '-50%',
          width: '200%',
          height: '200%',
          opacity: 0.045,
          animation: 'grain 0.4s steps(1) infinite',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '256px 256px',
        }}
      />
    </div>
  )
}

// ─── loading screen ───────────────────────────────────────────────────────────
type VisitorRole = 'recruiter' | 'visitor'

function LoadingScreen({ onDone }: { onDone: (role: VisitorRole) => void }) {
  return (
    <div
      className="loading-screen h-full w-full flex flex-col items-center justify-center"
      style={{ background: 'radial-gradient(1000px 560px at 8% -8%, rgba(168,85,247,0.28), transparent 58%), radial-gradient(1100px 650px at 92% 4%, rgba(34,211,238,0.22), transparent 62%), radial-gradient(800px 520px at 60% 96%, rgba(168,85,247,0.16), transparent 58%), #09090b' }}
    >
      <Grain />

      {/* name */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
        className="text-[clamp(2.8rem,7vw,5rem)] font-[650] tracking-[-0.04em] text-white"
      >
        Romin Gandhi
      </motion.h1>

      {/* subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.85 }}
        className="mt-5 font-mono text-[15px] uppercase tracking-[0.28em] text-[#71717a]"
      >
        CS&nbsp;&nbsp;×&nbsp;&nbsp;Finance
      </motion.p>

      {/* choice */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.6, ease: 'easeOut' }}
        className="mt-16 flex flex-col items-center gap-5"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.28)]">
          Who's visiting?
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onDone('recruiter')}
            className="group rounded-full bg-white px-6 py-2.5 text-[13px] font-[600] text-[#09090b] transition-opacity hover:opacity-90"
          >
            Recruiter
          </button>
          <button
            type="button"
            onClick={() => onDone('visitor')}
            className="rounded-full border border-[rgba(255,255,255,0.15)] px-6 py-2.5 text-[13px] font-[500] text-[rgba(255,255,255,0.6)] transition-all hover:border-[rgba(255,255,255,0.35)] hover:text-white"
          >
            Just browsing
          </button>
        </div>
      </motion.div>
    </div>
  )
}

// ─── scroll arrow (appears after 10s) ────────────────────────────────────────
function ScrollArrow({ loading }: { loading: boolean }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (loading) return
    const t = window.setTimeout(() => setVisible(true), 10000)
    return () => window.clearTimeout(t)
  }, [loading])

  return (
    <motion.div
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-10"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 6 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      onClick={() => document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' })}
    >
      <motion.div
        animate={visible ? { y: [0, 7, 0] } : {}}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="flex flex-col items-center gap-1.5"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">Tech Stack</span>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-white/30">
          <path d="M3 6l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </motion.div>
    </motion.div>
  )
}

// ─── 3-D tilt for the IDE panel ───────────────────────────────────────────────
function useTilt(maxDeg = 6) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0, tx = 0, ty = 0, cx = 0, cy = 0
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t
    const tick = () => {
      cx = lerp(cx, tx, 0.08)
      cy = lerp(cy, ty, 0.08)
      el.style.transform = `perspective(1200px) rotateY(${cx}deg) rotateX(${cy}deg) scale(1.01)`
      raf = requestAnimationFrame(tick)
    }
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      tx =  ((e.clientX - (r.left + r.width  / 2)) / (r.width  / 2)) * maxDeg
      ty = -((e.clientY - (r.top  + r.height / 2)) / (r.height / 2)) * (maxDeg * 0.6)
    }
    const onLeave = () => { tx = 0; ty = 0 }
    raf = requestAnimationFrame(tick)
    el.addEventListener('mousemove', onMove, { passive: true })
    el.addEventListener('mouseleave', onLeave)
    return () => { cancelAnimationFrame(raf); el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave) }
  }, [maxDeg])
  return { ref }
}

type Project = {
  title: string
  blurb: string
  tags: string[]
  href?: string
  repo?: string
}

type Ticker = { sym: string; px: number; chg: number }

type FileId = 'README.md' | 'about.md' | 'projects.ts' | 'skills.json' | 'education.md' | 'contact.sh'

type BuildArtifact =
  | { kind: 'sql'; title: string; subtitle?: string; code: string; takeaway?: string }
  | { kind: 'table'; title: string; subtitle?: string; columns: string[]; rows: (string | number)[][]; takeaway?: string }
  | { kind: 'link'; title: string; subtitle?: string; href: string }
  | { kind: 'note'; title: string; subtitle?: string; body: string }

type BuildLogCase = {
  id: string
  label: string
  type: 'experience' | 'project'
  timeframe?: string
  tags: string[]
  headline: string
  sections: { title: string; bullets: string[] }[]
  artifacts: BuildArtifact[]
  runOutput: { label: string; value: string; tone?: 'pos' | 'neg' | 'info' | 'neutral' }[]
}

const clamp = (n: number, a: number, b: number) => Math.min(b, Math.max(a, n))

function useTheme() {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark')
    localStorage.setItem('theme', 'dark')
  }, [])
}

function Dot({ c }: { c: string }) {
  return <span className={`h-3 w-3 rounded-full ${c}`} aria-hidden="true" />
}

function Badge({
  children,
  tone = 'neutral',
}: {
  children: React.ReactNode
  tone?: 'neutral' | 'pos' | 'neg' | 'info'
}) {
  const cls =
    tone === 'pos'
      ? 'border-emerald-400/40 text-emerald-200 bg-emerald-400/10'
      : tone === 'neg'
        ? 'border-rose-400/40 text-rose-200 bg-rose-400/10'
        : tone === 'info'
          ? 'border-[#94a3b8]/40 text-[#cbd5e1] bg-[#94a3b8]/10'
          : 'border-[rgb(var(--border))] text-[rgba(var(--fg),0.8)] bg-[rgba(var(--card),0.6)]'
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] ${cls}`}>
      {children}
    </span>
  )
}

function formatPct(n: number) {
  const sign = n > 0 ? '+' : ''
  return `${sign}${n.toFixed(2)}%`
}

function formatPx(n: number) {
  return n >= 1000 ? n.toFixed(0) : n.toFixed(2)
}

function useTickerTape(seed: Ticker[]) {
  const [t, setT] = useState<Ticker[]>(seed)
  useEffect(() => {
    const id = window.setInterval(() => {
      setT((cur) =>
        cur.map((x) => {
          const step = (Math.random() - 0.5) * (x.px * 0.0025)
          const next = Math.max(0.01, x.px + step)
          const chg = ((next - x.px) / x.px) * 100
          return { ...x, px: next, chg }
        }),
      )
    }, 900)
    return () => window.clearInterval(id)
  }, [])
  return t
}

function TypingName({
  text,
  enabled,
  msPerChar = 115,
  onDone,
}: {
  text: string
  enabled: boolean
  msPerChar?: number
  onDone?: () => void
}) {
  const ref = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let doneCalled = false

    if (!enabled) {
      el.textContent = text
      if (!doneCalled) {
        doneCalled = true
        onDone?.()
      }
      return
    }

    let raf = 0
    const perChar = Math.max(30, msPerChar)

    const existing = el.textContent ?? ''
    const safeExisting = text.startsWith(existing) ? existing : ''
    if (safeExisting !== existing) el.textContent = safeExisting

    let lastLen = safeExisting.length
    const start = performance.now() - lastLen * perChar

    const tick = (t: number) => {
      const elapsed = t - start
      const len = Math.min(text.length, Math.floor(elapsed / perChar))
      if (len !== lastLen) {
        el.textContent = text.slice(0, len)
        lastLen = len
      }
      if (len < text.length) {
        raf = window.requestAnimationFrame(tick)
      } else {
        if (!doneCalled) {
          doneCalled = true
          onDone?.()
        }
      }
    }

    raf = window.requestAnimationFrame(tick)
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [enabled, msPerChar, onDone, text])

  return <span ref={ref} />
}

function Avatar({
  src,
  alt,
  fallback,
  size = 56,
}: {
  src: string
  alt: string
  fallback: string
  size?: number | string
}) {
  const [ok, setOk] = useState(true)
  const s = typeof size === 'number' ? `${size}px` : size

  return (
    <div
      className="relative grid place-items-center overflow-hidden rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--card),0.6)] shadow-[0_0_0_1px_rgba(var(--fg),0.06)_inset] backdrop-blur"
      style={{ width: s, height: s }}
      aria-label={alt}
    >
      {ok ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={() => setOk(false)}
        />
      ) : (
        <span className="select-none font-mono text-sm font-semibold text-[rgba(var(--fg),0.85)]">
          {fallback}
        </span>
      )}
    </div>
  )
}


function SqlHighlight({ code }: { code: string }) {
  const KW = new Set([
    'SELECT','FROM','WHERE','WITH','GROUP','BY','ORDER','JOIN','LEFT','RIGHT','INNER',
    'OUTER','ON','USING','AS','CASE','WHEN','THEN','ELSE','END','AND','OR','NOT','IN',
    'IS','NULL','DISTINCT','HAVING','LIMIT','OFFSET','INTO','INSERT','UPDATE','DELETE',
    'CREATE','TABLE','INTERVAL','PARTITION','OVER','BETWEEN','LIKE','UNION','INTERSECT',
    'EXCEPT',
  ])
  const FN = new Set([
    'MAX','MIN','AVG','COUNT','SUM','COALESCE','CAST','DATE_TRUNC','ROW_NUMBER',
    'RANK','DENSE_RANK','NUMERIC','INTEGER','TEXT','EXTRACT',
  ])

  type Tok = { t: 'kw' | 'fn' | 'str' | 'cmt' | 'num' | 'txt'; v: string }

  const tokenize = (src: string): Tok[] => {
    const out: Tok[] = []
    let i = 0
    while (i < src.length) {
      if (src[i] === '-' && src[i + 1] === '-') {
        const end = src.indexOf('\n', i)
        const v = end === -1 ? src.slice(i) : src.slice(i, end)
        out.push({ t: 'cmt', v })
        i += v.length
      } else if (src[i] === "'") {
        let j = i + 1
        while (j < src.length && src[j] !== "'") j++
        out.push({ t: 'str', v: src.slice(i, j + 1) })
        i = j + 1
      } else if (/\d/.test(src[i]!)) {
        let j = i
        while (j < src.length && /[\d.]/.test(src[j]!)) j++
        out.push({ t: 'num', v: src.slice(i, j) })
        i = j
      } else if (/[a-zA-Z_]/.test(src[i]!)) {
        let j = i
        while (j < src.length && /\w/.test(src[j]!)) j++
        const w = src.slice(i, j)
        const up = w.toUpperCase()
        out.push({ t: KW.has(up) ? 'kw' : FN.has(up) ? 'fn' : 'txt', v: w })
        i = j
      } else {
        out.push({ t: 'txt', v: src[i]! })
        i++
      }
    }
    return out
  }

  const cls: Record<Tok['t'], string> = {
    kw:  'text-[#e2e8f0] font-semibold',
    fn:  'text-[#94a3b8]',
    str: 'text-[#a8c5a8]',
    cmt: 'text-[rgba(var(--fg),0.42)] italic',
    num: 'text-[#b8a88a]',
    txt: 'text-[rgba(var(--fg),0.75)]',
  }

  return <>{tokenize(code).map((tk, idx) => <span key={idx} className={cls[tk.t]}>{tk.v}</span>)}</>
}

function NoteHighlight({ body }: { body: string }) {
  return (
    <>
      {body.split('\n').map((line, i) => {
        if (/^##\s/.test(line)) {
          return <div key={i}><span className="text-[#94a3b8] font-semibold">{line}</span>{'\n'}</div>
        }
        const boldKv = line.match(/^(-\s)\*\*(.+?)\*\*(.*)$/)
        if (boldKv) {
          return (
            <div key={i}>
              <span className="text-[rgba(var(--fg),0.42)]">{boldKv[1]}</span>
              <span className="text-[#94a3b8] font-semibold">{boldKv[2]}</span>
              <span className="text-[rgba(var(--fg),0.75)]">{boldKv[3]}</span>{'\n'}
            </div>
          )
        }
        if (line.startsWith('- ')) {
          return (
            <div key={i}>
              <span className="text-[rgba(var(--fg),0.42)]">{'- '}</span>
              <span className="text-[rgba(var(--fg),0.75)]">{line.slice(2)}</span>{'\n'}
            </div>
          )
        }
        return <div key={i}><span className={line ? 'text-[rgba(var(--fg),0.75)]' : ''}>{line}</span>{'\n'}</div>
      })}
    </>
  )
}

type PaletteItem = {
  id: string
  title: string
  subtitle?: string
  group?: string
  hotkey?: string
  run: () => void
}

export default function App() {
  const reduceMotion = useReducedMotion()
  useTheme()
  const { ref: tiltRef } = useTilt(6)

  useEffect(() => {
    const root = document.documentElement
    let raf = 0
    let nextX = 50
    let nextY = 40

    const flush = () => {
      raf = 0
      root.style.setProperty('--mx', `${nextX}%`)
      root.style.setProperty('--my', `${nextY}%`)
    }

    const onMove = (e: MouseEvent) => {
      nextX = clamp((e.clientX / window.innerWidth) * 100, 0, 100)
      nextY = clamp((e.clientY / window.innerHeight) * 100, 0, 100)
      if (!raf) raf = window.requestAnimationFrame(flush)
    }

    // initial paint
    flush()

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  const name = 'Romin Gandhi'
  const title = 'CS + Finance Double Degree'
  const tagline = "Built for both sides of the trade, from the terminal to the terminal."
  const email = 'gand6363@mylaurier.ca'
  const github = 'https://github.com/RominGandhi'
  const linkedin = 'https://www.linkedin.com/in/romin-gandhi-857105203/'
  const avatarSrc = '/romin.png'
  const initials = 'RG'

  const projects: Project[] = useMemo(
    () => [
      {
        title: 'Market Microstructure Dashboard',
        blurb: 'Spreads, depth, volatility regimes—built for explainability and speed.',
        tags: ['TypeScript', 'Data viz', 'Finance'],
        repo: `${github}/project`,
      },
      {
        title: 'Quant Research → Web Product',
        blurb: 'Upload data → run strategies → compare metrics → export.',
        tags: ['React', 'Python', 'Backtesting'],
        href: 'https://your-demo-link.com',
      },
      {
        title: 'Campus Finance Companion',
        blurb: 'Student budgeting with delightful UX + strict privacy defaults.',
        tags: ['UX', 'Product', 'Security'],
      },
    ],
    [github],
  )

  const files = useMemo(() => {
    const projectsLines = [
      `export const projects = [`,
      ...projects.flatMap((p) => [
        `  {`,
        `    title: "${p.title}",`,
        `    blurb: "${p.blurb}",`,
        `    tags: ${JSON.stringify(p.tags)},`,
        ...(p.href ? [`    href: "${p.href}",`] : []),
        ...(p.repo ? [`    repo: "${p.repo}",`] : []),
        `  },`,
      ]),
      `] as const`,
    ]

    const skillsJson = {
      engineering: ['TypeScript', 'React', 'Node', 'Python', 'SQL'],
      finance: ['Risk basics', 'Market structure curiosity', 'Reporting & KPIs'],
      tooling: ['Git', 'Testing basics', 'Figma', 'Linux/CLI'],
    }

    const readme = [
      `# ${name}`,
      ``,
      `> ${tagline}`,
      ``,
      `## Education`,
      `Wilfrid Laurier University (2022 — 2027)`,
      `- Honours BBA, Finance`,
      `- Honours BSc, Computer Science — Big Data Systems`,
      ``,
      `## Skills`,
      `- Programming Languages: Python, Java, C/C++, MATLAB, MySQL, HTML/CSS, JavaScript, x86 Assembly, VBA`,
      `- Framework & Libraries: React, Django, Flask, Numpy, Pandas, Matplotlib, TensorFlow, Scikit-Learn, PyTorch`,
      `- Databases/Cloud: PostgreSQL, SQL Server, MongoDB, Google Cloud, AWS`,
      ``,
      `## Quick`,
      `- Email: ${email}`,
      `- GitHub: ${github}`,
      `- LinkedIn: ${linkedin}`,
      ``,
      `## How I think`,
      `- Build systems that are fast, legible, and demo-ready.`,
      `- Explain complex ideas with clean visuals and crisp writing.`,
    ]

    const about = [
      `## about.md`,
      ``,
      `I'm a ${title} student. I like shipping products where engineering meets markets.`,
      ``,
      `On the CS side: frontend performance, clean APIs, and systems that don't break.`,
      `On the finance side: structure, risk, and turning noise into decisions.`,
    ]

    const education = [
      `## Education`,
      `- Wilfrid Laurier University (2022 — 2027)`,
      `- Honours BBA, Finance`,
      `- Honours BSc, Computer Science — Big Data Systems`,
    ]

    const contact = [
      `#!/bin/sh`,
      `echo "Let's talk."`,
      `echo "email: ${email}"`,
      `echo "github: ${github}"`,
      `echo "linkedin: ${linkedin}"`,
    ]

    return {
      'README.md': readme,
      'about.md': about,
      'projects.ts': projectsLines,
      'skills.json': JSON.stringify(skillsJson, null, 2).split('\n'),
      'education.md': education,
      'contact.sh': contact,
    } satisfies Record<FileId, string[]>
  }, [email, github, linkedin, name, projects, tagline, title])

  const defaultFileContents = useMemo(() => {
    const next: Record<FileId, string> = {
      'README.md': files['README.md'].join('\n'),
      'about.md': files['about.md'].join('\n'),
      'projects.ts': files['projects.ts'].join('\n'),
      'skills.json': files['skills.json'].join('\n'),
      'education.md': files['education.md'].join('\n'),
      'contact.sh': files['contact.sh'].join('\n'),
    }
    return next
  }, [files])

  const [loading, setLoading] = useState(true)
  const [visitorRole, setVisitorRole] = useState<VisitorRole | null>(null)
  const [view, setView] = useState<'landing' | 'ide'>('landing')
  const [nameDone, setNameDone] = useState(false)
  const [rightReady, setRightReady] = useState(false)
  const [agentDone, setAgentDone] = useState(false)
  const onAgentDone = useCallback(() => setAgentDone(true), [])

  const onLoadingDone = useCallback((role: VisitorRole) => {
    setVisitorRole(role)
    setLoading(false)
    // recruiters skip the scroll lock — unlock immediately
    if (role === 'recruiter') setAgentDone(true)
  }, [])

  // Always start at the top — disable browser scroll restoration
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  }, [])

  // Lock scroll until the agent finishes typing its reply
  useEffect(() => {
    const locked = loading || !nameDone || !rightReady || !agentDone
    document.body.style.overflow = locked ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [loading, nameDone, rightReady, agentDone])
  const [, setActive] = useState<FileId>('README.md')
  const [, ] = useState<Record<FileId, string>>(() => defaultFileContents)

  const [paletteOpen, setPaletteOpen] = useState(true)
  const [paletteQuery] = useState('')
  const [paletteIndex, setPaletteIndex] = useState(0)
  const paletteInputRef = useRef<HTMLInputElement | null>(null)

  const baseTape: Ticker[] = useMemo(
    () => [
      { sym: 'SPY', px: 511.32, chg: 0.12 },
      { sym: 'QQQ', px: 449.18, chg: -0.08 },
      { sym: 'AAPL', px: 203.44, chg: 0.26 },
      { sym: 'NVDA', px: 118.10, chg: 0.41 },
      { sym: 'BTC', px: 67250.0, chg: -0.55 },
      { sym: 'ETH', px: 3240.0, chg: 0.33 },
      { sym: 'DXY', px: 104.13, chg: 0.05 },
      { sym: 'UST10Y', px: 4.21, chg: -0.03 },
    ],
    [],
  )
  const tape = useTickerTape(baseTape)

  const buildLogCases: BuildLogCase[] = useMemo(
    () => [
      {
        id: 'exp-dawson-incoming',
        label: 'Dawson Partners',
        type: 'experience',
        timeframe: 'Fall 2026 (Incoming)',
        tags: ['Finance', 'Analysis', 'Research'],
        headline: 'Incoming — building strong fundamentals in research, modeling, and communication.',
        sections: [
          { title: 'Focus', bullets: ['Structured thinking under time pressure', 'Clean outputs: memos, models, and dashboards'] },
          { title: 'Operating principles', bullets: ['Make assumptions explicit', 'Tie analysis to a decision', 'Keep work legible + reproducible'] },
        ],
        artifacts: [
          {
            kind: 'note',
            title: '1‑pager template',
            subtitle: 'How I structure a memo',
            body: [
              '## Summary',
              '- What changed? Why now?',
              '',
              '## Key questions',
              '- What must be true?',
              '',
              '## Risks',
              '- What breaks the thesis?',
              '',
              '## Decision',
              '- What I would do next',
            ].join('\n'),
          },
        ],
        runOutput: [
          { label: 'Status', value: 'Incoming', tone: 'info' },
          { label: 'Focus', value: 'Clarity + speed', tone: 'neutral' },
          { label: 'Tooling', value: 'SQL · Python · Excel', tone: 'neutral' },
          { label: 'Output', value: 'Memos · Models · Dashboards', tone: 'neutral' },
        ],
      },
      {
        id: 'proj-sql-retention',
        label: 'SQL Retention Library',
        type: 'project',
        timeframe: 'Build Log',
        tags: ['SQL', 'Cohorts', 'Metrics'],
        headline: 'Cohort retention query + result preview + decision takeaway.',
        sections: [
          { title: 'Problem', bullets: ['Retention is the fastest “truth signal” for product quality.'] },
          { title: 'Approach', bullets: ['Define cohort = first_seen_month', 'Compute retained_30d / retained_90d', 'Keep query auditable'] },
          { title: 'What it enables', bullets: ['Compare cohorts over time', 'Spot onboarding changes quickly'] },
        ],
        artifacts: [
          {
            kind: 'sql',
            title: 'cohort_retention.sql',
            subtitle: '30d / 90d retention',
            takeaway: 'Retention up ≠ success unless cohorts improve without paid mix changes.',
            code: [
              'WITH first_touch AS (',
              '  SELECT user_id, DATE_TRUNC(\'month\', MIN(event_time)) AS cohort_month',
              '  FROM events',
              '  GROUP BY 1',
              '),',
              'activity AS (',
              '  SELECT e.user_id, f.cohort_month,',
              '    MAX(CASE WHEN e.event_time >= f.cohort_month + INTERVAL \'30 days\' THEN 1 ELSE 0 END) AS active_30d,',
              '    MAX(CASE WHEN e.event_time >= f.cohort_month + INTERVAL \'90 days\' THEN 1 ELSE 0 END) AS active_90d',
              '  FROM events e',
              '  JOIN first_touch f USING (user_id)',
              '  GROUP BY 1,2',
              ')',
              'SELECT cohort_month,',
              '  COUNT(*) AS users,',
              '  AVG(active_30d)::numeric(10,3) AS retained_30d,',
              '  AVG(active_90d)::numeric(10,3) AS retained_90d',
              'FROM activity',
              'GROUP BY 1',
              'ORDER BY 1;',
            ].join('\n'),
          },
          {
            kind: 'table',
            title: 'Result preview',
            subtitle: 'Sample output',
            takeaway: 'Look for cohort step-changes, not single-month noise.',
            columns: ['cohort_month', 'users', 'retained_30d', 'retained_90d'],
            rows: [
              ['2026-01-01', 1240, 0.412, 0.268],
              ['2026-02-01', 1315, 0.436, 0.281],
              ['2026-03-01', 1402, 0.451, 0.295],
            ],
          },
        ],
        runOutput: [
          { label: 'Query', value: 'PASS', tone: 'pos' },
          { label: 'Runtime', value: '120ms', tone: 'neutral' },
          { label: 'Rows', value: '3 cohorts', tone: 'neutral' },
          { label: 'Takeaway', value: 'Retention trending up', tone: 'info' },
        ],
      },
      {
        id: 'proj-microstructure',
        label: 'Market Microstructure Dashboard',
        type: 'project',
        timeframe: 'Build Log',
        tags: ['TypeScript', 'Data viz', 'Finance'],
        headline: 'Make spread/volatility regimes legible with fast UI and clear metrics.',
        sections: [
          { title: 'Problem', bullets: ['Market data is noisy. Good tools reduce cognitive load.'] },
          { title: 'Approach', bullets: ['Define metrics (spread %, RV, depth proxy)', 'Design for speed + readability'] },
          { title: 'Result', bullets: ['Clear panels + consistent scales', 'Explainable outputs for decisions'] },
        ],
        artifacts: [
          {
            kind: 'note',
            title: 'Metric definitions',
            subtitle: 'What each panel means',
            body: [
              '- **Spread %** = (ask - bid) / mid',
              '- **RV** = realized volatility over window',
              '- **Depth proxy** = volume near mid (bucketed)',
            ].join('\n'),
          },
          { kind: 'link', title: 'GitHub', subtitle: 'Repository', href: github },
        ],
        runOutput: [
          { label: 'Build', value: 'PASS', tone: 'pos' },
          { label: 'UI', value: 'Fast', tone: 'neutral' },
          { label: 'Focus', value: 'Legibility', tone: 'info' },
          { label: 'Notes', value: 'Explainable metrics', tone: 'neutral' },
        ],
      },
    ],
    [github],
  )

  const [buildCaseId, setBuildCaseId] = useState(buildLogCases[0]?.id ?? 'exp-dawson-incoming')
  const buildCase = useMemo(
    () => buildLogCases.find((c) => c.id === buildCaseId) ?? buildLogCases[0]!,
    [buildCaseId, buildLogCases],
  )
  const [artifactIndex, setArtifactIndex] = useState(0)
  const artifact = buildCase.artifacts[artifactIndex] ?? buildCase.artifacts[0]

  const motionIn = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
      }

  const paletteItems: PaletteItem[] = useMemo(() => {
    const openFile = (id: FileId) => {
      setActive(id)
    }
    return [
      {
        id: 'open-readme',
        title: 'Open README',
        subtitle: 'portfolio/README.md',
        group: 'Files',
        hotkey: 'Enter',
        run: () => openFile('README.md'),
      },
      { id: 'open-about', title: 'Open About', subtitle: 'portfolio/about.md', group: 'Files', run: () => openFile('about.md') },
      { id: 'open-projects', title: 'Open Projects', subtitle: 'portfolio/projects.ts', group: 'Files', run: () => openFile('projects.ts') },
      { id: 'open-skills', title: 'Open Skills', subtitle: 'profile/skills.json', group: 'Files', run: () => openFile('skills.json') },
      { id: 'open-education', title: 'Open Education', subtitle: 'profile/education.md', group: 'Files', run: () => openFile('education.md') },
      { id: 'open-contact', title: 'Open Contact', subtitle: 'profile/contact.sh', group: 'Files', run: () => openFile('contact.sh') },
      {
        id: 'open-github',
        title: 'Open GitHub',
        subtitle: github,
        group: 'Links',
        run: () => window.open(github, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'open-linkedin',
        title: 'Open LinkedIn',
        subtitle: linkedin,
        group: 'Links',
        run: () => window.open(linkedin, '_blank', 'noopener,noreferrer'),
      },
      {
        id: 'email',
        title: 'Email Romin',
        subtitle: email,
        group: 'Links',
        run: () => (window.location.href = `mailto:${email}`),
      },
      {
        id: 'back-landing',
        title: 'Back to Landing',
        subtitle: 'Home',
        group: 'View',
        run: () => {
          setNameDone(false)
          setRightReady(false)
          setView('landing')
        },
      },
    ]
  }, [email, github, linkedin])

  const filteredPalette = useMemo(() => {
    const q = paletteQuery.trim().toLowerCase()
    const base = q
      ? paletteItems.filter((x) => {
          const hay = `${x.title} ${x.subtitle ?? ''} ${x.group ?? ''}`.toLowerCase()
          return hay.includes(q)
        })
      : paletteItems
    return base.slice(0, 12)
  }, [paletteItems, paletteQuery])

  useEffect(() => {
    if (view !== 'ide') return
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k'
      const openCombo = isK && (e.metaKey || e.ctrlKey)
      if (openCombo) {
        e.preventDefault()
        setPaletteOpen(true)
        setPaletteIndex(0)
        window.setTimeout(() => paletteInputRef.current?.focus(), 0)
        return
      }
      if (!paletteOpen) return
      if (e.key === 'Escape') {
        setPaletteOpen(false)
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setPaletteIndex((i) => Math.min(filteredPalette.length - 1, i + 1))
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setPaletteIndex((i) => Math.max(0, i - 1))
        return
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const item = filteredPalette[paletteIndex]
        if (item) item.run()
        return
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [filteredPalette, paletteIndex, paletteOpen, view])

  // Command palette controls live in state + effects above

  return (
    <div className="min-h-dvh bg-aurora">
      <div className="pointer-events-none absolute inset-0 bg-grid" />
      <Grain />

      {/* sticky resume button — recruiter only */}
      <AnimatePresence>
        {visitorRole === 'recruiter' && !loading && (
          <motion.a
            href="/resume/resume.pdf"
            target="_blank"
            rel="noreferrer"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-5 right-6 z-40 group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[13px] font-[600] text-[#09090b] shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-opacity hover:opacity-90"
          >
            View Resume
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </motion.a>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {view === 'landing' ? (
          <motion.div
            key="landing"
            initial={false}
            exit={{ opacity: 0, y: -10, transition: { duration: 0.4 } }}
          >
            {/* ── hero section ── */}
            <div className="relative mx-auto flex min-h-dvh max-w-[1680px] items-stretch px-6 py-10 md:items-center md:py-12">
            <div className="w-full">
              <div className="grid items-center gap-8 md:mx-auto md:max-w-7xl md:grid-cols-[minmax(0,480px)_minmax(0,1fr)] md:justify-center md:gap-10 lg:grid-cols-[minmax(0,520px)_minmax(0,740px)] lg:gap-14">
                <motion.div
                  className="min-w-0 max-w-full"
                  initial={{ opacity: 0, x: -60 }}
                  animate={loading ? { opacity: 0, x: -60 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >

                  <div className="mt-8 flex min-w-0 items-center gap-4 sm:gap-5">
                    <div className="relative shrink-0">
                      <div
                        className="pointer-events-none absolute inset-[-8px] rounded-full opacity-30"
                        style={{
                          background: 'radial-gradient(circle, rgba(var(--accent-a),0.55) 0%, rgba(var(--accent-b),0.30) 55%, transparent 80%)',
                          filter: 'blur(10px)',
                        }}
                      />
                      <Avatar
                        src={avatarSrc}
                        alt={`${name} portrait`}
                        fallback={initials}
                        size="clamp(90px, 14vw, 120px)"
                      />
                    </div>
                    <h1 className="min-w-0 flex-1 whitespace-nowrap text-[clamp(2.2rem,6vw,3.5rem)] font-[650] leading-[1.05] tracking-[-0.03em] text-[rgb(var(--fg))]">
                      <span className={!reduceMotion ? 'typing-caret' : undefined}>
                        <TypingName
                          text={name}
                          enabled={!loading && !reduceMotion && view === 'landing'}
                          msPerChar={85}
                          onDone={() => {
                            setNameDone(true)
                            if (reduceMotion) {
                              setRightReady(true)
                              return
                            }
                            window.setTimeout(() => setRightReady(true), 1800)
                          }}
                        />
                      </span>
                    </h1>
                  </div>
                  <p className="mt-4 overflow-hidden whitespace-nowrap text-base leading-relaxed text-[rgba(var(--fg),0.74)]">
                    <span
                      className={
                        reduceMotion
                          ? undefined
                          : nameDone
                            ? 'fx-tagline fx-tagline-reveal'
                            : 'opacity-0'
                      }
                    >
                      {tagline}
                    </span>
                  </p>

                  {/* ── buttons ── */}
                  <div className="mt-6 flex items-center gap-2 overflow-x-auto">
                    <button
                      type="button"
                      onClick={() => { window.location.href = `mailto:${email}` }}
                      className="fx-sheen group shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0a0a0e] transition hover:opacity-90 shadow-[0_0_24px_rgba(255,255,255,0.15),0_4px_16px_rgba(0,0,0,0.3)]"
                    >
                      Email me
                      <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </button>
                    <a
                      href={github}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--card),0.6)] px-4 py-2.5 text-sm font-medium text-[rgba(var(--fg),0.82)] backdrop-blur transition hover:border-[rgba(var(--ring),0.5)] hover:shadow-[0_2px_16px_rgba(var(--accent-b),0.12)]"
                    >
                      GitHub <GitBranch className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[rgb(var(--border))] bg-[rgba(var(--card),0.6)] px-4 py-2.5 text-sm font-medium text-[rgba(var(--fg),0.82)] backdrop-blur transition hover:border-[rgba(var(--ring),0.5)] hover:shadow-[0_2px_16px_rgba(var(--accent-b),0.12)]"
                    >
                      LinkedIn <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* ── timeline cards ── */}
                  <div className="mt-6 grid grid-cols-3 gap-2.5">
                    {([
                      { label: 'Now',  text: 'Finishing Finance + CS at Laurier', date: '2022 — 2027', from: 'rgb(168,85,247)',  to: 'rgb(99,102,241)' },
                      { label: 'Next', text: 'Incoming @ Dawson Partners',        date: 'Fall 2026',   from: 'rgb(99,102,241)', to: 'rgb(34,211,238)' },
                      { label: 'Later',text: 'Seeking Full-Time in Finance & Tech',date: '2027',       from: 'rgba(var(--fg),0.25)', to: 'rgba(var(--fg),0.08)' },
                    ] as const).map(({ label, text, date, from, to }, i) => (
                      <motion.div
                        key={label}
                        initial={reduceMotion ? undefined : { opacity: 0, y: 10 }}
                        animate={reduceMotion ? undefined : { opacity: nameDone ? 1 : 0, y: nameDone ? 0 : 10 }}
                        transition={{ delay: 0.55 + i * 0.12, duration: 0.4 }}
                        className="group relative overflow-hidden rounded-2xl border border-[rgb(var(--border))] bg-[rgba(var(--card),0.55)] p-4 backdrop-blur transition-all duration-300 hover:border-[rgba(255,255,255,0.2)] hover:shadow-[0_6px_28px_rgba(255,255,255,0.07)]"
                        style={{ opacity: i === 2 ? 0.65 : 1 }}
                      >
                        {/* gradient top bar */}
                        <div className="mb-3 h-[2px] w-10 rounded-full transition-all duration-300 group-hover:w-14"
                             style={{ background: `linear-gradient(90deg, ${from}, ${to})` }} />
                        <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[rgba(var(--fg),0.4)]">{label}</div>
                        <div className="mt-1.5 text-[12px] font-medium leading-snug text-[rgba(var(--fg),0.88)]">{text}</div>
                        <div className="mt-2 font-mono text-[10px] text-[rgba(var(--fg),0.32)]">{date}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <div ref={tiltRef} className="landing-ide relative min-h-0 min-w-0 w-full max-w-[740px] justify-self-center md:justify-self-auto" style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}>
                  <AnimatePresence initial={false}>
                    {(!loading || reduceMotion) && (
                      <motion.div
                        key="landing-right"
                        className="relative w-full"
                        initial={{ opacity: 0, x: 80, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <CursorIDEMockup
                          name={name}
                          title={title}
                          tagline={tagline}
                          avatarSrc={avatarSrc}
                          initials={initials}
                          layout="with-agent"
                          enabled={!reduceMotion && view === 'landing' && rightReady}
                          onAgentDone={onAgentDone}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── scroll arrow — appears after 10s ── */}
            <ScrollArrow loading={loading} />
          </div>

            {/* below-fold sections — pointer-events blocked while scroll is locked */}
            <div style={{ pointerEvents: agentDone ? 'auto' : 'none' }}>

            {/* ── tech stack section ── */}
            <div id="skills"><SkillsSection /></div>

            {/* ── projects section ── */}
            <ProjectsSection />

            {/* ── experience section ── */}
            <ExperienceSection />

            {/* ── footer ── */}
            <footer className="relative border-t border-[rgba(255,255,255,0.06)] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(800px 400px at 20% 100%, rgba(168,85,247,0.12), transparent 60%), radial-gradient(600px 350px at 80% 0%, rgba(34,211,238,0.08), transparent 55%)' }} />

              <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr] gap-16 items-center"
                >
                  {/* left: headline + buttons */}
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.3)] mb-6">
                      Get in touch
                    </p>
                    <h2 className="text-[clamp(2.8rem,6vw,5rem)] font-[700] tracking-[-0.04em] text-white leading-[1.0] mb-6">
                      Let's work<br />together.
                    </h2>
                    <p className="text-[15px] text-[rgba(255,255,255,0.4)] max-w-md mb-12 leading-relaxed">
                      Open to full-time opportunities in Finance & Technology starting 2027. Always happy to connect.
                    </p>
                  </div>

                  {/* right: contact details */}
                  <div className="flex flex-col gap-8 md:pl-8">
                    {[
                      { label: 'Email',    value: email,                         href: `mailto:${email}` },
                      { label: 'LinkedIn', value: 'linkedin.com/in/romin-gandhi', href: linkedin          },
                      { label: 'GitHub',   value: 'github.com/RominGandhi',       href: github            },
                    ].map(({ label, value, href }) => (
                      <div key={label}>
                        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.25)] mb-1">
                          {label}
                        </p>
                        <a href={href} target={href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                          className="text-[15px] text-[rgba(255,255,255,0.6)] hover:text-white transition-colors duration-200">
                          {value}
                        </a>
                      </div>
                    ))}

                    <div className="pt-2">
                      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.25)] mb-1">
                        Availability
                      </p>
                      <div className="flex items-center gap-2">
                        <motion.span className="h-1.5 w-1.5 rounded-full bg-[#34d399]"
                          animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                        <span className="text-[15px] text-[rgba(255,255,255,0.6)]">Open to opportunities · 2027</span>
                      </div>
                    </div>
                  </div>

                </motion.div>
              </div>

              <div className="relative border-t border-[rgba(255,255,255,0.06)] px-6 py-5">
                <div className="mx-auto max-w-5xl flex items-center justify-between">
                  <p className="font-mono text-[11px] text-[rgba(255,255,255,0.2)]">
                    © {new Date().getFullYear()} Romin Gandhi. All rights reserved.
                  </p>
                  <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="font-mono text-[11px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.2)] hover:text-[rgba(255,255,255,0.5)] transition-colors duration-200"
                  >
                    Back to top ↑
                  </button>
                </div>
              </div>
            </footer>
            </div>{/* end pointer-events lock */}
          </motion.div>
        ) : (
          <motion.div
            key="ide"
            {...motionIn}
            className="mx-auto max-w-[1600px] px-3 py-4 md:px-5 md:py-5"
          >
            <div className="overflow-hidden rounded-2xl border border-[rgb(var(--ide-1))] shadow-[0_32px_80px_rgba(0,0,0,0.2)]">
              {/* Title bar */}
              <div className="flex items-center justify-between gap-3 bg-[rgb(var(--ide-3))] border-b border-[rgb(var(--ide-1))] px-4 h-10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Dot c="bg-[#e06c75]" />
                    <Dot c="bg-[#d19a66]" />
                    <Dot c="bg-[#98c379]" />
                  </div>
                  <div className="hidden md:flex items-center gap-1 text-[12px] text-[rgba(var(--fg),0.42)] font-mono">
                    <span>~/workspace</span>
                    <ChevronRight className="h-3 w-3 opacity-50" />
                    <span>build-log</span>
                  </div>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[rgba(var(--fg),0.42)]" />
                    <input
                      className="h-7 w-[240px] rounded bg-[rgb(var(--ide-2))] border border-[rgb(var(--ide-line))] pl-8 pr-3 text-[12px] text-[rgba(var(--fg),0.75)] placeholder:text-[rgba(var(--fg),0.42)] outline-none focus:border-[#64748b]/70"
                      placeholder="Search cases, artifacts…"
                      aria-label="Search"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => { setNameDone(false); setRightReady(false); setView('landing') }}
                    className="inline-flex h-7 items-center gap-1.5 rounded border border-[rgb(var(--ide-line))] bg-[rgb(var(--ide-2))] px-2.5 text-[12px] text-[rgba(var(--fg),0.75)] hover:border-[#64748b]/60 transition"
                  >
                    <LayoutGrid className="h-3.5 w-3.5" /> Landing
                  </button>
                </div>
                <div className="flex items-center gap-2 md:hidden">
                  <button type="button" onClick={() => { setNameDone(false); setRightReady(false); setView('landing') }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded border border-[rgb(var(--ide-line))] bg-[rgb(var(--ide-2))] text-[rgba(var(--fg),0.75)]">
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Ticker tape */}
              <div className="overflow-hidden border-b border-[rgb(var(--ide-1))] bg-[rgb(var(--ide-2))]">
                <div className="ticker">
                  <div className="ticker__row">
                    {Array.from({ length: 2 }).flatMap((_, rep) =>
                      tape.map((x) => (
                        <div key={`${rep}-${x.sym}`} className="ticker__item">
                          <span className="ticker__sym">{x.sym}</span>
                          <span className="ticker__px">{formatPx(x.px)}</span>
                          <span className={x.chg >= 0 ? 'ticker__chg pos' : 'ticker__chg neg'}>{formatPct(x.chg)}</span>
                          <span className="ticker__sep">•</span>
                        </div>
                      )),
                    )}
                  </div>
                </div>
              </div>

              {/* IDE body */}
              <div className="flex" style={{ minHeight: '720px' }}>
                {/* Activity bar */}
                <div className="hidden md:flex w-12 flex-col items-center bg-[rgb(var(--ide-1))] py-2 gap-0.5 shrink-0 border-r border-[rgb(var(--ide-1))]">
                  <div className="relative flex h-10 w-10 items-center justify-center text-[rgb(var(--fg))]">
                    <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-white/70" />
                    <LayoutGrid className="h-[18px] w-[18px]" />
                  </div>
                  <button className="flex h-10 w-10 items-center justify-center text-[rgba(var(--fg),0.42)] hover:text-[rgba(var(--fg),0.75)] transition" aria-label="Source Control">
                    <GitBranch className="h-[18px] w-[18px]" />
                  </button>
                  <div className="mt-auto">
                    <button className="flex h-10 w-10 items-center justify-center text-[rgba(var(--fg),0.42)] hover:text-[rgba(var(--fg),0.75)] transition" aria-label="Settings">
                      <Settings className="h-[17px] w-[17px]" />
                    </button>
                  </div>
                </div>

                {/* Explorer sidebar */}
                <aside className="hidden lg:block w-[210px] bg-[rgb(var(--ide-3))] border-r border-[rgb(var(--ide-1))] shrink-0 overflow-y-auto">
                  <div className="px-4 py-2 text-[10px] font-bold text-[rgba(var(--fg),0.7)] tracking-[0.14em] uppercase select-none border-b border-[rgb(var(--ide-1))]">
                    Explorer
                  </div>
                  <div className="py-1">
                    {/* Portfolio folder */}
                    <div className="flex items-center gap-1 px-3 py-[3px] select-none cursor-default">
                      <span className="text-[rgba(var(--fg),0.42)] text-[10px]">▾</span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[rgba(var(--fg),0.7)] ml-0.5">portfolio</span>
                    </div>
                    <div className="ml-2">
                      {(['README.md', 'about.md', 'projects.ts'] as const).map((f) => (
                        <div key={f} className="flex items-center gap-2 pl-4 pr-2 py-[3px] text-[rgba(var(--fg),0.42)] hover:bg-[rgb(var(--ide-5))] hover:text-[rgba(var(--fg),0.75)] cursor-pointer select-none rounded-sm">
                          <span className={`text-[9px] font-bold font-mono shrink-0 ${f.endsWith('.ts') ? 'text-[#94a3b8]' : 'text-[#94a3b8]'}`}>
                            {f.endsWith('.ts') ? 'TS' : 'MD'}
                          </span>
                          <span className="text-[12px]">{f}</span>
                        </div>
                      ))}
                    </div>

                    {/* Build log section */}
                    <div className="mt-2">
                      <div className="flex items-center gap-1 px-3 py-[3px] select-none cursor-default">
                        <span className="text-[rgba(var(--fg),0.42)] text-[10px]">▾</span>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[rgba(var(--fg),0.7)] ml-0.5">build-log</span>
                      </div>
                      {(['experience', 'project'] as const).map((group) => (
                        <div key={group} className="ml-2">
                          <div className="pl-4 pr-2 py-[3px] text-[9px] font-bold uppercase tracking-[0.14em] select-none text-[#64748b]">
                            {group === 'experience' ? 'Experience' : 'Projects'}
                          </div>
                          {buildLogCases.filter((c) => c.type === group).map((c) => {
                            const sel = c.id === buildCaseId
                            return (
                              <button
                                key={c.id}
                                type="button"
                                onClick={() => { setBuildCaseId(c.id); setArtifactIndex(0) }}
                                className={`flex items-center gap-2 w-full pl-5 pr-2 py-[4px] text-left text-[12px] transition-colors rounded-sm ${
                                  sel ? 'bg-[rgb(var(--ide-5))] text-[rgb(var(--fg))]' : 'text-[rgba(var(--fg),0.42)] hover:bg-[rgb(var(--ide-5))]/60 hover:text-[rgba(var(--fg),0.75)]'
                                }`}
                              >
                                <span className="text-[9px] font-bold shrink-0 text-[#64748b]">
                                  {c.type === 'project' ? '◆' : '●'}
                                </span>
                                <span className="truncate">{c.label}</span>
                              </button>
                            )
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Main editor */}
                <main className="flex-1 flex flex-col min-w-0 bg-[rgb(var(--ide-4))]">
                  {/* Tab bar */}
                  <div className="flex items-end bg-[rgb(var(--ide-3))] border-b border-[rgb(var(--ide-1))] shrink-0 overflow-x-auto">
                    <div className="flex items-stretch border-r border-[rgb(var(--ide-1))] border-t-[2px] border-t-white/70 bg-[rgb(var(--ide-4))] px-3 gap-2 h-9 shrink-0">
                      <span className="self-center text-[10px] font-bold text-[#94a3b8] font-mono">LOG</span>
                      <span className="self-center text-[12px] text-[rgba(var(--fg),0.75)] max-w-[180px] truncate">{buildCase.label}</span>
                      <button
                        type="button"
                        onClick={() => { setNameDone(false); setRightReady(false); setView('landing') }}
                        className="self-center text-[rgba(var(--fg),0.42)] hover:text-[rgba(var(--fg),0.75)] ml-0.5 text-[15px] leading-none"
                      >×</button>
                    </div>
                    <div className="flex-1" />
                  </div>

                  {/* Breadcrumb */}
                  <div className="flex items-center h-7 px-4 text-[11px] text-[rgba(var(--fg),0.42)] bg-[rgb(var(--ide-4))] border-b border-[rgb(var(--ide-2))] shrink-0 gap-1 select-none">
                    <span>workspace</span>
                    <ChevronRight className="h-3 w-3 opacity-40" />
                    <span>build-log</span>
                    <ChevronRight className="h-3 w-3 opacity-40" />
                    <span className="text-[rgba(var(--fg),0.75)]">{buildCase.label}</span>
                  </div>

                  {/* Build log content */}
                  <div className="flex-1 overflow-auto">
                    {/* Case header */}
                    <div className="px-5 py-4 border-b border-[rgb(var(--ide-line))]">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-1 text-[#94a3b8]">
                            {buildCase.type}
                          </div>
                          <div className="text-xl font-semibold text-[rgb(var(--fg))] tracking-tight">{buildCase.label}</div>
                          <div className="mt-1 text-sm text-[rgba(var(--fg),0.42)]">{buildCase.headline}</div>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {buildCase.timeframe ? <Badge tone="info">{buildCase.timeframe}</Badge> : null}
                          <Badge>{buildCase.tags.join(' · ')}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-0 opacity-25 [background:radial-gradient(900px_600px_at_var(--mx,50%)_var(--my,50%),rgba(148,163,184,0.10),transparent_55%)]" />
                      <div className="relative p-5 space-y-3">
                        {/* Sections */}
                        {buildCase.sections.map((s) => (
                          <div key={s.title} className="rounded-lg border border-[rgb(var(--ide-line))] bg-[rgb(var(--ide-3))] p-4">
                            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#94a3b8] mb-2.5">{s.title}</div>
                            <div className="space-y-2">
                              {s.bullets.map((b) => (
                                <div key={b} className="flex gap-2.5 text-[13px] text-[rgba(var(--fg),0.75)]">
                                  <span className="text-[#64748b] shrink-0 mt-[3px] text-[10px]">▸</span>
                                  <span className="text-pretty">{b}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                        {/* Run output */}
                        <div className="rounded-lg border border-[rgb(var(--ide-line))] bg-[rgb(var(--ide-3))] p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[rgba(var(--fg),0.42)]">Run Output</div>
                            <div className="text-[10px] text-[rgba(var(--fg),0.42)] font-mono">latest</div>
                          </div>
                          <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            {buildCase.runOutput.map((x) => (
                              <div
                                key={x.label}
                                className={`rounded-lg border p-3 ${
                                  x.tone === 'pos' ? 'border-[#98c379]/30 bg-[#98c379]/8' :
                                  x.tone === 'neg' ? 'border-[#e06c75]/30 bg-[#e06c75]/8' :
                                  x.tone === 'info' ? 'border-[#94a3b8]/30 bg-[#94a3b8]/8' :
                                  'border-[rgb(var(--ide-line))] bg-[rgb(var(--ide-4))]'
                                }`}
                              >
                                <div className={`text-[10px] font-bold tracking-wide mb-1 ${
                                  x.tone === 'pos' ? 'text-[#98c379]' :
                                  x.tone === 'neg' ? 'text-[#e06c75]' :
                                  x.tone === 'info' ? 'text-[#94a3b8]' :
                                  'text-[rgba(var(--fg),0.42)]'
                                }`}>{x.label.toUpperCase()}</div>
                                <div className={`text-[13px] font-semibold ${
                                  x.tone === 'pos' ? 'text-[#98c379]' :
                                  x.tone === 'neg' ? 'text-[#e06c75]' :
                                  x.tone === 'info' ? 'text-[#94a3b8]' :
                                  'text-[rgba(var(--fg),0.75)]'
                                }`}>{x.value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>

                {/* Artifacts panel */}
                <aside className="w-full lg:w-[360px] shrink-0 bg-[rgb(var(--ide-2))] border-t border-[rgb(var(--ide-1))] lg:border-t-0 lg:border-l flex flex-col overflow-hidden">
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 h-9 border-b border-[rgb(var(--ide-1))] bg-[rgb(var(--ide-3))] shrink-0">
                    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[rgba(var(--fg),0.42)]">Artifacts</div>
                    <a href={github} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-[11px] text-[rgba(var(--fg),0.42)] hover:text-[rgba(var(--fg),0.75)] transition">
                      <GitBranch className="h-3.5 w-3.5" /> GitHub
                    </a>
                  </div>

                  {/* Artifact selector tabs */}
                  <div className="flex flex-wrap gap-1 p-2 border-b border-[rgb(var(--ide-1))] bg-[rgb(var(--ide-3))] shrink-0">
                    {buildCase.artifacts.map((a, i) => {
                      const sel = i === artifactIndex
                      const kindColor = '#94a3b8'
                      return (
                        <button
                          key={`${a.kind}-${a.title}-${i}`}
                          type="button"
                          onClick={() => setArtifactIndex(i)}
                          className={`flex items-center gap-1.5 rounded px-2.5 py-1 text-[11px] transition ${
                            sel ? 'bg-[rgb(var(--ide-4))] border border-[#64748b]/40 text-[rgba(var(--fg),0.75)]'
                                : 'text-[rgba(var(--fg),0.42)] hover:text-[rgba(var(--fg),0.75)] hover:bg-[rgb(var(--ide-4))]/50'
                          }`}
                        >
                          <span className="font-mono text-[9px] font-bold" style={{ color: kindColor }}>{a.kind.toUpperCase()}</span>
                          <span className="max-w-[160px] truncate">{a.title}</span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Artifact content */}
                  <div className="flex-1 overflow-auto p-3">
                    {artifact && (
                      <>
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <div className="text-[13px] font-semibold text-[rgb(var(--fg))] truncate">{artifact.title}</div>
                            {artifact.subtitle && (
                              <div className="mt-0.5 text-[11px] text-[rgba(var(--fg),0.42)] font-mono truncate">{artifact.subtitle}</div>
                            )}
                          </div>
                          <span className="shrink-0 rounded px-2 py-0.5 text-[9px] font-bold font-mono border text-[#94a3b8] border-[#94a3b8]/30 bg-[#94a3b8]/10">
                            {artifact.kind.toUpperCase()}
                          </span>
                        </div>

                        {'takeaway' in artifact && (artifact as { takeaway?: string }).takeaway ? (
                          <div className="mb-3 rounded border border-[#64748b]/30 bg-[#64748b]/8 p-3 text-[12px] text-[rgba(var(--fg),0.75)]">
                            <span className="text-[#94a3b8] font-semibold">Takeaway: </span>{(artifact as { takeaway?: string }).takeaway}
                          </div>
                        ) : null}

                        {artifact.kind === 'sql' ? (
                          <pre className="overflow-auto rounded border border-[rgb(var(--ide-line))] bg-[rgb(var(--ide-2))] p-3 font-mono text-[11.5px] leading-5">
                            <code><SqlHighlight code={artifact.code} /></code>
                          </pre>
                        ) : artifact.kind === 'table' ? (
                          <div className="overflow-auto rounded border border-[rgb(var(--ide-line))]">
                            <table className="w-full border-collapse text-left font-mono text-[11px]">
                              <thead className="sticky top-0 bg-[rgb(var(--ide-3))]">
                                <tr>
                                  {artifact.columns.map((c) => (
                                    <th key={c} className="border-b border-[rgb(var(--ide-line))] px-3 py-2 text-[#94a3b8] font-semibold">
                                      {c}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {artifact.rows.map((r, ri) => (
                                  <tr key={ri} className={ri % 2 === 0 ? 'bg-[rgb(var(--ide-2))]' : 'bg-[rgb(var(--ide-3))]/50'}>
                                    {r.map((v, ci) => (
                                      <td key={ci} className={`border-b border-[rgb(var(--ide-line))] px-3 py-2 ${
                                        ci === 0 ? 'text-[#e2e8f0]' : typeof v === 'number' ? 'text-[#94a3b8]' : 'text-[rgba(var(--fg),0.75)]'
                                      }`}>
                                        {String(v)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : artifact.kind === 'link' ? (
                          <a
                            href={artifact.href}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 rounded border border-[#94a3b8]/30 bg-[#94a3b8]/10 px-4 py-2 text-sm text-[#94a3b8] hover:bg-[#94a3b8]/20 transition"
                          >
                            Open link <ExternalLink className="h-4 w-4" />
                          </a>
                        ) : artifact.kind === 'note' ? (
                          <pre className="overflow-auto rounded border border-[rgb(var(--ide-line))] bg-[rgb(var(--ide-2))] p-3 font-mono text-[11.5px] leading-5">
                            <code><NoteHighlight body={artifact.body} /></code>
                          </pre>
                        ) : null}
                      </>
                    )}
                  </div>
                </aside>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between h-6 bg-[rgb(var(--ide-bg))] border-t border-[rgb(var(--ide-bg))] px-3 text-[#64748b] text-[11px] shrink-0">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><GitBranch className="h-3 w-3" /> main</span>
                  <span>⚠ 0 errors</span>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  <span>{buildCase.type === 'project' ? 'TypeScript' : 'Markdown'}</span>
                  <span>UTF-8</span>
                  <span>Spaces: 2</span>
                  <span>Ln 1, Col 1</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && (
          <motion.div
            key="loading"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 z-50"
          >
            <LoadingScreen onDone={onLoadingDone} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
