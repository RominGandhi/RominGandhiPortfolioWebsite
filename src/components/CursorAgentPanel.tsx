import { motion, useReducedMotion } from 'framer-motion'
import {
  ArrowUp,
  AtSign,
  ChevronDown,
  Files,
  GitBranch,
  History,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Square,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

function CursorMark({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 16.5V3.5L16 10L4 16.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StreamingText({
  text,
  enabled,
  msPerChar = 12,
  onDone,
}: {
  text: string
  enabled: boolean
  msPerChar?: number
  onDone?: () => void
}) {
  const ref = useRef<HTMLDivElement | null>(null)

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

    el.textContent = ''
    let i = 0
    let raf = 0
    const per = Math.max(8, msPerChar)
    const start = performance.now()

    const tick = (now: number) => {
      const len = Math.min(text.length, Math.floor((now - start) / per))
      if (len !== i) {
        i = len
        el.textContent = text.slice(0, len)
      }
      if (len < text.length) raf = requestAnimationFrame(tick)
      else if (!doneCalled) {
        doneCalled = true
        onDone?.()
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled, msPerChar, onDone, text])

  return <div ref={ref} className="cursor-agent__stream" />
}

function Dot({ c }: { c: string }) {
  return <span className={`cursor-ide__dot ${c}`} aria-hidden="true" />
}

export function CursorAgentPanel({
  name,
  tagline,
  title,
  enabled,
  onEnterWorkspace,
}: {
  name: string
  tagline: string
  title: string
  enabled: boolean
  onEnterWorkspace?: () => void
}) {
  const reduceMotion = useReducedMotion()
  const [phase, setPhase] = useState<'idle' | 'thinking' | 'streaming' | 'done'>('idle')
  const [streamDone, setStreamDone] = useState(false)

  const userPrompt = useMemo(
    () => `Summarize ${name} for a finance or tech recruiter in 30 seconds.`,
    [name],
  )

  const agentSummary = useMemo(
    () =>
      [
        `${name} — ${title} at Wilfrid Laurier (2027).`,
        '',
        tagline,
        '',
        'Finance — Incoming @ Dawson Partners (Fall 2026). SQL cohort work, clean memos, Excel/Python models—built for decisions under time pressure.',
        '',
        'Tech — React & TypeScript frontends, Python data pipelines, demo-ready products where engineering meets markets.',
        '',
        'Stack — Python · TypeScript · React · SQL · PyTorch · GCP/AWS.',
        '',
        'Now — Wrapping double degree. Open to full-time in finance & tech.',
      ].join('\n'),
    [name, tagline, title],
  )

  useEffect(() => {
    if (!enabled) {
      setPhase('idle')
      setStreamDone(false)
      return
    }

    if (reduceMotion) {
      setPhase('done')
      setStreamDone(true)
      return
    }

    setPhase('thinking')
    setStreamDone(false)
    const t = window.setTimeout(() => setPhase('streaming'), 650)
    return () => window.clearTimeout(t)
  }, [enabled, reduceMotion])

  const isGenerating = phase === 'thinking' || phase === 'streaming'
  const showAgentCursor = phase === 'streaming' && !streamDone

  return (
    <div className="cursor-ide" data-theme="dark">
      <motion.div
        className="cursor-ide__window"
        initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.99 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Title bar */}
        <div className="cursor-ide__titlebar">
          <div className="cursor-ide__traffic">
            <Dot c="cursor-ide__dot--close" />
            <Dot c="cursor-ide__dot--min" />
            <Dot c="cursor-ide__dot--max" />
          </div>
          <div className="cursor-ide__title">
            <CursorMark className="h-3.5 w-3.5 text-[#e4e4e7]" />
            <span>portfolio — Cursor</span>
          </div>
        </div>

        <div className="cursor-ide__body">
          {/* Activity bar */}
          <aside className="cursor-ide__activity" aria-hidden="true">
            <span className="cursor-ide__activity-item">
              <Files className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </span>
            <span className="cursor-ide__activity-item">
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </span>
            <span className="cursor-ide__activity-item">
              <GitBranch className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </span>
            <span className="cursor-ide__activity-item cursor-ide__activity-item--on">
              <MessageSquare className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </span>
          </aside>

          {/* Editor (dimmed) */}
          <div className="cursor-ide__editor" aria-hidden="true">
            <div className="cursor-ide__tabs">
              <div className="cursor-ide__tab cursor-ide__tab--active">
                <span className="cursor-ide__tab-badge">MD</span>
                README.md
              </div>
            </div>
            <div className="cursor-ide__editor-content">
              <div className="cursor-ide__line">
                <span className="cursor-ide__ln">1</span>
                <span className="text-[#569cd6]"># </span>
                {name}
              </div>
              <div className="cursor-ide__line">
                <span className="cursor-ide__ln">2</span>
              </div>
              <div className="cursor-ide__line">
                <span className="cursor-ide__ln">3</span>
                <span className="text-[#6a9955]">{'>'} </span>
                <span className="text-[#ce9178]">{tagline.slice(0, 42)}…</span>
              </div>
            </div>
          </div>

          {/* Agent sidebar */}
          <aside className="cursor-agent">
            <div className="cursor-agent__toolbar">
              <div className="cursor-agent__tabs">
                <button type="button" className="cursor-agent__tab cursor-agent__tab--on">
                  Agent
                </button>
                <button type="button" className="cursor-agent__tab" tabIndex={-1}>
                  Ask
                </button>
              </div>
              <div className="cursor-agent__toolbar-actions">
                <button type="button" className="cursor-agent__icon-btn" tabIndex={-1} aria-label="New chat">
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="cursor-agent__icon-btn" tabIndex={-1} aria-label="History">
                  <History className="h-3.5 w-3.5" />
                </button>
                <button type="button" className="cursor-agent__icon-btn" tabIndex={-1} aria-label="More">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="cursor-agent__model-row">
              <button type="button" className="cursor-agent__model" tabIndex={-1}>
                <span className="cursor-agent__model-dot" />
                cursor-fast
                <ChevronDown className="h-3 w-3 opacity-50" />
              </button>
            </div>

            <div className="cursor-agent__thread">
              <div className="cursor-agent__context">
                <span className="cursor-agent__pill">
                  <AtSign className="h-3 w-3" />
                  portfolio
                </span>
              </div>

              <div className="cursor-agent__bubble cursor-agent__bubble--user">
                <p>{userPrompt}</p>
              </div>

              <div className="cursor-agent__bubble cursor-agent__bubble--agent">
                {phase === 'idle' ? (
                  <p className="cursor-agent__placeholder">Agent ready.</p>
                ) : phase === 'thinking' ? (
                  <p className="cursor-agent__thinking">Planning next moves…</p>
                ) : (
                  <div className="cursor-agent__response">
                    <StreamingText
                      text={agentSummary}
                      enabled={phase === 'streaming' && !reduceMotion}
                      onDone={() => {
                        setStreamDone(true)
                        setPhase('done')
                      }}
                    />
                    {!reduceMotion ? (
                      <span
                        className={
                          'cursor-agent__caret' + (showAgentCursor ? '' : ' cursor-agent__caret--off')
                        }
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {isGenerating && !reduceMotion ? (
              <div className="cursor-agent__status">
                <span className="cursor-agent__status-pulse" />
                Generating
                <button type="button" className="cursor-agent__stop" tabIndex={-1} aria-label="Stop">
                  <Square className="h-2.5 w-2.5 fill-current" />
                  Stop
                </button>
              </div>
            ) : null}

            <div className="cursor-agent__composer">
              <div className="cursor-agent__input">
                <span className="cursor-agent__input-placeholder">
                  {phase === 'done' ? 'Ask a follow-up…' : 'Add a follow-up…'}
                </span>
                <button
                  type="button"
                  className={
                    'cursor-agent__send' +
                    (phase === 'done' ? ' cursor-agent__send--ready' : ' cursor-agent__send--dim')
                  }
                  tabIndex={-1}
                  aria-label="Send"
                >
                  <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
                </button>
              </div>
              <p className="cursor-agent__hint">
                <kbd>Shift</kbd>+<kbd>Tab</kbd> to switch modes
              </p>
            </div>

            {(phase === 'done' || (reduceMotion && enabled)) && onEnterWorkspace ? (
              <div className="cursor-agent__workspace-cta">
                <button type="button" className="cursor-agent__workspace-btn" onClick={onEnterWorkspace}>
                  Open full workspace →
                </button>
              </div>
            ) : null}
          </aside>
        </div>

        <div className="cursor-ide__statusbar" aria-hidden="true">
          <span>
            <GitBranch className="inline h-3 w-3 mr-1 opacity-70" />
            main
          </span>
          <span>Agent</span>
          <span>UTF-8</span>
        </div>
      </motion.div>
    </div>
  )
}
