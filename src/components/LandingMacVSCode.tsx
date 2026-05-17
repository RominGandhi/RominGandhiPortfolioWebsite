import Editor from '@monaco-editor/react'
import { FitAddon } from '@xterm/addon-fit'
import { Terminal } from '@xterm/xterm'
import {
  Bug,
  ChevronRight,
  Files,
  GitBranch,
  LayoutGrid,
  Search,
  Settings,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import '@xterm/xterm/css/xterm.css'
import { MacBookFrame } from './MacBookFrame'

export type PortfolioFileId =
  | 'README.md'
  | 'about.md'
  | 'projects.ts'
  | 'skills.json'
  | 'education.md'
  | 'contact.sh'

const FILE_TREE: { id: PortfolioFileId; label: string; badge: string; folder?: string }[] = [
  { id: 'README.md', label: 'README.md', badge: 'MD', folder: 'portfolio' },
  { id: 'about.md', label: 'about.md', badge: 'MD', folder: 'portfolio' },
  { id: 'projects.ts', label: 'projects.ts', badge: 'TS', folder: 'portfolio' },
  { id: 'skills.json', label: 'skills.json', badge: '{}', folder: 'profile' },
  { id: 'education.md', label: 'education.md', badge: 'MD', folder: 'profile' },
  { id: 'contact.sh', label: 'contact.sh', badge: 'SH', folder: 'profile' },
]

const LANG: Record<PortfolioFileId, string> = {
  'README.md': 'markdown',
  'about.md': 'markdown',
  'projects.ts': 'typescript',
  'skills.json': 'json',
  'education.md': 'markdown',
  'contact.sh': 'shell',
}

const STATUS_LANG: Record<PortfolioFileId, string> = {
  'README.md': 'Markdown',
  'about.md': 'Markdown',
  'projects.ts': 'TypeScript',
  'skills.json': 'JSON',
  'education.md': 'Markdown',
  'contact.sh': 'Shell',
}

function langFor(file: PortfolioFileId) {
  return LANG[file] ?? 'plaintext'
}

export function LandingMacVSCode({
  files,
  initialFile = 'README.md',
  onEnterWorkspace,
}: {
  files: Record<PortfolioFileId, string>
  initialFile?: PortfolioFileId
  onEnterWorkspace?: () => void
}) {
  const [openTabs, setOpenTabs] = useState<PortfolioFileId[]>([initialFile])
  const [active, setActive] = useState<PortfolioFileId>(initialFile)
  const [contents, setContents] = useState(files)
  const [panel, setPanel] = useState<'terminal' | 'problems' | 'output'>('terminal')
  const [foldersOpen, setFoldersOpen] = useState({ portfolio: true, profile: true })

  const termRef = useRef<HTMLDivElement | null>(null)
  const xtermRef = useRef<Terminal | null>(null)
  const fitRef = useRef<FitAddon | null>(null)
  const lineRef = useRef('')

  useEffect(() => {
    setContents(files)
  }, [files])

  const openFile = useCallback((id: PortfolioFileId) => {
    setOpenTabs((t) => (t.includes(id) ? t : [...t, id]))
    setActive(id)
  }, [])

  const closeTab = useCallback(
    (id: PortfolioFileId) => {
      setOpenTabs((t) => {
        if (t.length <= 1) return t
        const next = t.filter((x) => x !== id)
        if (active === id) setActive(next[next.length - 1]!)
        return next
      })
    },
    [active],
  )

  const writePrompt = useCallback((term: Terminal) => {
    term.write('\r\n\x1b[38;2;152;195;121mromingandhi\x1b[0m\x1b[38;2;97;175;239m@MacBook-Pro\x1b[0m \x1b[38;2;198;120;221mportfolio\x1b[0m $ ')
  }, [])

  const runCommand = useCallback(
    (raw: string, term: Terminal) => {
      const cmd = raw.trim()
      if (!cmd) {
        writePrompt(term)
        return
      }

      if (cmd === 'clear') {
        term.clear()
        writePrompt(term)
        return
      }

      if (cmd === 'help') {
        term.writeln('\x1b[38;2;148;163;184mCommands:\x1b[0m')
        term.writeln('  ls              list files')
        term.writeln('  cat <file>      print file')
        term.writeln('  open resume.pdf download resume (soon)')
        term.writeln('  workspace       open full IDE')
        term.writeln('  clear           clear terminal')
        writePrompt(term)
        return
      }

      if (cmd === 'ls') {
        FILE_TREE.forEach((f) => term.writeln(`  ${f.label}`))
        writePrompt(term)
        return
      }

      if (cmd.startsWith('cat ')) {
        const name = cmd.slice(4).trim() as PortfolioFileId
        const body = contents[name]
        if (body) {
          body.split('\n').slice(0, 12).forEach((l) => term.writeln(l))
          if (body.split('\n').length > 12) term.writeln('  …')
        } else {
          term.writeln(`\x1b[38;2;224;108;117mcat: ${name}: No such file\x1b[0m`)
        }
        writePrompt(term)
        return
      }

      if (cmd === 'open resume.pdf' || cmd === 'resume') {
        term.writeln('\x1b[38;2;152;195;121m→ romin_gandhi_resume.pdf\x1b[0m \x1b[38;2;148;163;184m(coming soon)\x1b[0m')
        writePrompt(term)
        return
      }

      if (cmd === 'workspace' || cmd === 'code .') {
        onEnterWorkspace?.()
        term.writeln('\x1b[38;2;152;195;121mOpening workspace…\x1b[0m')
        writePrompt(term)
        return
      }

      term.writeln(`\x1b[38;2;224;108;117mzsh: command not found: ${cmd.split(' ')[0]}\x1b[0m`)
      writePrompt(term)
    },
    [contents, onEnterWorkspace, writePrompt],
  )

  useEffect(() => {
    const el = termRef.current
    if (!el || panel !== 'terminal') return

    const term = new Terminal({
      cursorBlink: true,
      cursorStyle: 'bar',
      fontSize: 11,
      lineHeight: 1.35,
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      theme: {
        background: '#181818',
        foreground: '#cccccc',
        cursor: '#aeafad',
        selectionBackground: '#3e4451',
      },
      scrollback: 800,
    })
    const fit = new FitAddon()
    term.loadAddon(fit)
    term.open(el)
    fit.fit()
    xtermRef.current = term
    fitRef.current = fit

    term.writeln('\x1b[38;2;148;163;184mWelcome — zsh 5.9 (portfolio)\x1b[0m')
    term.writeln('\x1b[38;2;148;163;184mTry: ls · cat README.md · workspace\x1b[0m')
    writePrompt(term)

    term.onData((data) => {
      if (data === '\r') {
        const line = lineRef.current
        lineRef.current = ''
        runCommand(line, term)
        return
      }
      if (data === '\u007f') {
        if (lineRef.current.length > 0) {
          lineRef.current = lineRef.current.slice(0, -1)
          term.write('\b \b')
        }
        return
      }
      if (data === '\u0003') {
        lineRef.current = ''
        term.write('^C')
        writePrompt(term)
        return
      }
      if (data < ' ') return
      lineRef.current += data
      term.write(data)
    })

    const ro = new ResizeObserver(() => {
      try {
        fit.fit()
      } catch {
        /* ignore */
      }
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      term.dispose()
      xtermRef.current = null
      fitRef.current = null
    }
  }, [panel, runCommand, writePrompt])

  const editorValue = contents[active] ?? ''
  const lineCount = useMemo(() => editorValue.split('\n').length, [editorValue])

  const portfolioFiles = FILE_TREE.filter((f) => f.folder === 'portfolio')
  const profileFiles = FILE_TREE.filter((f) => f.folder === 'profile')

  return (
    <div className="relative w-full" data-theme="dark">
      <MacBookFrame>
        <div className="flex h-[min(520px,62vh)] min-h-[380px] flex-col bg-[#1e1e1e]">
          <div
            className="flex h-[22px] shrink-0 items-center gap-2.5 border-b border-black bg-[#323232] px-3 text-[11px] text-white/70"
            style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif' }}
          >
            <span className="font-semibold text-white/85">Code</span>
            {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map((m) => (
              <span key={m} className="hidden lg:inline text-white/45 cursor-default">
                {m}
              </span>
            ))}
            <span className="ml-auto truncate text-[10px] text-white/30">portfolio</span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="flex min-h-0 flex-1">
            {/* Activity bar */}
            <aside className="flex w-12 shrink-0 flex-col items-center border-r border-[#252526] bg-[#181818] py-1">
              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center text-white"
                aria-label="Explorer"
              >
                <span className="absolute left-0 top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-r bg-white" />
                <Files className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center text-white/40 hover:text-white/70 transition"
                aria-label="Search"
              >
                <Search className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center text-white/40 hover:text-white/70 transition"
                aria-label="Source Control"
              >
                <GitBranch className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center text-white/40 hover:text-white/70 transition"
                aria-label="Run and Debug"
              >
                <Bug className="h-[22px] w-[22px]" strokeWidth={1.5} />
              </button>
              <div className="mt-auto flex flex-col">
                <button
                  type="button"
                  onClick={onEnterWorkspace}
                  className="flex h-11 w-11 items-center justify-center text-white/40 hover:text-white/70 transition"
                  aria-label="Enter full workspace"
                  title="Enter Workspace"
                >
                  <LayoutGrid className="h-[20px] w-[20px]" strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  className="flex h-11 w-11 items-center justify-center text-white/40 hover:text-white/70 transition"
                  aria-label="Settings"
                >
                  <Settings className="h-[20px] w-[20px]" strokeWidth={1.5} />
                </button>
              </div>
            </aside>

            {/* Explorer */}
            <aside className="hidden w-[200px] shrink-0 flex-col border-r border-[#252526] bg-[#252526] sm:flex">
              <div className="px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-white/50">
                Explorer
              </div>
              <div className="flex-1 overflow-y-auto px-1 pb-2 text-[13px]">
                {(['portfolio', 'profile'] as const).map((folder) => {
                  const items = folder === 'portfolio' ? portfolioFiles : profileFiles
                  const open = foldersOpen[folder]
                  return (
                    <div key={folder} className="mb-0.5">
                      <button
                        type="button"
                        onClick={() => setFoldersOpen((f) => ({ ...f, [folder]: !f[folder] }))}
                        className="flex w-full items-center gap-1 rounded px-2 py-0.5 text-left text-white/80 hover:bg-white/5"
                      >
                        <span className="text-[10px] text-white/40 w-3">{open ? '▾' : '▸'}</span>
                        <span className="font-semibold uppercase text-[11px] tracking-wide">{folder}</span>
                      </button>
                      {open
                        ? items.map((f) => {
                            const sel = active === f.id
                            return (
                              <button
                                key={f.id}
                                type="button"
                                onClick={() => openFile(f.id)}
                                className={`flex w-full items-center gap-2 rounded py-[3px] pl-6 pr-2 text-left transition ${
                                  sel ? 'bg-[#37373d] text-white' : 'text-white/55 hover:bg-white/5 hover:text-white/80'
                                }`}
                              >
                                <span className="w-5 shrink-0 text-center font-mono text-[9px] font-bold text-[#519aba]">
                                  {f.badge}
                                </span>
                                <span className="truncate">{f.label}</span>
                              </button>
                            )
                          })
                        : null}
                    </div>
                  )
                })}
              </div>
            </aside>

            {/* Editor + panel */}
            <main className="flex min-w-0 flex-1 flex-col bg-[#1e1e1e]">
              {/* Tabs */}
              <div className="flex shrink-0 items-end overflow-x-auto border-b border-[#252526] bg-[#252526]">
                {openTabs.map((id) => {
                  const sel = id === active
                  const meta = FILE_TREE.find((f) => f.id === id)!
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setActive(id)}
                      className={`group flex h-9 shrink-0 items-center gap-2 border-r border-[#252526] px-3 text-[12px] transition ${
                        sel
                          ? 'border-t-2 border-t-[#007acc] bg-[#1e1e1e] text-white/90'
                          : 'bg-[#2d2d2d] text-white/45 hover:bg-[#1e1e1e]/60 hover:text-white/70'
                      }`}
                    >
                      <span className="font-mono text-[10px] font-bold text-[#519aba]">{meta.badge}</span>
                      <span>{meta.label}</span>
                      {openTabs.length > 1 ? (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation()
                            closeTab(id)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.stopPropagation()
                              closeTab(id)
                            }
                          }}
                          className="ml-0.5 rounded p-0.5 opacity-0 group-hover:opacity-100 hover:bg-white/10"
                          aria-label={`Close ${id}`}
                        >
                          <X className="h-3 w-3" />
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>

              {/* Breadcrumb */}
              <div className="flex h-6 shrink-0 items-center gap-1 border-b border-[#252526] px-3 text-[11px] text-white/40">
                <span>portfolio</span>
                <ChevronRight className="h-3 w-3 opacity-40" />
                <span className="text-white/70">{active}</span>
              </div>

              {/* Monaco */}
              <div className="min-h-0 flex-1">
                <Editor
                  height="100%"
                  language={langFor(active)}
                  value={editorValue}
                  theme="vs-dark"
                  onChange={(v) => setContents((c) => ({ ...c, [active]: v ?? '' }))}
                  options={{
                    minimap: { enabled: false },
                    links: false,
                    fontSize: 12,
                    lineHeight: 18,
                    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
                    padding: { top: 10 },
                    scrollBeyondLastLine: false,
                    wordWrap: 'on',
                    renderLineHighlight: 'line',
                    smoothScrolling: true,
                    automaticLayout: true,
                    tabSize: 2,
                    scrollbar: {
                      verticalScrollbarSize: 8,
                      horizontalScrollbarSize: 8,
                    },
                  }}
                />
              </div>

              {/* Bottom panel */}
              <div className="flex h-[130px] shrink-0 flex-col border-t border-[#252526] bg-[#1e1e1e]">
                <div className="flex h-9 shrink-0 items-center gap-1 border-b border-[#252526] bg-[#252526] px-2">
                  {(
                    [
                      ['terminal', 'TERMINAL'],
                      ['problems', 'PROBLEMS'],
                      ['output', 'OUTPUT'],
                    ] as const
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPanel(key)}
                      className={`px-3 py-1.5 text-[11px] font-semibold tracking-wide transition ${
                        panel === key
                          ? 'border-b-2 border-[#007acc] text-white/90'
                          : 'text-white/40 hover:text-white/65'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <div className="flex-1" />
                </div>
                <div className="min-h-0 flex-1 p-1">
                  {panel === 'terminal' ? (
                    <div ref={termRef} className="h-full w-full rounded-sm overflow-hidden" />
                  ) : panel === 'problems' ? (
                    <div className="px-3 py-2 font-mono text-[11px] text-white/45">No problems have been detected.</div>
                  ) : (
                    <div className="px-3 py-2 font-mono text-[11px] text-[#4ec9b0]">
                      [Info] Portfolio loaded. Run <span className="text-white/70">workspace</span> in terminal for build log.
                    </div>
                  )}
                </div>
              </div>
            </main>
            </div>

            {/* Status bar */}
          <div className="flex h-[22px] shrink-0 items-center justify-between bg-[#007acc] px-3 text-[11px] text-white">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" /> main
              </span>
              <span>✓ 0 errors</span>
            </div>
            <div className="flex items-center gap-3">
              <span>{STATUS_LANG[active]}</span>
              <span>UTF-8</span>
              <span>Spaces: 2</span>
              <span>
                Ln {lineCount}, Col 1
              </span>
            </div>
          </div>
          </div>
        </div>
      </MacBookFrame>
    </div>
  )
}