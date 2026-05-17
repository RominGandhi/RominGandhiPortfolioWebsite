import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import {
  ArrowUp,
  Bell,
  Check,
  ChevronDown,
  Clipboard,
  Infinity,
  Paperclip,
  Search,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// ─── file system ─────────────────────────────────────────────────────────────
type FileId = 'README.md' | 'skills.json' | 'contact.sh' | 'resume.pdf'

const FILES: { id: FileId; badge: string; depth: number; folder?: string; muted?: boolean }[] = [
  { id: 'README.md',  badge: 'MD',  depth: 1, folder: 'portfolio' },
  { id: 'skills.json',badge: 'JS',  depth: 2, folder: 'profile'   },
  { id: 'contact.sh', badge: 'SH',  depth: 2, folder: 'profile'   },
  { id: 'resume.pdf', badge: 'PDF', depth: 2, folder: 'profile', muted: false },
]

type FileLine = { text: string; type: 'h1'|'h2'|'key'|'val'|'muted'|'cmd'|'str'|'plain'|'bullet'|'blank'; copyValue?: string }

const FILE_CONTENT: Record<FileId, FileLine[]> = {
  'README.md': [
    { text: '# Romin Gandhi',                              type: 'h1'    },
    { text: 'CS × Finance  ·  Wilfrid Laurier',           type: 'muted' },
    { text: '',                                            type: 'blank' },
    { text: '## Education',                               type: 'key'   },
    { text: '',                                           type: 'blank' },
    { text: 'Wilfrid Laurier University',                 type: 'key'   },
    { text: 'Waterloo, ON',                               type: 'muted' },
    { text: 'Honours BSc, Computer Science (Big Data Systems)',  type: 'str'   },
    { text: 'GPA: 3.7 / 4.0',                                   type: 'str'   },
    { text: 'Expected Aug 2027',                          type: 'muted' },
    { text: '',                                           type: 'blank' },
    { text: 'Lazaridis School of Business & Economics',   type: 'key'   },
    { text: 'Waterloo, ON',                               type: 'muted' },
    { text: 'Honours BBA, Finance',                       type: 'str'   },
    { text: 'GPA: 3.89 / 4.0',                           type: 'str'   },
    { text: 'Expected Aug 2027',                          type: 'muted' },
    { text: '',                                           type: 'blank' },
    { text: '## Extracurriculars',                        type: 'key'   },
    { text: '',                                           type: 'blank' },
    { text: 'Laurier Fintech Club',                       type: 'key'   },
    { text: 'Quantitative Analyst',                       type: 'str'   },
    { text: '',                                           type: 'blank' },
    { text: 'Laurier Trading Group',                      type: 'key'   },
    { text: 'Analyst, Commodities',                       type: 'str'   },
  ],
  'skills.json': [
    { text: '{',                                                         type: 'plain' },
    { text: '  "programming_languages": [',                             type: 'key'   },
    { text: '    "Python", "R", "Java", "C/C++",',                     type: 'str'   },
    { text: '    "MATLAB", "SQL", "HTML/CSS",',                         type: 'str'   },
    { text: '    "JavaScript", "x86 Assembly", "VBA"',                  type: 'str'   },
    { text: '  ],',                                                      type: 'plain' },
    { text: '  "frameworks_libraries": [',                              type: 'key'   },
    { text: '    "React", "Django", "Flask",',                          type: 'str'   },
    { text: '    "Numpy", "Pandas", "Matplotlib",',                     type: 'str'   },
    { text: '    "TensorFlow", "Scikit-Learn", "PyTorch", "Jira"',      type: 'str'   },
    { text: '  ],',                                                      type: 'plain' },
    { text: '  "cloud_databases": [',                                   type: 'key'   },
    { text: '    "PostgreSQL", "SQL Server", "MongoDB",',               type: 'str'   },
    { text: '    "Google Cloud Platform (GCP)",',                       type: 'str'   },
    { text: '    "Amazon Web Services (AWS)"',                          type: 'str'   },
    { text: '  ]',                                                       type: 'plain' },
    { text: '}',                                                         type: 'plain' },
  ],
  'contact.sh': [
    { text: '#!/bin/sh',                              type: 'muted' },
    { text: '',                                       type: 'blank' },
    { text: 'echo "Let\'s talk."',                   type: 'cmd'   },
    { text: '',                                       type: 'blank' },
    { text: 'echo "email:',                          type: 'cmd'   },
    { text: '  gand6363@mylaurier.ca"',              type: 'str',  copyValue: 'gand6363@mylaurier.ca' },
    { text: '',                                       type: 'blank' },
    { text: 'echo "github:',                         type: 'cmd'   },
    { text: '  github.com/RominGandhi"',             type: 'str',  copyValue: 'github.com/RominGandhi' },
    { text: '',                                       type: 'blank' },
    { text: 'echo "linkedin:',                       type: 'cmd'   },
    { text: '  in/romin-gandhi"',                    type: 'str',  copyValue: 'linkedin.com/in/romin-gandhi' },
  ],
  'resume.pdf': [],
}

// ─── agent animation ─────────────────────────────────────────────────────────
const USER_PROMPT = 'tell me more about Romin'
const AGENT_REPLY =
  `Romin Gandhi is a CS + Finance double degree student at Wilfrid Laurier (2022–2027).\n\n` +
  `Most finance students don't code. Most CS students don't model. ` +
  `He does both — building at the intersection of engineering and markets.\n\n` +
  `Incoming analyst at Dawson Partners, Fall 2026.`

const COMPOSE_MS  = 95   // slower, more human typing
const REPLY_MS    = 28   // slower agent stream
const START_DELAY = 1500 // 1.5s pause after IDE appears before typing

type Phase = 'idle' | 'composing' | 'sending' | 'thinking' | 'streaming' | 'done'

function useAgentAnimation(enabled: boolean, reduceMotion: boolean) {
  const [phase, setPhase]           = useState<Phase>('idle')
  const [composerText, setComposer] = useState('')
  const [replyCount, setReplyCount] = useState(0)
  const cancelledRef = useRef(false)
  const timersRef    = useRef<number[]>([])
  const rafRef       = useRef(0)

  useEffect(() => {
    cancelledRef.current = true
    timersRef.current.forEach(id => window.clearTimeout(id))
    timersRef.current = []
    cancelAnimationFrame(rafRef.current)

    if (!enabled) {
      setPhase('idle'); setComposer(''); setReplyCount(0); return
    }
    if (reduceMotion) {
      setPhase('done'); setComposer(''); setReplyCount(AGENT_REPLY.length); return
    }

    cancelledRef.current = false
    setPhase('idle'); setComposer(''); setReplyCount(0)

    const go = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => { if (!cancelledRef.current) fn() }, ms)
      timersRef.current.push(id)
    }

    go(() => {
      setPhase('composing')
      let i = 0
      const typeChar = () => {
        if (cancelledRef.current) return
        i++
        setComposer(USER_PROMPT.slice(0, i))
        if (i < USER_PROMPT.length) go(typeChar, COMPOSE_MS)
        else go(sendMessage, 420)
      }
      go(typeChar, COMPOSE_MS)
    }, START_DELAY)

    const sendMessage = () => {
      setPhase('sending')
      go(() => {
        setPhase('thinking'); setComposer('')
        go(() => {
          setPhase('streaming')
          let c = 0, lastT = 0
          const tick = (now: number) => {
            if (cancelledRef.current) return
            if (!lastT) lastT = now
            const elapsed = now - lastT
            const add = Math.floor(elapsed / REPLY_MS)
            if (add > 0) {
              c = Math.min(AGENT_REPLY.length, c + add)
              setReplyCount(c)
              lastT = now - (elapsed % REPLY_MS)
            }
            if (c < AGENT_REPLY.length) rafRef.current = requestAnimationFrame(tick)
            else setPhase('done')
          }
          rafRef.current = requestAnimationFrame(tick)
        }, 680)
      }, 220)
    }

    return () => {
      cancelledRef.current = true
      timersRef.current.forEach(id => window.clearTimeout(id))
      cancelAnimationFrame(rafRef.current)
    }
  }, [enabled, reduceMotion])

  return { phase, composerText, reply: AGENT_REPLY.slice(0, replyCount), sendReady: composerText.length === USER_PROMPT.length }
}

