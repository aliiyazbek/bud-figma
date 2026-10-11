import { CheckCircle2, Circle, ClipboardCheck, Lock, Send, Users, Sigma, TrendingUp, Award, ShieldCheck } from 'lucide-react'
import { AdminShell } from '../../components/shells'
import { Card, CardHeader, Reveal, Badge, Button, Dialog, Avatar, cx } from '../../components/ui'
import { BarChart } from '../../components/charts'
import { useDemo } from '../../state/DemoContext'
import { grade } from '../../data/demo'
import { Stat } from './W03'

const rows = [
  { id: 'BUD-2024-0187', name: 'Maya Haddad', sec: 'B', score: 87, maya: true },
  { id: 'BUD-2024-0102', name: 'Ahmad Rifai', sec: 'A', score: 92 },
  { id: 'BUD-2024-0144', name: 'Sara Qassem', sec: 'A', score: 78 },
  { id: 'BUD-2024-0159', name: 'Yousef Barakat', sec: 'B', score: 64 },
  { id: 'BUD-2023-0381', name: 'Hiba Alloush', sec: 'A', score: 98 },
  { id: 'BUD-2024-0205', name: 'Tarek Mahmoud', sec: 'B', score: 71 },
  { id: 'BUD-2024-0221', name: 'Nadine Srour', sec: 'A', score: 83 },
  { id: 'BUD-2024-0240', name: 'Wassim Haidar', sec: 'B', score: 55 },
  { id: 'BUD-2024-0263', name: 'Joud Antaki', sec: 'A', score: 89 },
]
const letter = (s: number) => (s >= 90 ? 'A' : s >= 85 ? 'A−' : s >= 80 ? 'B+' : s >= 75 ? 'B' : s >= 70 ? 'B−' : s >= 65 ? 'C+' : s >= 60 ? 'C' : 'D')

