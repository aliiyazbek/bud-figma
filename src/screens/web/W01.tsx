import { ArrowUpRight, Users, GraduationCap, Wallet, LayoutGrid, Gavel, AlertTriangle, TrendingUp, ChevronRight, Clock } from 'lucide-react'
import { ExecShell } from '../../components/shells'
import { Card, CardHeader, CountUp, Reveal, Badge, Button, Progress, DemoTag, cx } from '../../components/ui'
import { LineChart, Sparkline, BarChart, Donut } from '../../components/charts'
import { useDerived, useDemo } from '../../state/DemoContext'
import { useNav } from '../../state/NavContext'
import { decision } from '../../data/demo'

const faculties = [
  { name: 'Engineering & IT', students: 1860, gpa: 3.14, occ: 88, coll: 78 },
  { name: 'Business Administration', students: 1720, gpa: 3.05, occ: 84, coll: 76 },
  { name: 'Pharmacy', students: 1140, gpa: 3.21, occ: 91, coll: 72 },
  { name: 'Architecture & Design', students: 860, gpa: 3.02, occ: 79, coll: 71 },
  { name: 'Media & Communication', students: 660, gpa: 2.94, occ: 82, coll: 74 },
]

export default function W01() {
  const { pendingDecisions } = useDerived()
  const { state } = useDemo()
  const { go } = useNav()

  const decisions = [
    { id: decision.id, title: 'Academic calendar amendment', due: 'Due today', urgent: true, done: state.decisionPublished },
    { id: 'DEC-2026-013', title: 'Tuition installment policy 2026/27', due: 'Due 16 Sep', urgent: true, done: false },
    { id: 'DEC-2026-012', title: 'New transport line — Qudsaya', due: 'Due 22 Sep', urgent: false, done: false },
    { id: 'DEC-2026-010', title: 'Research grant allocation', due: 'Due 30 Sep', urgent: false, done: false },
  ]

  return (
    <ExecShell>
      <div className="flex h-full flex-col gap-5">
        <Reveal className="flex items-end justify-between">
          <div>
            <div className="text-sm font-medium text-sky">University pulse · Week 2 of 16</div>
            <div className="mt-1 text-[34px] leading-tight font-semibold tracking-tight">Good morning, Mr. President</div>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/50">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-success-400 opacity-60" />
                <span className="relative h-2 w-2 rounded-full bg-success-400" />
              </span>
              All integrated systems in sync · 09:41
            </span>
            <DemoTag dark>Demo data</DemoTag>
          </div>
        </Reveal>

        {/* KPI row */}
        <div className="grid grid-cols-5 gap-5" data-story="kpis">
          <Kpi i={0} icon={<Users size={18} />} label="Enrolled students" value={<CountUp value={6240} from={0} />} delta="+4.2% vs Fall 2025" spark={[5410, 5530, 5620, 5760, 5850, 5990, 6080, 6240]} />
          <Kpi i={1} icon={<GraduationCap size={18} />} label="Average GPA" value={<CountUp value={3.08} from={0} decimals={2} />} delta="+0.05 vs last term" spark={[2.96, 2.98, 3.01, 3.0, 3.03, 3.05, 3.03, 3.08]} />
          <Kpi i={2} icon={<Wallet size={18} />} label="Fee collection" value={<CountUp value={74.9} from={0} decimals={1} suffix="%" />} delta="$3.61M of $4.82M billed" spark={[22, 31, 45, 52, 61, 66, 71, 74.9]} />
          <Kpi i={3} icon={<LayoutGrid size={18} />} label="Section occupancy" value={<CountUp value={86} from={0} suffix="%" />} delta="412 active sections" spark={[71, 74, 78, 80, 83, 84, 85, 86]} />
          <Reveal i={4}>
            <button
              onClick={() => go('W02')}
              className="group relative h-full w-full overflow-hidden rounded-card border border-crimson-400/30 bg-gradient-to-br from-crimson/30 via-navy-900 to-navy-900 px-6 py-5 text-left transition-colors hover:border-crimson-400/60 focus-visible:outline-2 focus-visible:outline-crimson-400"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm font-medium text-white/70">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-crimson/30 text-crimson-400">
                    <Gavel size={18} />
                  </span>
                  Pending decisions
                </span>
                <ArrowUpRight size={18} className="text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <div className="mt-4 text-[48px] leading-none font-semibold tabular-nums">{pendingDecisions}</div>
              <div className="mt-3 flex items-center gap-1.5 text-sm text-crimson-400">
                <AlertTriangle size={14} /> {state.decisionPublished ? '1 requires action today' : '2 require action today'}
              </div>
            </button>
          </Reveal>
        </div>

        {/* Row 3 */}
        <div className="grid min-h-0 flex-1 grid-cols-[1.25fr_1fr] gap-5">
          <Reveal i={5}>
            <Card dark className="h-full px-7 py-6">
              <CardHeader
                dark
                title="Enrollment & academic performance"
                subtitle="Total enrolled students per semester, with average GPA trend"
                action={
                  <div className="flex items-center gap-5 text-xs text-white/60">
                    <Legend color="bg-sky" label="Enrolled students" />
                    <Legend color="bg-white/40" label="Target 6,000" dashed />
                  </div>
                }
              />
              <div className="mt-4 flex items-end gap-8">
                <LineChart
                  dark
                  width={700}
                  height={222}
                  min={5200}
                  max={6400}
                  labels={['F22', 'S23', 'F23', 'S24', 'F24', 'S25', 'F25', 'F26']}
                  format={(v) => (v / 1000).toFixed(1) + 'k'}
                  series={[
                    { values: [6000, 6000, 6000, 6000, 6000, 6000, 6000, 6000], color: 'rgb(255 255 255 / 0.35)', dashed: true },
                    { values: [5410, 5530, 5620, 5760, 5850, 5990, 6080, 6240], color: 'var(--color-sky)', area: true },
                  ]}
                />
                <div className="mb-4 w-[220px] space-y-4 border-l border-white/[0.07] pl-7">
                  <MiniStat label="New intake" value="1,284" note="+9.1% YoY" />
                  <MiniStat label="Retention" value="92.4%" note="Year 1 → Year 2" />
                  <MiniStat label="On academic probation" value="3.1%" note="−0.6 pts" />
                </div>
              </div>
            </Card>
          </Reveal>
          <Reveal i={6}>
            <Card dark className="h-full px-7 py-6">
              <CardHeader dark title="Faculty performance" subtitle="Live from registration, grades and finance" action={<Badge dark tone="info">5 faculties</Badge>} />
              <div className="mt-5">
                <div className="grid grid-cols-[1.6fr_0.7fr_0.6fr_1.2fr_0.8fr] gap-4 border-b border-white/[0.07] pb-3 text-[11px] font-semibold tracking-wider text-white/40 uppercase">
                  <span>Faculty</span>
                  <span className="text-right">Students</span>
                  <span className="text-right">GPA</span>
                  <span>Occupancy</span>
                  <span className="text-right">Collected</span>
                </div>
                {faculties.map((f, i) => (
                  <button
                    key={f.name}
                    onClick={() => go('W03')}
                    className={cx(
                      'grid w-full grid-cols-[1.6fr_0.7fr_0.6fr_1.2fr_0.8fr] items-center gap-4 border-b border-white/[0.05] py-[10px] text-left text-sm',
                      'group cursor-pointer rounded-lg hover:bg-white/[0.03]',
                    )}
                  >
                    <span className="flex items-center gap-2 font-medium text-white">
                      {f.name}
                      <ChevronRight size={14} className={cx('text-white/40 transition-opacity', i === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100')} />
                    </span>
                    <span className="text-right text-white/75 tabular-nums">{f.students.toLocaleString()}</span>
                    <span className="text-right text-white/75 tabular-nums">{f.gpa.toFixed(2)}</span>
                    <span className="flex items-center gap-3">
                      <Progress dark value={f.occ} tone={f.occ > 89 ? 'warning' : 'sky'} />
                      <span className="w-9 text-xs text-white/60 tabular-nums">{f.occ}%</span>
                    </span>
                    <span className={cx('text-right tabular-nums', f.coll < 73 ? 'text-warning-400' : 'text-white/75')}>{f.coll}%</span>
                  </button>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>

        {/* Row 4 */}
        <div className="grid h-[286px] shrink-0 grid-cols-[1fr_0.8fr_1.1fr] gap-5">
          <Reveal i={7}>
            <Card dark className="h-full px-7 py-6">
              <CardHeader dark title="Fee collection by month" subtitle="USD thousands · Fall 2026 billing cycle" action={<Badge dark tone="success" icon={<TrendingUp size={12} />}>On track</Badge>} />
              <div className="mt-4">
                <BarChart
                  dark
                  width={520}
                  height={180}
                  color="rgb(143 184 232 / 0.55)"
                  accentIndex={4}
                  accentColor="var(--color-sky)"
                  data={[
                    { label: 'May', value: 410 },
                    { label: 'Jun', value: 620 },
                    { label: 'Jul', value: 880 },
                    { label: 'Aug', value: 1140 },
                    { label: 'Sep', value: 560 },
                  ]}
                  format={(v) => `$${v}k`}
                />
              </div>
            </Card>
          </Reveal>
          <Reveal i={8}>
            <Card dark className="h-full px-7 py-6">
              <CardHeader dark title="Section capacity" subtitle="412 sections this semester" />
              <div className="mt-4 flex items-center gap-7">
                <Donut
                  dark
                  size={156}
                  thickness={15}
                  segments={[
                    { value: 64, color: 'var(--color-sky)' },
                    { value: 22, color: 'var(--color-crimson-400)' },
                    { value: 14, color: 'rgb(255 255 255 / 0.25)' },
                  ]}
                >
                  <div className="text-[34px] leading-none font-semibold tabular-nums">86%</div>
                  <div className="mt-1 text-xs text-white/45">avg. filled</div>
                </Donut>
                <div className="space-y-3.5 text-sm">
                  <LegendRow color="bg-sky" label="Healthy (60–95%)" value="264" />
                  <LegendRow color="bg-crimson-400" label="Full / waitlist" value="91" />
                  <LegendRow color="bg-white/25" label="Under-filled" value="57" />
                </div>
              </div>
            </Card>
          </Reveal>
          <Reveal i={9}>
            <Card dark className="h-full px-7 py-6" story="decisions-list">
              <CardHeader
                dark
                title="Decisions awaiting you"
                subtitle="Signed decisions publish instantly to every portal"
                action={
                  <Button variant="darkGhost" size="sm" onClick={() => go('W02')}>
                    Open queue <ChevronRight size={14} />
                  </Button>
                }
              />
              <div className="mt-3 space-y-2">
                {decisions.map((d) => (
                  <button key={d.id} onClick={() => go('W02')} className="flex w-full items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-[8px] text-left transition-colors hover:bg-white/[0.05]">
                    <span className={cx('h-2 w-2 shrink-0 rounded-full', d.done ? 'bg-success-400' : d.urgent ? 'bg-crimson-400' : 'bg-white/30')} />
                    <span className="w-[108px] shrink-0 text-xs text-white/45 tabular-nums">{d.id}</span>
                    <span className={cx('min-w-0 flex-1 truncate text-sm font-medium', d.done ? 'text-white/50 line-through decoration-white/30' : 'text-white')}>{d.title}</span>
                    {d.done ? (
                      <Badge dark tone="success">Published</Badge>
                    ) : (
                      <span className={cx('flex items-center gap-1 text-xs', d.urgent ? 'text-crimson-400' : 'text-white/45')}>
                        <Clock size={12} /> {d.due}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </ExecShell>
  )
}

function Kpi({ i, icon, label, value, delta, spark }: { i: number; icon: React.ReactNode; label: string; value: React.ReactNode; delta: string; spark: number[] }) {
  return (
    <Reveal i={i}>
      <Card dark className="relative h-full overflow-hidden px-6 py-5">
        <div className="flex items-center gap-2 text-sm font-medium text-white/70">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-sky">{icon}</span>
          {label}
        </div>
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="text-[44px] leading-none font-semibold tracking-tight">{value}</div>
          <Sparkline values={spark} color="var(--color-sky)" width={104} height={38} />
        </div>
        <div className="mt-3 text-sm text-success-400">{delta}</div>
      </Card>
    </Reveal>
  )
}

function MiniStat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div>
      <div className="text-xs text-white/45">{label}</div>
      <div className="mt-1 text-[26px] leading-none font-semibold tabular-nums">{value}</div>
      <div className="mt-1 text-xs text-success-400">{note}</div>
    </div>
  )
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span className={cx('h-[3px] w-5 rounded-full', color, dashed && 'opacity-70')} />
      {label}
    </span>
  )
}

function LegendRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className={cx('h-2.5 w-2.5 rounded-sm', color)} />
      <span className="w-[140px] text-white/65">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
}