// ─── pdf viewer ──────────────────────────────────────────────────────────────
function PdfViewer() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#1e1e1e]">
      <iframe
        src="/resume.pdf"
        className="h-full w-full flex-1 border-0"
        title="Resume"
      />
    </div>
  )
}

// ─── editor ──────────────────────────────────────────────────────────────────
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }
  return (
    <button
      type="button"
      onClick={copy}
      title="Copy"
      className="ml-2 inline-flex items-center opacity-0 group-hover/line:opacity-100 transition-opacity duration-150"
      style={{ color: copied ? '#4ade80' : '#64748b' }}
    >
      {copied ? <Check size={10} /> : <Clipboard size={10} />}
    </button>
  )
}

function FileEditor({ fileId }: { fileId: FileId }) {
  const lines = FILE_CONTENT[fileId]
  const colorOf = (t: FileLine['type']) => {
    switch (t) {
      case 'h1':     return 'text-[#f1f5f9] font-bold'
      case 'h2':     return 'text-[#38bdf8] font-semibold'
      case 'key':    return 'text-[#94a3b8]'
      case 'str':    return 'text-[#e2e8f0]'
      case 'cmd':    return 'text-[#94a3b8]'
      case 'muted':  return 'text-[#475569]'
      case 'bullet': return 'text-[#94a3b8]'
      default:       return 'text-[#94a3b8]'
    }
  }
  return (
    <div className="cmock-ed">
      {lines.map((line, i) => (
        <div key={i} className="cmock-ed__line group/line">
          <span className="cmock-ed__ln">{i + 1}</span>
          <span className={`cmock-ed__code ${colorOf(line.type)}`}>{line.text || ' '}</span>
        </div>
      ))}
    </div>
  )
}