export default function W05() {
  const { state, dispatch } = useDemo()
  const pub = state.gradesPublished
  const steps = [
    { l: 'Submitted by instructor', w: 'Dr. Omar Nasser · 11 Sep, 16:20', done: true },
    { l: 'Department head review', w: 'Dr. Ziad Farah · 12 Sep, 10:05', done: true },
    { l: 'Dean approval', w: pub ? 'You · Today, 09:36' : 'Awaiting you', done: pub, current: !pub },
    { l: 'Published to students', w: pub ? '66 students notified' : '—', done: pub },
  ]
  return (
    <AdminShell
      title="Grade Approval"
      crumb="Academic · Grades · CS301 Database Systems"
      overlay={
        <Dialog
          open={state.dialog === 'grades'}
          onClose={() => dispatch({ type: 'closeDialog' })}
          story="grades-dialog"
          icon={
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy">
              <ClipboardCheck size={20} />
            </span>
          }
          title="Approve and publish CS301 midterm grades?"
          footer={
            <>
              <Button variant="secondary" onClick={() => dispatch({ type: 'closeDialog' })}>
                Cancel
              </Button>
              <Button data-autofocus story="confirm-grades" onClick={() => dispatch({ type: 'approveGrades' })}>
                <Send size={16} /> Approve & publish
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-muted">
            66 grades across sections A and B will be locked and published to students immediately. Students receive a notification in the mobile app. Further changes will require a formal grade-change request.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            {[
              ['66', 'Students'],
              ['74.6', 'Mean score'],
              ['91%', 'Pass rate'],
            ].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-ivory py-3">
                <div className="text-xl font-semibold tabular-nums">{v}</div>
                <div className="text-xs text-subtle">{l}</div>
              </div>
            ))}
          </div>
        </Dialog>
      }
    >
      <div className="flex h-full flex-col gap-6">
        <div className="grid grid-cols-4 gap-5">
          <Stat i={0} icon={<Users size={18} />} label="Students graded" value="66" note="Sections A (36) · B (30)" />
          <Stat i={1} icon={<Sigma size={18} />} label="Mean score" value="74.6" note="Median 76 · σ 11.2" />
          <Stat i={2} icon={<TrendingUp size={18} />} label="Pass rate" value="91%" note="+3 pts vs Fall 2025" />
          <Stat i={3} icon={<Award size={18} />} label="Highest score" value="98" note="Hiba Alloush · Section A" />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[1.5fr_1fr] gap-6">
          <Reveal i={4} className="min-h-0">
            <Card className="flex h-full flex-col p-7">
              <CardHeader
                title={
                  <span className="flex items-center gap-3">
                    CS301 · {grade.assessment}
                    <Badge tone={pub ? 'success' : 'warning'} icon={pub ? <CheckCircle2 size={12} /> : <Lock size={12} />}>
                      {pub ? 'Published' : 'Pending approval'}
                    </Badge>
                  </span>
                }
                subtitle={`Weight ${grade.weight} of final grade · Instructor Dr. Omar Nasser · showing 9 of 66`}
              />
              <table className="mt-5 w-full text-sm">
                <thead>
                  <tr className="border-b border-line text-left text-[11px] font-semibold tracking-wider text-subtle uppercase">
                    <th className="pb-3 font-semibold">Student</th>
                    <th className="pb-3 font-semibold">ID</th>
                    <th className="pb-3 font-semibold">Section</th>
                    <th className="pb-3 text-right font-semibold">Score</th>
                    <th className="pb-3 text-right font-semibold">Letter</th>
                    <th className="pb-3 text-right font-semibold">Visibility</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id} className={cx('border-b border-line/70', r.maya && 'bg-navy-50/70')}>
                      <td className="py-[11px]">
                        <span className="flex items-center gap-3">
                          <Avatar initials={r.name.split(' ').map((p) => p[0]).join('')} tone={r.maya ? 'navy' : 'light'} className="h-8 w-8 text-xs" />
                          <span className="font-medium">{r.name}</span>
                        </span>
                      </td>
                      <td className="py-[11px] text-muted tabular-nums">{r.id}</td>
                      <td className="py-[11px] text-muted">{r.sec}</td>
                      <td className="py-[11px] text-right font-semibold tabular-nums">{r.score}</td>
                      <td className="py-[11px] text-right text-muted">{letter(r.score)}</td>
                      <td className="py-[11px] text-right">
                        {pub ? (
                          <Badge tone="success">Visible to student</Badge>
                        ) : (
                          <Badge icon={<Lock size={11} />}>Hidden</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </Reveal>
          <div className="flex min-h-0 flex-col gap-6">
            <Reveal i={5}>
              <Card className="p-7">
                <CardHeader title="Score distribution" subtitle="All 66 students" />
                <div className="mt-4">
                  <BarChart
                    width={540}
                    height={180}
                    accentIndex={4}
                    data={[
                      { label: '<60', value: 6 },
                      { label: '60–69', value: 11 },
                      { label: '70–79', value: 19 },
                      { label: '80–89', value: 21 },
                      { label: '90+', value: 9 },
                    ]}
                  />
                </div>
              </Card>
            </Reveal>
            <Reveal i={6} className="min-h-0 flex-1">
              <Card className="flex h-full flex-col p-7">
                <CardHeader title="Approval chain" subtitle="Grades stay hidden from students until published" />
                <div className="mt-5 flex-1">
                  {steps.map((s, i) => (
                    <div key={s.l} className="flex gap-3.5">
                      <div className="flex flex-col items-center">
                        {s.done ? (
                          <CheckCircle2 size={20} className="text-success" />
                        ) : s.current ? (
                          <span className="relative flex h-5 w-5 items-center justify-center">
                            <span className="absolute inset-0 animate-ping rounded-full bg-crimson/30" />
                            <span className="h-3 w-3 rounded-full bg-crimson" />
                          </span>
                        ) : (
                          <Circle size={20} className="text-line" />
                        )}
                        {i < steps.length - 1 && <span className={cx('my-1 w-px flex-1', s.done ? 'bg-success/40' : 'bg-line')} />}
                      </div>
                      <div className="pb-4">
                        <div className={cx('text-sm font-semibold', !s.done && !s.current && 'text-subtle')}>{s.l}</div>
                        <div className="text-xs text-muted">{s.w}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {pub ? (
                  <Button variant="success" size="xl" disabled className="w-full cursor-default">
                    <ShieldCheck size={18} /> Published · locked
                  </Button>
                ) : (
                  <Button size="xl" story="approve-grades" className="w-full" onClick={() => dispatch({ type: 'openDialog', dialog: 'grades' })}>
                    <ClipboardCheck size={18} /> Approve & publish grades
                  </Button>
                )}
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
