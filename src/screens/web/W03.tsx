import type { ReactNode } from 'react'
import { Users, GraduationCap, LayoutGrid, Inbox, ArrowRightLeft, FileText, UserMinus, BookPlus, ChevronRight } from 'lucide-react'
import { AdminShell } from '../../components/shells'
import { Card, CardHeader, Reveal, Badge, Progress, CountUp, cx } from '../../components/ui'
import { BarChart, LineChart } from '../../components/charts'
import { useDemo } from '../../state/DemoContext'
import { useNav } from '../../state/NavContext'

export default function W03() {
  const { state } = useDemo()
  const { go } = useNav()
  const b = state.registrationConfirmed ? 30 : 29
  const sections = [
    { code: 'CS301', title: 'Database Systems', sec: 'A', inst: 'Dr. Omar Nasser', slot: 'Mon/Wed 10:00', en: 36, cap: 40 },
    { code: 'CS301', title: 'Database Systems', sec: 'B', inst: 'Dr. Omar Nasser', slot: 'Tue/Thu 12:00', en: b, cap: 40, live: state.registrationConfirmed },
    { code: 'CS305', title: 'Software Architecture', sec: 'A', inst: 'Dr. Lina Saleh', slot: 'Mon/Wed 10:00', en: 38, cap: 40 },
    { code: 'CS310', title: 'Operating Systems', sec: 'A', inst: 'Dr. Rami Khoury', slot: 'Sun/Tue 08:30', en: 40, cap: 40 },
    { code: 'CS320', title: 'Computer Networks', sec: 'A', inst: 'Dr. Fadi Younes', slot: 'Sun/Tue 12:00', en: 42, cap: 40 },
    { code: 'EE210', title: 'Circuit Analysis', sec: 'B', inst: 'Dr. Nour Khalil', slot: 'Mon/Wed 08:30', en: 21, cap: 45 },
    { code: 'CS330', title: 'Human–Computer Interaction', sec: 'A', inst: 'Ms. Rasha Darwish', slot: 'Thu 14:00', en: 28, cap: 35 },
  ]
  const requests = [
    ...(state.transcript !== 'none'
      ? [{ icon: <FileText size={16} />, title: 'Academic transcript', who: 'Maya Haddad · BUD-2024-0187', when: 'Just now', status: state.transcript === 'ready' ? 'Issued' : 'Processing', tone: state.transcript === 'ready' ? 'success' : 'warning' } as const]
      : []),
    { icon: <ArrowRightLeft size={16} />, title: 'Section change · CS320', who: 'Omar Sabbagh · BUD-2023-0412', when: '12 min ago', status: 'New', tone: 'info' } as const,
    { icon: <BookPlus size={16} />, title: 'Overload request · 21 credits', who: 'Lea Tawil · BUD-2022-0098', when: '38 min ago', status: 'Advisor review', tone: 'warning' } as const,
    { icon: <UserMinus size={16} />, title: 'Course withdrawal · EE210', who: 'Karim Issa · BUD-2024-0233', when: '1 h ago', status: 'New', tone: 'info' } as const,
    { icon: <FileText size={16} />, title: 'Enrollment certificate', who: 'Rana Hamwi · BUD-2025-0017', when: '2 h ago', status: 'Issued', tone: 'success' } as const,
  ].slice(0, 5)

  return (
    <AdminShell title="Faculty of Engineering & IT" crumb="Academic · Faculty Operations">
      <div className="flex h-full flex-col gap-6">
        <div className="grid grid-cols-4 gap-5">
          <Stat i={0} icon={<Users size={18} />} label="Enrolled students" value={<CountUp value={1860} from={0} />} note="Software, Computer, Electrical, Civil" />
          <Stat i={1} icon={<GraduationCap size={18} />} label="Faculty average GPA" value={<CountUp value={3.14} from={0} decimals={2} />} note="University average 3.08" />
          <Stat i={2} icon={<LayoutGrid size={18} />} label="Section occupancy" value={<CountUp value={88} from={0} suffix="%" />} note="128 sections · 9 at capacity" />
          <Stat i={3} icon={<Inbox size={18} />} label="Open academic requests" value={<CountUp value={state.transcript === 'processing' ? 24 : 23} from={0} />} note="Median response 6 h" />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[1.45fr_1fr] gap-6">
          <Reveal i={4} className="min-h-0">
            <Card className="h-full p-7">
              <CardHeader title="Section occupancy" subtitle="Live seat counts from the registration system" action={<Badge tone="info">Computer & Software Eng.</Badge>} />
              <table className="mt-5 w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-[11px] font-semibold tracking-wider text-subtle uppercase">
                    <th className="pb-3 font-semibold">Course</th>
                    <th className="pb-3 font-semibold">Sec.</th>
                    <th className="pb-3 font-semibold">Instructor</th>
                    <th className="pb-3 font-semibold">Time</th>
                    <th className="w-[220px] pb-3 font-semibold">Seats</th>
                    <th className="pb-3 text-right font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sections.map((s) => {
                    const pct = Math.round((s.en / s.cap) * 100)
                    const status = s.en > s.cap ? ['Over capacity', 'danger'] : s.en === s.cap ? ['Full', 'warning'] : pct < 50 ? ['Under-filled', 'neutral'] : ['Open', 'success']
                    return (
                      <tr key={s.code + s.sec} className={cx('border-b border-line/70', s.live && 'bg-success-50/50')}>
                        <td className="py-3.5">
                          <div className="font-semibold text-ink">{s.code}</div>
                          <div className="text-xs text-muted">{s.title}</div>
                        </td>
                        <td className="py-3.5 font-medium">{s.sec}</td>
                        <td className="py-3.5 text-muted">{s.inst}</td>
                        <td className="py-3.5 text-muted tabular-nums">{s.slot}</td>
                        <td className="py-3.5 pr-6">
                          <div className="flex items-center gap-3">
                            <Progress value={Math.min(pct, 100)} tone={s.en > s.cap ? 'crimson' : s.en === s.cap ? 'warning' : 'navy'} />
                            <span className="w-12 text-xs font-medium tabular-nums">
                              {s.en}/{s.cap}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          {s.live ? (
                            <Badge tone="success">+1 just now</Badge>
                          ) : (
                            <Badge tone={status[1] as 'danger'}>{status[0]}</Badge>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </Card>
          </Reveal>
          <div className="flex min-h-0 flex-col gap-6">
            <Reveal i={5}>
              <Card className="p-7">
                <CardHeader title="Grade distribution" subtitle="Published assessments · Fall 2026 to date" />
                <div className="mt-4 flex items-end gap-6">
                  <BarChart
                    width={330}
                    height={170}
                    accentIndex={0}
                    data={[
                      { label: 'A', value: 24 },
                      { label: 'B', value: 37 },
                      { label: 'C', value: 26 },
                      { label: 'D', value: 9 },
                      { label: 'F', value: 4 },
                    ]}
                    format={(v) => `${v}%`}
                  />
                  <div>
                    <div className="text-xs text-subtle">Pass rate trend</div>
                    <LineChart width={230} height={140} min={80} max={100} gridLines={2} labels={['F24', 'S25', 'F25', 'F26']} series={[{ values: [89, 91, 92, 96], color: 'var(--color-crimson)', area: true }]} format={(v) => `${v}%`} />
                  </div>
                </div>
              </Card>
            </Reveal>
            <Reveal i={6} className="min-h-0 flex-1">
              <Card className="h-full p-7">
                <CardHeader
                  title="Academic requests"
                  subtitle="Routed automatically to the right office"
                  action={
                    <button onClick={() => go('W04')} className="flex items-center gap-1 text-xs font-semibold text-navy-600 hover:text-crimson">
                      Student 360 <ChevronRight size={14} />
                    </button>
                  }
                />
                <div className="mt-4 divide-y divide-line">
                  {requests.map((r) => (
                    <div key={r.title + r.who} className="flex items-center gap-3.5 py-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy">{r.icon}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{r.title}</div>
                        <div className="truncate text-xs text-muted">
                          {r.who} · {r.when}
                        </div>
                      </div>
                      <Badge tone={r.tone}>{r.status}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

export function Stat({ i, icon, label, value, note, accent }: { i: number; icon: ReactNode; label: string; value: ReactNode; note: ReactNode; accent?: boolean }) {
  // decorative trend line, deterministic per card
  const seed = label.length * 7 + i * 13
  const pts = Array.from({ length: 9 }, (_, k) => 30 - (k * 2.4 + Math.sin(seed + k * 1.3) * 5 + 4))
  const d = pts.map((y, k) => `${k === 0 ? 'M' : 'L'}${k * 22} ${y.toFixed(1)}`).join(' ')
  return (
    <Reveal i={i}>
      <Card className={cx('group relative h-full overflow-hidden p-6', accent && 'ring-2 ring-success/30')}>
        <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-navy via-navy-600 to-crimson opacity-80" />
        <svg viewBox="0 0 176 40" className="pointer-events-none absolute right-0 bottom-0 h-[70px] w-[46%] opacity-[0.55]" preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id={`st-${i}-${seed}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="var(--color-navy)" stopOpacity="0.14" />
              <stop offset="1" stopColor="var(--color-navy)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${d} L176 40 L0 40 Z`} fill={`url(#st-${i}-${seed})`} />
          <path d={d} fill="none" stroke="var(--color-navy-600)" strokeOpacity="0.45" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="relative flex items-center gap-2.5 text-[13px] font-semibold text-muted">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-navy-50 to-navy-100 text-navy ring-1 ring-navy/10">{icon}</span>
          {label}
        </div>
        <div className="font-display relative mt-4 text-[38px] leading-none font-bold tracking-tight text-ink tabular-nums">{value}</div>
        <div className="relative mt-2.5 text-[13px] text-muted">{note}</div>
      </Card>
    </Reveal>
  )
}
