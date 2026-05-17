import { useEffect, useRef } from 'react'

export function SequencedSkills({
  enabled,
  prog,
  frameworks,
  dbcloud,
  typeMsPerChar = 55,
  deleteMsPerChar = 28,
  holdMs = 900,
  finalHoldMs = 1800,
}: {
  enabled: boolean
  prog: string[]
  frameworks: string[]
  dbcloud: string[]
  typeMsPerChar?: number
  deleteMsPerChar?: number
  holdMs?: number
  finalHoldMs?: number
}) {
  const progRef = useRef<HTMLSpanElement | null>(null)
  const fwRef = useRef<HTMLSpanElement | null>(null)
  const dbRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    const p = progRef.current
    const f = fwRef.current
    const d = dbRef.current
    if (!p || !f || !d) return

    const P = prog.filter(Boolean)
    const F = frameworks.filter(Boolean)
    const D = dbcloud.filter(Boolean)
    if (!P.length || !F.length || !D.length) return

    let dead = false
    let raf = 0
    let t1: number | undefined
    let t2: number | undefined
    let t3: number | undefined

    const clearTimers = () => {
      if (t1) window.clearTimeout(t1)
      if (t2) window.clearTimeout(t2)
      if (t3) window.clearTimeout(t3)
      t1 = undefined
      t2 = undefined
      t3 = undefined
    }

    const replaceText = (el: HTMLSpanElement, next: string, done: () => void) => {
      const typePer = Math.max(20, typeMsPerChar)
      const delPer = Math.max(14, deleteMsPerChar)
      const current = el.textContent ?? ''

      let phase: 'del' | 'type' = current.length ? 'del' : 'type'
      let last = performance.now()
      let acc = 0
      let len = current.length

      const tick = (now: number) => {
        if (dead) return
        const dt = now - last
        last = now
        acc += dt

        if (phase === 'del') {
          while (acc >= delPer) {
            acc -= delPer
            len = Math.max(0, len - 1)
            el.textContent = current.slice(0, len)
            if (len === 0) {
              phase = 'type'
              acc = 0
              break
            }
          }
        }

        if (phase === 'type') {
          while (acc >= typePer) {
            acc -= typePer
            len = Math.min(next.length, len + 1)
            el.textContent = next.slice(0, len)
            if (len >= next.length) {
              done()
              return
            }
          }
        }

        raf = window.requestAnimationFrame(tick)
      }

      raf = window.requestAnimationFrame(tick)
    }

    let ip = 0
    let ifw = 0
    let idb = 0

    const run = () => {
      if (dead) return
      if (!enabled) {
        p.textContent = P[ip % P.length]!
        f.textContent = F[ifw % F.length]!
        d.textContent = D[idb % D.length]!
        return
      }

      replaceText(p, P[ip % P.length]!, () => {
        t1 = window.setTimeout(() => {
          if (dead) return
          replaceText(f, F[ifw % F.length]!, () => {
            t2 = window.setTimeout(() => {
              if (dead) return
              replaceText(d, D[idb % D.length]!, () => {
                t3 = window.setTimeout(() => {
                  if (dead) return
                  ip += 1
                  ifw += 1
                  idb += 1
                  run()
                }, Math.max(250, finalHoldMs))
              })
            }, Math.max(250, holdMs))
          })
        }, Math.max(250, holdMs))
      })
    }

    run()
    return () => {
      dead = true
      clearTimers()
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [dbcloud, deleteMsPerChar, enabled, finalHoldMs, frameworks, holdMs, prog, typeMsPerChar])

  return (
    <>
      <span className="text-[rgba(var(--fg),0.42)]">{'- Programming Languages: '}</span>
      <span className="text-[#86efac]" ref={progRef} />
      {'\n'}
      <span className="text-[rgba(var(--fg),0.42)]">{'- Framework & Libraries: '}</span>
      <span className="text-[#93c5fd]" ref={fwRef} />
      {'\n'}
      <span className="text-[rgba(var(--fg),0.42)]">{'- Databases/Cloud: '}</span>
      <span className="text-[#fcd34d]" ref={dbRef} />
      {'\n'}
    </>
  )
}

