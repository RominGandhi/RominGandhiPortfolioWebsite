import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

type Props = {
  email:    string
  linkedin: string
  github:   string
}

export function ContactSection({ email, linkedin, github }: Props) {
  return (
    <div className="relative w-full border-t border-[rgba(255,255,255,0.06)] py-28 px-6 overflow-hidden">

      {/* subtle aurora */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(900px 500px at 0% 100%, rgba(168,85,247,0.1), transparent 60%), radial-gradient(700px 400px at 100% 0%, rgba(34,211,238,0.07), transparent 55%)' }} />

      <div className="relative mx-auto max-w-5xl">

        {/* label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-4 font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.3)]"
        >
          Contact
        </motion.p>

        {/* headline */}
        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(2.4rem,5.5vw,4.5rem)] font-[700] tracking-[-0.04em] text-white leading-[1.0] mb-5"
        >
          Let's work<br />together.
        </motion.h2>

        {/* availability badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="inline-flex items-center gap-2 mb-12"
        >
          <motion.span
            className="h-2 w-2 rounded-full bg-[#34d399]"
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.35)]">
            Open to full-time · Finance &amp; Technology · 2027
          </span>
        </motion.div>

        {/* email — large and prominent */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.25)] mb-2">
            Email
          </p>
          <a
            href={`mailto:${email}`}
            className="group inline-flex items-center gap-3 text-[clamp(1.2rem,2.5vw,1.8rem)] font-[500] text-[rgba(255,255,255,0.75)] hover:text-white transition-colors duration-200"
          >
            {email}
            <ArrowUpRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

        {/* divider */}
        <div className="h-px w-full mb-10" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* secondary links */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex flex-wrap gap-3"
        >
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] px-6 py-2.5 text-[13px] font-[500] text-[rgba(255,255,255,0.6)] transition-all hover:border-[rgba(255,255,255,0.3)] hover:text-white"
          >
            LinkedIn
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] px-6 py-2.5 text-[13px] font-[500] text-[rgba(255,255,255,0.6)] transition-all hover:border-[rgba(255,255,255,0.3)] hover:text-white"
          >
            GitHub
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-[13px] font-[600] text-[#09090b] transition-opacity hover:opacity-90"
          >
            View Resume
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>

      </div>
    </div>
  )
}
