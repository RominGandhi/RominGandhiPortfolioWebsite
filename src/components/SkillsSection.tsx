import { motion } from 'framer-motion'

const BASE = `${import.meta.env.BASE_URL}logos`

type Skill = { name: string; file: string }

const ALL_SKILLS: Skill[] = [
  { name: 'Python',      file: 'python.svg'      },
  { name: 'JavaScript',  file: 'javascript.svg'  },
  { name: 'TypeScript',  file: 'typescript.svg'  },
  { name: 'Java',        file: 'java.svg'        },
  { name: 'C++',         file: 'cplusplus.svg'   },
  { name: 'C#',          file: 'csharp.svg'      },
  { name: 'Swift',       file: 'swift.svg'       },
  { name: 'Ruby',        file: 'ruby.svg'        },
  { name: 'HTML',        file: 'html5.svg'       },
  { name: 'React',       file: 'react.svg'       },
  { name: 'Django',      file: 'django.svg'      },
  { name: 'Node.js',     file: 'nodejs.svg'      },
  { name: 'Astro',       file: 'astro.svg'       },
  { name: 'PyTorch',     file: 'pytorch.svg'     },
  { name: 'TensorFlow',  file: 'tensorflow.svg'  },
  { name: 'MongoDB',     file: 'mongodb.svg'     },
  { name: 'Supabase',    file: 'supabase.svg'    },
  { name: 'Prisma',      file: 'prisma.svg'      },
  { name: 'AWS',         file: 'AWS.svg'         },
  { name: 'OpenAI',      file: 'openai.svg'      },
  { name: 'Google',      file: 'google.svg'      },
  { name: 'GitHub',      file: 'github.svg'      },
  { name: 'Git',         file: 'git.svg'         },
  { name: 'Docker',      file: 'docker.svg'      },
  { name: '.NET',        file: 'dotnet.svg'      },
  { name: 'Azure',       file: 'azure.svg'       },
  { name: 'Bolt',        file: 'bolt.svg'        },
]

// hand-placed positions — naturally scattered, clear of the center-top title
const POSITIONS = [
  // top corners & edges
  { x: 3,  y: 6  }, { x: 12, y: 18 }, { x: 88, y: 5  }, { x: 78, y: 16 },
  { x: 92, y: 28 }, { x: 5,  y: 32 },
  // left column
  { x: 8,  y: 45 }, { x: 3,  y: 60 }, { x: 10, y: 73 }, { x: 6,  y: 85 },
  // right column
  { x: 85, y: 42 }, { x: 92, y: 55 }, { x: 87, y: 68 }, { x: 82, y: 82 },
  // bottom row spread
  { x: 22, y: 88 }, { x: 36, y: 82 }, { x: 50, y: 90 }, { x: 64, y: 84 }, { x: 76, y: 88 },
  // mid area (below title)
  { x: 20, y: 38 }, { x: 35, y: 52 }, { x: 50, y: 44 }, { x: 65, y: 56 },
  { x: 78, y: 38 }, { x: 25, y: 66 }, { x: 55, y: 68 }, { x: 70, y: 72 },
]

function getPos(i: number) {
  return POSITIONS[i % POSITIONS.length]!
}

export function SkillsSection() {
  return (
    <div className="relative w-full overflow-hidden border-t border-[rgba(255,255,255,0.06)]"
      style={{ minHeight: '100vh' }}>

      {/* header */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 text-center z-10 pointer-events-none">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-[rgba(255,255,255,0.3)] mb-2">
          Tech Stack
        </p>
        <h2 className="text-[2.2rem] font-[650] tracking-[-0.03em] text-white">
          Built with the right tools.
        </h2>
        <p className="mt-2 text-[15px] text-[rgba(255,255,255,0.45)]">
          Across engineering, data science, and cloud.
        </p>
      </div>

      {/* floating icons */}
      {ALL_SKILLS.map((skill, i) => {
        const { x, y }   = getPos(i)
        const size        = 52 + (i % 4) * 8          // 52–76px
        const opacity     = 0.55 + (i % 3) * 0.15     // 0.55–0.85
        const floatDur    = 3.2 + (i % 6) * 0.45
        const floatDelay  = (i % 8) * 0.38
        const floatAmt    = 8 + (i % 4) * 3

        return (
          <motion.div
            key={skill.name}
            className="absolute"
            style={{ left: `${x}%`, top: `${y}%`, opacity }}
            initial={{ opacity: 0, scale: 0.4 }}
            whileInView={{ opacity, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.04, type: 'spring', stiffness: 180, damping: 18 }}
          >
            <motion.div
              animate={{ y: [-floatAmt / 2, floatAmt / 2, -floatAmt / 2] }}
              transition={{ duration: floatDur, delay: floatDelay, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.2, opacity: 1 }}
              className="cursor-default"
              style={{ translateX: '-50%', translateY: '-50%' }}
            >
              <div
                className="flex items-center justify-center rounded-2xl border transition-all duration-300 hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.08)]"
                style={{
                  width:      size,
                  height:     size,
                  background: 'rgba(255,255,255,0.03)',
                  border:     '1px solid rgba(255,255,255,0.07)',
                  boxShadow:  '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <img
                  src={`${BASE}/${skill.file}`}
                  alt={skill.name}
                  width={size * 0.55}
                  height={size * 0.55}
                  style={{ objectFit: 'contain' }}
                  draggable={false}
                />
              </div>
            </motion.div>
          </motion.div>
        )
      })}

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,rgba(9,9,11,0.55)_100%)]" />
    </div>
  )
}