// ─── explorer ────────────────────────────────────────────────────────────────
function ExplorerTree({ active, onSelect }: { active: FileId; onSelect: (id: FileId) => void }) {
  const badgeColor: Record<string, string> = {
    MD:  'cmock-tree__badge--md',
    JS:  'cmock-tree__badge--json',
    SH:  'cmock-tree__badge--sh',
    PDF: 'cmock-tree__badge--pdf',
  }

  const folders = ['portfolio', 'profile']

  return (
    <div className="cmock-tree">
      {folders.map(folder => (
        <div key={folder}>
          <div className="cmock-tree__row" style={{ paddingLeft: 8 }}>
            <ChevronDown className="cmock-tree__chev h-3 w-3 shrink-0 opacity-60" />
            <span className="truncate text-[10px] font-bold uppercase tracking-wider text-[#858585]">{folder}</span>
          </div>
          {FILES.filter(f => f.folder === folder).map(f => (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelect(f.id)}
              className={`cmock-tree__row w-full text-left transition-colors ${active === f.id ? 'cmock-tree__row--active' : 'hover:bg-[#2a2d2e]'}`}
              style={{ paddingLeft: 8 + f.depth * 12 }}
            >
              <span className="cmock-tree__spacer" />
              <span className={`cmock-tree__badge ${badgeColor[f.badge] ?? ''}`}>{f.badge}</span>
              <span className="truncate">{f.id}</span>
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── agent panel ─────────────────────────────────────────────────────────────
function AgentPanel({ enabled, reduceMotion, onDone }: { enabled: boolean; reduceMotion: boolean; onDone?: () => void }) {
  const { phase, composerText, reply, sendReady } = useAgentAnimation(enabled, reduceMotion)

  useEffect(() => {
    if (phase === 'done') onDone?.()
  }, [phase, onDone])
  const showUserMsg = ['sending','thinking','streaming','done'].includes(phase)
  const replyLines  = reply.split('\n')

  return (
    <aside className="cmock-agent">
      <div className="cmock-agent__tabbar">
        <span className="cmock-agent__tab cmock-agent__tab--on">Chat</span>
        <button type="button" className="cmock-agent__tab-close" tabIndex={-1}><X className="h-3 w-3" /></button>
      </div>

      <div className="cmock-agent__scroll">
        {showUserMsg && (
          <div className="relative">
            {/* expanding ring */}
            <motion.div
              className="absolute inset-0 rounded-[10px_10px_2px_10px] border border-white/40"
              initial={{ scale: 1, opacity: 0.7 }}
              animate={{ scale: 2.8, opacity: 0 }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 rounded-[10px_10px_2px_10px] border border-white/25"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.9, delay: 0.12, ease: 'easeOut' }}
            />
            {/* bubble */}
            <motion.div
              className="cmock-agent__user-bubble"
              initial={{ scale: 0.3, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 16, mass: 0.7 }}
            >
              {USER_PROMPT}
            </motion.div>
          </div>
        )}
        {phase === 'thinking' && <p className="cmock-agent__thinking">thinking…</p>}
        {(phase === 'streaming' || phase === 'done') && reply.length > 0 && (
          <div className="cmock-agent__reply">
            {replyLines.map((line, i) => <span key={i}>{line}{i < replyLines.length - 1 && <br />}</span>)}
            {phase === 'streaming' && <span className="cmock-agent__caret" />}
          </div>
        )}
        {(phase === 'idle' || phase === 'composing') && (
          <p className="cmock-agent__placeholder">Ask anything about this portfolio…</p>
        )}
      </div>

      <div className="cmock-composer">
        <div className="cmock-composer__box">
          <div className="cmock-composer__input-row">
            {composerText
              ? <span className="cmock-composer__typed">{composerText}<span className="cmock-agent__caret" /></span>
              : <span className="cmock-composer__input-placeholder">Message…</span>}
            <button type="button" className={`cmock-composer__send${sendReady ? ' cmock-composer__send--ready' : ''}`} tabIndex={-1}>
              <ArrowUp className="h-3.5 w-3.5" strokeWidth={2.5} />
            </button>
          </div>
          <div className="cmock-composer__bar">
            <button type="button" className="cmock-composer__pill cmock-composer__pill--agent" tabIndex={-1}>
              <Infinity className="h-3 w-3" />Agent<ChevronDown className="h-3 w-3 opacity-60" />
            </button>
            <button type="button" className="cmock-composer__pill" tabIndex={-1}>
              Auto<ChevronDown className="h-3 w-3 opacity-60" />
            </button>
            <span className="cmock-composer__spacer" />
            <button type="button" className="cmock-composer__icon" tabIndex={-1}><Paperclip className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      </div>
    </aside>
  )
}

// ─── main export ─────────────────────────────────────────────────────────────
export type CursorIDEMockupProps = {
  name: string; title: string; tagline: string
  avatarSrc: string; initials: string; enabled: boolean
  layout?: 'ide-only' | 'with-agent'
  onEnterWorkspace?: () => void
  onAgentDone?: () => void
}

export function CursorIDEMockup({ enabled, layout = 'with-agent', onEnterWorkspace, onAgentDone }: CursorIDEMockupProps) {
  const reduceMotion = useReducedMotion() ?? false
  const showAgent    = layout === 'with-agent'
  const agentEnabled = showAgent && enabled && !reduceMotion
  const [activeFile, setActiveFile] = useState<FileId>('README.md')
  const windowCtrl = useAnimation()

  // entry animation
  useEffect(() => {
    if (!reduceMotion) {
      windowCtrl.start({ opacity: 1, scale: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } })
    }
  }, [reduceMotion, windowCtrl])

  // zoom in when the user bubble appears
  useEffect(() => {
    if (!agentEnabled) return
    const bubbleDelay = START_DELAY + COMPOSE_MS * USER_PROMPT.length + 440
    const t = window.setTimeout(() => {
      windowCtrl.start({
        scale: [1, 1.18, 0.97, 1],
        transition: { duration: 2.0, times: [0, 0.28, 0.65, 1], ease: [0.4, 0, 0.2, 1] },
      })
    }, bubbleDelay)
    return () => window.clearTimeout(t)
  }, [agentEnabled, windowCtrl])

  return (
    <div className={'cmock' + (showAgent ? '' : ' cmock--ide-only')}>
      <motion.div
        className="relative"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.88, y: 20 }}
        animate={windowCtrl}
      >
        {/* glow bloom — moves with the zoom */}
        <div
          className="pointer-events-none absolute inset-x-4 -bottom-8 top-8 rounded-3xl opacity-40 blur-3xl"
          style={{ background: 'radial-gradient(ellipse at 40% 60%, rgba(168,85,247,0.55), rgba(34,211,238,0.35) 55%, transparent 80%)' }}
        />
      <div className="cmock-window" data-theme="dark">
        {/* title bar */}
        <div className="cmock-chrome">
          <div className="cmock-traffic">
            <span className="cmock-dot cmock-dot--r" /><span className="cmock-dot cmock-dot--y" /><span className="cmock-dot cmock-dot--g" />
          </div>
          <div className="cmock-search">
            <Search className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span>portfolio</span>
          </div>
          <button type="button" className="cmock-agents-btn" tabIndex={-1}>
            Agents <span className="cmock-agents-btn__arrow">↗</span>
          </button>
        </div>

        {/* workbench */}
        <div className={'cmock-workbench' + (showAgent ? '' : ' cmock-workbench--ide-only')}>
          {showAgent && <AgentPanel enabled={agentEnabled} reduceMotion={reduceMotion} onDone={onAgentDone} />}

          {/* IDE */}
          <div className="cmock-ide">
            <aside className="cmock-explorer">
              <div className="cmock-explorer__title">EXPLORER</div>
              <ExplorerTree active={activeFile} onSelect={setActiveFile} />
            </aside>

            <div className="cmock-ide-main">
              {/* tabs */}
              <div className="cmock-ide-tabs">
                <div className="cmock-ide-tab cmock-ide-tab--on">
                  <span className={`cmock-ide-tab__badge ${
                    activeFile.endsWith('.sh') ? 'cmock-tree__badge--sh' :
                    activeFile.endsWith('.pdf') ? 'cmock-tree__badge--pdf' : ''
                  }`}>
                    {activeFile.endsWith('.md') ? 'MD' : activeFile.endsWith('.json') ? 'JS' : activeFile.endsWith('.sh') ? 'SH' : 'PDF'}
                  </span>
                  {activeFile}
                </div>
              </div>

              {/* editor / pdf viewer */}
              <div className="cmock-ide-editor" style={{ maxHeight: 'none', flex: 1 }}>
                {activeFile === 'resume.pdf' ? <PdfViewer /> : <FileEditor fileId={activeFile} />}
              </div>

              {/* terminal */}
              <div className="cmock-terminal-wrap">
                <div className="cmock-panel-tabs">
                  <span className="cmock-panel-tab cmock-panel-tab--on">Terminal</span>
                  <span className="cmock-panel-tab">Problems</span>
                </div>
                <div className="cmock-terminal cmock-terminal--compact">
                  <div className="cmock-terminal__line">
                    <span className="cmock-terminal__prompt">➜</span>
                    <span className="cmock-terminal__cmd">open {activeFile}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* status bar */}
        <div className="cmock-statusbar shrink-0">
          <div className="cmock-statusbar__left">
            <span className="cmock-statusbar__branch">⎇ main</span>
            <span className="cmock-statusbar__item">ⓧ 0</span>
            <span className="cmock-statusbar__item">⚠ 0</span>
            <span className="cmock-statusbar__item">{activeFile}</span>
          </div>
          <div className="cmock-statusbar__right">
            <Bell className="h-3 w-3 opacity-70" />
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  )
}