export function TerminalDemo({
  enabled,
  promptLeft,
  promptRight,
  cwd,
  command,
  outputLines,
  outputClasses,
}: {
  enabled: boolean
  promptLeft: string
  promptRight: string
  cwd: string
  command: string
  outputLines: string[]
  outputClasses?: string[]
}) {
  const cmdRef = useRef<HTMLSpanElement | null>(null)
  const outRef = useRef<HTMLDivElement | null>(null)
  const ranRef = useRef(false)

  useEffect(() => {
    const cmdEl = cmdRef.current
    const outEl = outRef.current
    if (!cmdEl || !outEl) return

    if (!enabled) {
      ranRef.current = false
      cmdEl.textContent = command
      outEl.innerHTML = ''
      outputLines.forEach((line) => {
        const div = document.createElement('div')
        div.textContent = line
        const cls = outputClasses?.[outputLines.indexOf(line)]
        if (cls) div.className = cls
        outEl.appendChild(div)
      })
      return
    }

    if (ranRef.current) return
    ranRef.current = true

    cmdEl.textContent = ''
    outEl.innerHTML = ''

    let dead = false
    let raf = 0
    let t1: number | undefined
    let t2: number | undefined

    const clearTimers = () => {
      if (t1) window.clearTimeout(t1)
      if (t2) window.clearTimeout(t2)
      t1 = undefined
      t2 = undefined
    }

    const typeCmd = () =>
      new Promise<void>((resolve) => {
        const per = 34
        const start = performance.now()
        const tick = (now: number) => {
          if (dead) return
          const len = Math.min(command.length, Math.floor((now - start) / per))
          cmdEl.textContent = command.slice(0, len)
          if (len < command.length) raf = window.requestAnimationFrame(tick)
          else resolve()
        }
        raf = window.requestAnimationFrame(tick)
      })

    const addLine = (text: string, delayMs: number, cls?: string) =>
      new Promise<void>((resolve) => {
        t1 = window.setTimeout(() => {
          if (dead) return
          const div = document.createElement('div')
          div.textContent = text
          if (cls) div.className = cls
          div.style.opacity = '0'
          div.style.transform = 'translateY(3px)'
          div.style.filter = 'blur(6px)'
          outEl.appendChild(div)
          window.requestAnimationFrame(() => {
            div.style.transition = 'opacity 320ms ease, transform 420ms ease, filter 420ms ease'
            div.style.opacity = '1'
            div.style.transform = 'translateY(0px)'
            div.style.filter = 'blur(0px)'
          })
          resolve()
        }, delayMs)
      })

    ;(async () => {
      await typeCmd()
      t2 = window.setTimeout(async () => {
        if (dead) return
        await addLine(outputLines[0] ?? '', 0, outputClasses?.[0])
        await addLine(outputLines[1] ?? '', 180, outputClasses?.[1])
      }, 260)
    })()

    return () => {
      dead = true
      clearTimers()
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [command, enabled, outputClasses, outputLines])

  return (
    <div className="mt-2 rounded-xl border border-[#27272a] bg-[#111113] p-2 font-mono text-[11px] leading-5 text-white/60">
      <div>
        <span className="text-white/85">{promptLeft}</span>
        <span className="text-white/30">@</span>
        <span className="text-white/60">{promptRight}</span>
        <span className="text-white/30">:</span>
        <span className="text-white/80">{cwd}</span>
        <span className="text-white/45">$</span> <span ref={cmdRef} />
        {enabled ? (
          <span
            className="inline-block align-middle term-caret"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <div ref={outRef} className="mt-1 space-y-0.5 text-white/50" />
    </div>
  )
}
