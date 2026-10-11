import { Lock, Award, TrendingUp } from 'lucide-react'
import { motion } from 'motion/react'
import { MobileShell, MobileHeader } from '../../components/mobile'
import { Donut } from '../../components/charts'
import { Reveal, Badge, Progress, cx } from '../../components/ui'
import { useDemo } from '../../state/DemoContext'
import { student, grade } from '../../data/demo'

const spring2026 = [
  { code: 'CS250', title: 'Algorithms', grade: 'A−', pts: 3.7 },
  { code: 'CS260', title: 'Web Engineering', grade: 'A', pts: 4.0 },
  { code: 'MATH250', title: 'Discrete Mathematics', grade: 'B+', pts: 3.3 },
  { code: 'CS270', title: 'Software Testing', grade: 'A−', pts: 3.7 },
]

export default function M07() {
  const { state } = useDemo()
  const pub = state.gradesPublished
  const current = [
    { code: 'CS301', title: 'Database Systems · Midterm', published: pub, score: grade.maya },
    { code: 'CS305', title: 'Software Architecture · Quiz 1', published: false },
    { code: 'CS310', title: 'Operating Systems · Lab 1', published: false },
  ].filter((c) => state.registrationConfirmed || c.code !== 'CS301' || pub)

  return (
    <MobileShell tab="M07">
      <MobileHeader title="Academic Results" subtitle={`${student.program} · ${student.id}`} back={false} />
      <div className="space-y-4 px-4 pb-6">
        <Reveal>
          <div className="flex items-center gap-5 rounded-[24px] bg-white p-5 ring-1 ring-line">
            <Donut size={124} thickness={12} segments={[{ value: 3.62, color: 'var(--color-crimson)' }, { value: 0.38, color: 'transparent' }]}>
              <div className="text-[30px] leading-none font-bold tabular-nums">{student.gpa.toFixed(2)}</div>
              <div className="mt-1 text-[11px] text-subtle">of 4.00</div>
            </Donut>
            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <div className="text-[12px] text-subtle">Cumulative GPA</div>
                <div className="flex items-center gap-1 text-[13px] font-semibold text-success">
                  <TrendingUp size={14} /> +0.08 last term
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-[12px]">
                  <span className="text-subtle">Credits earned</span>
                  <span className="font-semibold tabular-nums">
                    {student.creditsEarned}/{student.creditsRequired}
                  </span>
                </div>
                <Progress value={(student.creditsEarned / student.creditsRequired) * 100} />
              </div>
              <Badge tone="success">Dean’s list · Spring 2026</Badge>
            </div>
          </div>
        </Reveal>

        <Reveal i={1}>
          <div className="flex items-center justify-between px-1">
            <span className="text-[16px] font-semibold">Fall 2026 · in progress</span>
            <span className="text-[11.5px] text-subtle">Published results only</span>
          </div>
          <div className="mt-2.5 space-y-2">
            {current.map((c) => (
              <div
                key={c.code}
                data-story={c.code === 'CS301' ? 'cs301-grade' : undefined}
                className={cx('flex items-center gap-3 rounded-2xl p-3.5 ring-1', c.published ? 'bg-success-50/70 ring-success/25' : 'bg-white ring-line')}
              >
                <span className={cx('flex h-10 w-10 items-center justify-center rounded-xl', c.published ? 'bg-success text-white' : 'bg-ivory text-subtle')}>
                  {c.published ? <Award size={18} /> : <Lock size={16} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[12px] font-bold text-navy">{c.code}</span>
                  <span className="block truncate text-[13.5px] font-medium">{c.title}</span>
                </span>
                {c.published ? (
                  <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: 'spring', stiffness: 300, damping: 18 }} className="text-right">
                    <span className="block text-[24px] leading-none font-bold text-success tabular-nums">{c.score}</span>
                    <span className="block text-[11px] text-muted">/ 100 · {grade.letter}</span>
                  </motion.span>
                ) : (
                  <span className="text-[11.5px] font-medium text-subtle">Awaiting publication</span>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal i={2}>
          <div className="flex items-center justify-between px-1">
            <span className="text-[16px] font-semibold">Spring 2026</span>
            <Badge tone="info">Term GPA 3.68</Badge>
          </div>
          <div className="mt-2.5 divide-y divide-line rounded-[20px] bg-white ring-1 ring-line">
            {spring2026.map((c) => (
              <div key={c.code} className="flex items-center gap-3 px-4 py-3">
                <span className="w-16 text-[12px] font-bold text-navy">{c.code}</span>
                <span className="flex-1 truncate text-[13.5px]">{c.title}</span>
                <span className="w-8 text-right text-[14px] font-bold">{c.grade}</span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </MobileShell>
  )
}
