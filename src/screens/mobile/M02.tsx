import { AlertTriangle, CheckCircle2, Clock, MapPin, Users, Lightbulb, ArrowRight, CalendarDays, Receipt, BookOpen } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { MobileShell, MobileHeader } from '../../components/mobile'
import { Reveal, Badge, Button, Progress, cx } from '../../components/ui'
import { useDemo, useDerived } from '../../state/DemoContext'
import { useNav } from '../../state/NavContext'
import { cs301, otherOfferings, SEMESTER } from '../../data/demo'

export default function M02() {
  const { state, dispatch } = useDemo()
  const { credits, courses, invoice } = useDerived()
  const { go } = useNav()
  const sel = state.cs301Section
  const done = state.registrationConfirmed

  return (
    <MobileShell tab="M02">
      <MobileHeader title="Course Registration" subtitle={`${SEMESTER} · Add/drop open until 20 Sep`} />
      <div className="space-y-4 px-4 pb-28">
        <Reveal>
          <div className="rounded-[20px] bg-white p-4 ring-1 ring-line">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-[12px] font-medium whitespace-nowrap text-subtle">Credit hours</div>
                <div className="mt-0.5 text-[26px] leading-none font-bold tabular-nums">
                  {credits}
                  <span className="text-[15px] font-medium text-subtle"> / 18 max</span>
                </div>
              </div>
              <div className="flex max-w-[210px] flex-wrap justify-end gap-1">
                {courses.map((c) => (
                  <span key={c.code} className={cx('rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold', c.code === 'CS301' ? 'bg-success-50 text-success' : 'bg-navy-50 text-navy')}>
                    {c.code}
                  </span>
                ))}
              </div>
            </div>
            <Progress className="mt-3" value={(credits / 18) * 100} tone={done ? 'success' : 'navy'} />
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <div className="rounded-[22px] bg-success-50 p-5 ring-1 ring-success/20" data-story="reg-success">
                <div className="flex items-center gap-3">
                  <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }} className="flex h-11 w-11 items-center justify-center rounded-full bg-success text-white">
                    <CheckCircle2 size={22} />
                  </motion.span>
                  <div>
                    <div className="text-[16px] font-bold text-success">You’re registered</div>
                    <div className="text-[13px] text-ink">CS301 Database Systems · Section B</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[12.5px]">
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-subtle">Schedule</div>
                    <div className="font-semibold">Tue/Thu 12:00</div>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <div className="text-subtle">New invoice total</div>
                    <div className="font-semibold tabular-nums">${invoice.total.toLocaleString()}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <Button variant="secondary" size="lg" onClick={() => go('M03')}>
                  <CalendarDays size={16} /> Schedule
                </Button>
                <Button variant="secondary" size="lg" onClick={() => go('M06')}>
                  <Receipt size={16} /> Invoice
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="pick" exit={{ opacity: 0 }} className="space-y-3">
              <Reveal i={1}>
                <div className="rounded-[22px] bg-white p-4 ring-1 ring-line">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[12px] font-semibold text-crimson">CS301 · 3 credits</div>
                      <div className="text-[18px] font-bold tracking-tight">{cs301.title}</div>
                      <div className="text-[12.5px] text-muted">{cs301.instructor}</div>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy">
                      <BookOpen size={18} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-success-50 px-3 py-2 text-[12px] font-medium text-success">
                    <CheckCircle2 size={14} /> Prerequisite met · {cs301.prerequisite}
                  </div>
                  <div className="mt-3 text-[12px] font-semibold text-subtle">Choose a section</div>
                  <div className="mt-2 space-y-2">
                    {(['A', 'B'] as const).map((k) => {
                      const s = cs301.sections[k]
                      const active = sel === k
                      const conflict = k === 'A'
                      return (
                        <button
                          key={k}
                          data-story={`cs301-${k.toLowerCase()}`}
                          onClick={() => dispatch({ type: k === 'A' ? 'selectConflict' : 'selectAlternative' })}
                          aria-pressed={active}
                          className={cx(
                            'flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-crimson',
                            active ? (conflict ? 'border-crimson bg-crimson-50/60' : 'border-navy bg-navy-50/60') : 'border-line bg-white',
                          )}
                        >
                          <span className={cx('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', active ? (conflict ? 'border-crimson' : 'border-navy') : 'border-mist')}>
                            {active && <span className={cx('h-2.5 w-2.5 rounded-full', conflict ? 'bg-crimson' : 'bg-navy')} />}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center justify-between">
                              <span className="text-[14px] font-bold">Section {k}</span>
                              <span className="flex items-center gap-1 text-[11.5px] text-subtle">
                                <Users size={12} /> {s.seats} seats left
                              </span>
                            </span>
                            <span className="mt-0.5 flex items-center gap-3 text-[12.5px] text-muted">
                              <span className="flex items-center gap-1 tabular-nums">
                                <Clock size={12} /> {s.days.join('/')} {s.start}–{s.end}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={12} /> {s.room}
                              </span>
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <AnimatePresence>
                    {sel === 'A' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-3 rounded-2xl bg-crimson-50 p-3.5 ring-1 ring-crimson/20" role="alert" data-story="conflict">
                          <div className="flex items-center gap-2 text-[13.5px] font-bold text-crimson">
                            <AlertTriangle size={16} /> Time conflict
                          </div>
                          <div className="mt-1 text-[12.5px] leading-snug text-ink">
                            Section A overlaps with <span className="font-semibold">CS305 Software Architecture</span> · Mon/Wed 10:00–11:30.
                          </div>
                          <div className="mt-2.5 flex items-start gap-2 rounded-xl bg-white p-2.5 text-[12.5px]">
                            <Lightbulb size={15} className="mt-px shrink-0 text-warning" />
                            <span className="flex-1">
                              <span className="font-semibold">Section B fits your week</span> · Tue/Thu 12:00–13:30, E-204
                            </span>
                          </div>
                          <Button variant="secondary" size="sm" className="mt-2.5 w-full" onClick={() => dispatch({ type: 'selectAlternative' })}>
                            Switch to Section B <ArrowRight size={13} />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                    {sel === 'B' && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-success-50 p-3 text-[12.5px] font-medium text-success ring-1 ring-success/20">
                          <CheckCircle2 size={15} /> No conflicts · total becomes 15 credit hours
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
              <Reveal i={2}>
                <div className="px-1 text-[13px] font-semibold text-subtle">Other offerings</div>
                <div className="mt-2 space-y-2">
                  {otherOfferings.map((o) => (
                    <div key={o.code} className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-line">
                      <span className="w-14 text-[12px] font-bold text-navy">{o.code}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-semibold">{o.title}</span>
                        <span className="block text-[11.5px] text-muted tabular-nums">{o.slot}</span>
                      </span>
                      {o.seats === 0 ? <Badge tone="danger">Full</Badge> : <Badge>{o.seats} seats</Badge>}
                    </div>
                  ))}
                </div>
              </Reveal>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {!done && (
        <div className="absolute inset-x-0 bottom-[86px] z-20 border-t border-line bg-white/95 px-4 py-3 backdrop-blur">
          <Button size="lg" className="w-full" disabled={sel !== 'B'} story="confirm-reg" onClick={() => dispatch({ type: 'confirmRegistration' })}>
            {sel === 'A' ? 'Resolve the conflict to continue' : sel === 'B' ? 'Confirm registration · Section B' : 'Select a section'}
          </Button>
        </div>
      )}
    </MobileShell>
  )
}
