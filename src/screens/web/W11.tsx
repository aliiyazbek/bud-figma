import { Fragment, useState } from 'react'
import { AdminShell } from '../../components/shells'
import { Card, CardHeader, Reveal, Badge, Button, cx } from '../../components/ui'
import { MapPin, Users, Clock, Printer, BookOpen, FlaskConical, Coffee } from 'lucide-react'
import { useToast } from '../../components/toast'

type Slot = { id: string; course: string; title: string; type: 'Lecture' | 'Lab' | 'Office hours'; day: string; time: string; room: string; students: number }

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday']
const hours = ['08:00', '10:00', '12:00', '14:00']
const ends: Record<string, string> = { '08:00': '10:00', '10:00': '12:00', '12:00': '14:00', '14:00': '16:00' }

// Sample timetable. Room labels are placeholders, not verified campus locations.
const schedule: Slot[] = [
  { id: '1', course: 'ENG-301', title: 'Advanced Software Engineering', type: 'Lecture', day: 'Sunday', time: '08:00', room: 'Lecture Hall A', students: 120 },
  { id: '2', course: 'ENG-301', title: 'Software Engineering Lab', type: 'Lab', day: 'Sunday', time: '12:00', room: 'Computer Lab 4', students: 30 },
  { id: '3', course: 'ENG-405', title: 'Cloud Architecture', type: 'Lecture', day: 'Tuesday', time: '10:00', room: 'Lecture Hall B', students: 85 },
  { id: '4', course: 'ENG-301', title: 'Software Engineering Lab', type: 'Lab', day: 'Wednesday', time: '08:00', room: 'Computer Lab 4', students: 30 },
  { id: '5', course: 'ENG-405', title: 'Cloud Architecture', type: 'Lecture', day: 'Thursday', time: '10:00', room: 'Lecture Hall B', students: 85 },
  { id: '6', course: 'OFFICE', title: 'Student office hours', type: 'Office hours', day: 'Monday', time: '12:00', room: "Dean's office", students: 0 },
]

const style = {
  Lecture: { card: 'bg-navy text-white', sub: 'text-white/60', icon: BookOpen },
  Lab: { card: 'bg-navy-50 text-navy border border-navy/10', sub: 'text-navy-600', icon: FlaskConical },
  'Office hours': { card: 'bg-warning-50 text-ink border border-warning/20', sub: 'text-muted', icon: Coffee },
}

