import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

type Role = {
  company:  string
  role:     string
  division: string
  period:   string
  type:     string
  status:   'incoming' | 'active' | 'past'
}

const ROLES: Role[] = [
  {
    company:  'Lazaridis School of Business & Economics',
    role:     'Instructional Assistant',
    division: 'Financial Accounting',
    period:   'Jan 2024 – Present',
    type:     'Academia',
    status:   'active',
  },
  {
    company:  'York Region',
    role:     'Economist',
    division: 'Business Planning & Budgets',
    period:   'Jan – Apr 2025',
    type:     'Government',
    status:   'past',
  },
  {
    company:  'Dawson Partners',
    role:     'Private Equity Analyst',
    division: 'Portfolio Management',
    period:   'Sept – Dec 2025',
    type:     'Private Equity',
    status:   'past',
  },
  {
    company:  'Occasia',
    role:     'Software Engineer',
    division: 'Infrastructure',
    period:   'May – Aug 2026',
    type:     'Engineering',
    status:   'active',
  },
  {
    company:  'Dawson Partners',
    role:     'Private Equity Analyst',
    division: 'Portfolio Management',
    period:   'Fall 2026',
    type:     'Private Equity',
    status:   'incoming',
  },
]

const NOW_PCT = 80

export function ExperienceSection() {
  return (
    <div className="relative w-full border-t border-[rgba(255,255,255,0.06)] py-28 px-6 overflow-hidden">
      <div className="mx-auto max-w-5xl">

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-24"
        >
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.3)]">
            Experience
          </p>
          <h2 className="text-[2.2rem] font-[650] tracking-[-0.03em] text-white">
            Where I've worked.
          </h2>
          <p className="mt-3 text-[15px] text-[rgba(255,255,255,0.45)]">
            Not just internships. Experience.
          </p>
        </motion.div>

        {/* timeline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="overflow-x-auto"
        >
          <div className="min-w-[640px]">

          {/* above-line labels (even: 0, 2, 4) */}
          <div className="grid mb-6" style={{ gridTemplateColumns: `repeat(${ROLES.length}, 1fr)` }}>
            {ROLES.map((r, i) => (
              <div key={i} className={`flex flex-col items-center gap-1 px-1 ${i % 2 === 0 ? '' : 'invisible'}`}>
                {i % 2 === 0 && (
                  <>
                    <span className="text-center text-[13px] font-[650] leading-snug max-w-[150px] text-[rgba(255,255,255,0.85)]">
                      {r.company}
                    </span>
                    <span className="text-center text-[11px] text-[rgba(255,255,255,0.45)] leading-snug max-w-[150px]">
                      {r.role}
                    </span>
                    <span className="text-center font-mono text-[10px] text-[rgba(255,255,255,0.28)] whitespace-nowrap">
                      {r.division}
                    </span>
                    <span className="font-mono text-[10px] text-[rgba(255,255,255,0.22)] mt-0.5">
                      {r.period}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* line + nodes */}
          <div className="relative flex items-center" style={{ height: 32 }}>

            {/* base line */}
            <motion.div
              className="absolute left-0 right-0 h-px"
              style={{ top: '50%', background: 'rgba(255,255,255,0.1)', transformOrigin: 'left' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* progress line */}
            <motion.div
              className="absolute left-0 h-px"
              style={{
                top: '50%',
                width: `${NOW_PCT}%`,
                background: 'rgba(255,255,255,0.5)',
                transformOrigin: 'left',
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.3, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* NOW marker */}
            <motion.div
              className="absolute flex flex-col items-center"
              style={{ left: `${NOW_PCT}%`, top: '50%', transform: 'translate(-50%, -50%)' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.4 }}
            >
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.3)]"
                style={{ marginTop: -18 }}>
                now
              </span>
              <div className="h-3 w-px bg-[rgba(255,255,255,0.3)]" />
            </motion.div>

            {/* nodes */}
            <div className="relative w-full grid" style={{ gridTemplateColumns: `repeat(${ROLES.length}, 1fr)` }}>
              {ROLES.map((r, i) => {
                const isPast     = r.status === 'past' || r.status === 'active'
                const isIncoming = r.status === 'incoming'
                return (
                  <div key={i} className="flex items-center justify-center" style={{ height: 32 }}>
                    <div className="relative flex items-center justify-center">
                      {isIncoming && (
                        <motion.div
                          className="absolute rounded-full"
                          style={{ inset: -5, border: '1px solid rgba(255,255,255,0.35)' }}
                          animate={{ opacity: [0.5, 0.1, 0.5], scale: [1, 1.25, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                      <div
                        className="h-[14px] w-[14px] rounded-full border-2"
                        style={{
                          background:  isPast ? 'rgba(255,255,255,0.85)' : '#09090b',
                          borderColor: isPast ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* sector labels */}
          <div className="grid mt-3" style={{ gridTemplateColumns: `repeat(${ROLES.length}, 1fr)` }}>
            {ROLES.map((r, i) => (
              <div key={i} className="flex justify-center">
                <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.28)]">
                  {r.type}
                </span>
              </div>
            ))}
          </div>

          {/* below-line labels (odd: 1, 3) */}
          <div className="grid mt-6" style={{ gridTemplateColumns: `repeat(${ROLES.length}, 1fr)` }}>
            {ROLES.map((r, i) => (
              <div key={i} className={`flex flex-col items-center gap-1 px-1 ${i % 2 !== 0 ? '' : 'invisible'}`}>
                {i % 2 !== 0 && (
                  <>
                    <span className="text-center text-[13px] font-[650] leading-snug max-w-[150px] text-[rgba(255,255,255,0.85)]">
                      {r.company}
                    </span>
                    <span className="text-center text-[11px] text-[rgba(255,255,255,0.45)] leading-snug max-w-[150px]">
                      {r.role}
                    </span>
                    <span className="text-center font-mono text-[10px] text-[rgba(255,255,255,0.28)] whitespace-nowrap">
                      {r.division}
                    </span>
                    <span className="font-mono text-[10px] text-[rgba(255,255,255,0.22)] mt-0.5">
                      {r.period}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            className="mt-16 flex justify-center"
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <a
              href={`${import.meta.env.BASE_URL}resume/resume.pdf`}
              target="_blank"
              rel="noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-7 py-3 text-[14px] font-[500] text-[rgba(255,255,255,0.75)] backdrop-blur transition-all duration-200 hover:border-[rgba(255,255,255,0.25)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white"
            >
              View Resume
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          </div>{/* end min-w-[640px] */}
        </motion.div>
      </div>
    </div>
  )
}
