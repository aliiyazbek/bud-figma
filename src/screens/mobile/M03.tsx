import { useState } from 'react'
import { MapPin, Navigation, Sparkles } from 'lucide-react'
import { motion } from 'motion/react'
import { MobileShell, MobileHeader } from '../../components/mobile'
import { Reveal, Badge, cx } from '../../components/ui'
import { useDerived } from '../../state/DemoContext'
import { useNav } from '../../state/NavContext'
import { DAYS, SEMESTER } from '../../data/demo'

const START = 8
const END = 15
const PX = 54
const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const dayName: Record<string, string> = { Sun: 'Sunday', Mon: 'Monday', Tue: 'Tuesday', Wed: 'Wednesday', Thu: 'Thursday' }

export default function M03() {
  const { courses, credits } = useDerived()
  const { go } = useNav()
  const [day, setDay] = useState<(typeof DAYS)[number]>('Sun')
  const today = courses.filter((c) => c.days.includes(day)).sort((a, b) => toMin(a.start) - toMin(b.start))

  return (
    <MobileShell tab="M03">
      <MobileHeader title="Weekly Schedule" subtitle={`${SEMESTER} · ${courses.length} courses · ${credits} credits`} back={false} />
      <div className="space-y-4 px-4 pb-6">
        <Reveal>
          <div className="rounded-[22px] bg-white p-3 ring-1 ring-line">
            <div className="grid grid-cols-[34px_repeat(5,1fr)] gap-1 pb-2">
              <span />
              {DAYS.map((d) => (
                <button key={d} onClick={() => setDay(d)} aria-pressed={d === day} className={cx('rounded-lg py-1 text-center text-[11.5px] font-bold transition-colors', d === day ? 'bg-navy text-white' : 'text-muted hover:bg-ivory')}>
                  {d}
                </button>
              ))}
            </div>
            <div className="relative grid grid-cols-[34px_repeat(5,1fr)] gap-1" style={{ height: (END - START) * PX }}>
              <div className="relative">
                {Array.from({ length: END - START }).map((_, i) => (
                  <span key={i} className="absolute right-1 text-[10px] text-subtle tabular-nums" style={{ top: i * PX - 6 }}>
                    {START + i}:00
                  </span>
                ))}
              </div>
              {DAYS.map((d) => (
                <div key={d} className="relative rounded-lg bg-ivory/70">
                  {Array.from({ length: END - START }).map((_, i) => (
                    <span key={i} className="absolute inset-x-0 border-t border-dashed border-line" style={{ top: i * PX }} />
                  ))}
                  {courses
                    .filter((c) => c.days.includes(d))
                    .map((c) => {
                      const top = ((toMin(c.start) - START * 60) / 60) * PX
                      const h = ((toMin(c.end) - toMin(c.start)) / 60) * PX
                      const isNew = c.code === 'CS301'
                      return (
                        <motion.div
                          key={c.code}
                          data-story={isNew && d === 'Tue' ? 'cs301-slot' : undefined}
                          initial={{ opacity: 0, scale: isNew ? 0.6 : 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: isNew ? 0.5 : 0.15, type: 'spring', stiffness: 260, damping: 22 }}
                          className={cx(
                            'absolute inset-x-0.5 overflow-hidden rounded-lg px-1.5 py-1',
                            isNew ? 'bg-crimson text-white ring-2 ring-crimson/25' : 'bg-navy text-white',
                          )}
                          style={{ top, height: h - 2 }}
                        >
                          <div className="text-[10.5px] leading-tight font-bold">{c.code}</div>
                          <div className="text-[9.5px] leading-tight text-white/70">{c.room}</div>
                          <div className="text-[9.5px] leading-tight text-white/70 tabular-nums">{c.start}</div>
                        </motion.div>
                      )
                    })}
                </div>
              ))}
            </div>
            {courses.some((c) => c.code === 'CS301') && (
              <div className="mt-2.5 flex items-center gap-2 px-1 text-[11.5px] text-muted">
                <span className="h-2.5 w-2.5 rounded-sm bg-crimson" /> Newly added: CS301 Database Systems · Tue/Thu 12:00 · E-204
              </div>
            )}
          </div>
        </Reveal>

        <Reveal i={1}>
          <div className="flex items-center justify-between px-1">
            <span className="text-[16px] font-semibold">{day === 'Sun' ? 'Today · Sunday' : dayName[day]}</span>
            <Badge tone="info">{today.length} classes</Badge>
          </div>
          <div className="mt-2.5 space-y-2">
            {today.length === 0 && <div className="rounded-2xl bg-white p-4 text-center text-[13px] text-subtle ring-1 ring-line">No classes on this day · enjoy the free time</div>}
            {today.map((c) => (
              <div key={c.code} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line">
                <span className="w-12 text-center">
                  <span className="block text-[14px] font-bold tabular-nums">{c.start}</span>
                  <span className="block text-[11px] text-subtle tabular-nums">{c.end}</span>
                </span>
                <span className="h-9 w-px bg-line" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold">{c.title}</span>
                  <span className="flex items-center gap-1 text-[12px] text-muted">
                    <MapPin size={12} /> {c.room} · {c.building}
                  </span>
                </span>
                <button onClick={() => go('M04')} aria-label={`Directions to ${c.room}`} className="flex h-9 w-9 items-center justify-center rounded-full bg-crimson-50 text-crimson">
                  <Navigation size={15} />
                </button>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-subtle">
          <Sparkles size={12} /> Synced with registration automatically
        </div>
      </div>
    </MobileShell>
  )
}