export default function W11() {
  const [selected, setSelected] = useState<Slot>(schedule[0])
  const [term, setTerm] = useState<'Fall' | 'Spring'>('Fall')
  const toast = useToast()
  const getSlot = (d: string, h: string) => schedule.find(s => s.day === d && s.time === h)
  const today = 'Sunday'
  const todays = schedule.filter(s => s.day === today)

  return (
    <AdminShell
      title="My Schedule"
      crumb="Academic / Faculty Timetable"
      user={{ name: 'Dr. Samer Halabi', role: 'Dean, Engineering & IT', initials: 'SH' }}
      actions={
        <div className="flex items-center gap-3">
          <div className="flex gap-1 rounded-xl bg-ivory p-1 text-xs font-semibold">
            {(['Fall', 'Spring'] as const).map(t => (
              <button key={t} onClick={() => setTerm(t)} className={cx('rounded-lg px-3 py-1.5', term === t ? 'bg-white text-navy shadow-card' : 'text-muted')}>
                {t} 2026
              </button>
            ))}
          </div>
          <Button variant="secondary" onClick={() => toast('Timetable exported as PDF.', 'success')}>
            <Printer size={16} /> Export
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-[1fr_320px] gap-6">
        <Reveal>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <CardHeader title="Weekly timetable" subtitle={`${term} term · Sunday to Thursday`} />
              <div className="flex gap-4 text-xs text-muted">
                {(Object.keys(style) as Slot['type'][]).map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <span className={cx('h-2.5 w-2.5 rounded-sm', style[t].card)} /> {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 grid grid-cols-[72px_repeat(5,1fr)] gap-2">
              <div />
              {days.map(d => (
                <div key={d} className={cx('rounded-lg py-2 text-center text-xs font-bold tracking-wider uppercase', d === today ? 'bg-crimson text-white' : 'text-muted')}>
                  {d.slice(0, 3)}
                </div>
              ))}
              {hours.map(h => (
                <Fragment key={h}>
                  <div className="flex flex-col items-end justify-start pt-2 pr-2 text-xs font-semibold text-subtle">
                    <span className="text-ink">{h}</span>
                    <span>{ends[h]}</span>
                  </div>
                  {days.map(d => {
                    const s = getSlot(d, h)
                    if (!s) return <div key={d + h} className="h-32 rounded-xl border border-dashed border-line/80 bg-ivory/40" />
                    const st = style[s.type]
                    return (
                      <button
                        key={d + h}
                        onClick={() => setSelected(s)}
                        className={cx(
                          'flex h-32 flex-col rounded-xl p-3 text-left transition-all hover:-translate-y-0.5 hover:shadow-card',
                          st.card,
                          selected.id === s.id && 'ring-2 ring-crimson ring-offset-2',
                        )}
                      >
                        <div className={cx('flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase', st.sub)}>
                          <st.icon size={12} /> {s.course === 'OFFICE' ? 'Office' : s.course}
                        </div>
                        <div className="mt-1.5 line-clamp-2 text-[13px] leading-snug font-semibold">{s.title}</div>
                        <div className={cx('mt-auto flex items-center gap-1 text-[11px]', st.sub)}>
                          <MapPin size={11} /> {s.room}
                        </div>
                      </button>
                    )
                  })}
                </Fragment>
              ))}
            </div>
          </Card>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal i={1}>
            <Card className="overflow-hidden">
              <div className="bg-navy p-5 text-white">
                <Badge dark tone="info">{selected.type}</Badge>
                <div className="mt-3 font-display text-lg leading-tight font-bold">{selected.title}</div>
                <div className="mt-1 text-xs text-white/60">
                  {selected.day} · {selected.time} – {ends[selected.time]}
                </div>
              </div>
              <div className="space-y-3 p-5 text-sm">
                <div className="flex items-center gap-2 text-ink">
                  <MapPin size={15} className="text-subtle" /> {selected.room}
                </div>
                {selected.students > 0 && (
                  <div className="flex items-center gap-2 text-ink">
                    <Users size={15} className="text-subtle" /> {selected.students} enrolled students
                  </div>
                )}
                <Button variant="secondary" className="mt-2 w-full" onClick={() => toast('Announcement sent to enrolled students.', 'success')}>
                  Message students
                </Button>
              </div>
            </Card>
          </Reveal>

          <Reveal i={2}>
            <Card className="p-6">
              <CardHeader title="Teaching load" subtitle="This term" />
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  ['12', 'Credit hours'],
                  ['3', 'Lectures / week'],
                  ['2', 'Labs / week'],
                  ['265', 'Students'],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-xl bg-ivory p-3">
                    <div className="font-display text-xl font-bold text-ink">{v}</div>
                    <div className="text-[11px] text-muted">{l}</div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal i={3}>
            <Card className="p-6">
              <CardHeader title="Today" subtitle={today} />
              <div className="mt-4 space-y-3">
                {todays.map(s => (
                  <div key={s.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="h-2.5 w-2.5 rounded-full bg-crimson" />
                      <span className="w-px flex-1 bg-line" />
                    </div>
                    <div className="pb-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                        <Clock size={12} /> {s.time} – {ends[s.time]}
                      </div>
                      <div className="text-sm font-medium text-ink">{s.title}</div>
                      <div className="text-xs text-muted">{s.room}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </AdminShell>
  )
}
