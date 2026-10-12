import { useMemo, useState } from 'react'
import { AdminShell } from '../../components/shells'
import { Card, Reveal, Badge, Button, Avatar, cx } from '../../components/ui'
import { Search, ArrowRight, Inbox, Clock, AlertTriangle, CheckCircle2, FileText, Paperclip } from 'lucide-react'
import { useToast } from '../../components/toast'
import { useNav } from '../../state/NavContext'

type Req = {
  id: string
  type: string
  student: string
  initials: string
  faculty: string
  status: 'Pending Review' | 'In Progress' | 'Awaiting Faculty'
  priority: 'High' | 'Normal'
  date: string
  sla: number
  files: number
}

const requests: Req[] = [
  { id: 'REQ-2026-081', type: 'Course Exemption', student: 'Maya Al-Safi', initials: 'MA', faculty: 'Engineering', status: 'Pending Review', priority: 'High', date: 'Today, 09:12', sla: 20, files: 2 },
  { id: 'REQ-2026-079', type: 'Late Registration', student: 'Ahmad Nouri', initials: 'AN', faculty: 'Business', status: 'Pending Review', priority: 'Normal', date: 'Today, 08:45', sla: 35, files: 1 },
  { id: 'REQ-2026-075', type: 'Transcript Request', student: 'Sarah Taha', initials: 'ST', faculty: 'Pharmacy', status: 'In Progress', priority: 'Normal', date: 'Yesterday, 14:30', sla: 60, files: 0 },
  { id: 'REQ-2026-072', type: 'Grade Appeal', student: 'Omar Zidan', initials: 'OZ', faculty: 'IT', status: 'Awaiting Faculty', priority: 'High', date: 'Yesterday, 11:15', sla: 85, files: 3 },
  { id: 'REQ-2026-068', type: 'Major Transfer', student: 'Lina Kasem', initials: 'LK', faculty: 'Architecture', status: 'Pending Review', priority: 'Normal', date: '12 Sep 2026', sla: 70, files: 4 },
  { id: 'REQ-2026-064', type: 'Enrolment Letter', student: 'Karim Daher', initials: 'KD', faculty: 'Engineering', status: 'In Progress', priority: 'Normal', date: '11 Sep 2026', sla: 45, files: 0 },
]

const filters = ['All', 'Pending Review', 'In Progress', 'Awaiting Faculty'] as const
const statusTone = { 'Pending Review': 'warning', 'In Progress': 'info', 'Awaiting Faculty': 'neutral' } as const

export default function W08() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('All')
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(requests[0].id)
  const toast = useToast()
  const { go } = useNav()

  const filtered = useMemo(
    () =>
      requests.filter(
        r =>
          (filter === 'All' || r.status === filter) &&
          (q === '' || `${r.id} ${r.student} ${r.type}`.toLowerCase().includes(q.toLowerCase())),
      ),
    [filter, q],
  )
  const active = requests.find(r => r.id === selected) ?? requests[0]

  const kpis = [
    { label: 'Open requests', value: requests.length, icon: Inbox, tint: 'bg-navy-50 text-navy' },
    { label: 'Awaiting my review', value: requests.filter(r => r.status === 'Pending Review').length, icon: Clock, tint: 'bg-warning-50 text-warning' },
    { label: 'High priority', value: requests.filter(r => r.priority === 'High').length, icon: AlertTriangle, tint: 'bg-crimson-50 text-crimson' },
    { label: 'Closed this week', value: 37, icon: CheckCircle2, tint: 'bg-success-50 text-success' },
  ]

  return (
    <AdminShell
      title="Staff Inbox"
      crumb="Workflow & Requests"
      user={{ name: 'Tarek Haddad', role: 'Student Affairs Officer', initials: 'TH' }}
      actions={
        <Button variant="primary" onClick={() => go('W10')}>
          View routing <ArrowRight size={16} />
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((k, i) => (
            <Reveal key={k.label} i={i}>
              <Card className="flex items-center gap-4 p-5">
                <div className={cx('flex h-11 w-11 items-center justify-center rounded-xl', k.tint)}>
                  <k.icon size={20} />
                </div>
                <div>
                  <div className="font-display text-2xl font-bold text-ink">{k.value}</div>
                  <div className="text-xs text-muted">{k.label}</div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-[1fr_340px] gap-6">
          <Reveal i={4}>
            <Card className="overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line p-5">
                <div className="flex gap-1 rounded-xl bg-ivory p-1 text-xs font-semibold">
                  {filters.map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cx('rounded-lg px-3 py-1.5 transition-colors', filter === f ? 'bg-white text-navy shadow-card' : 'text-muted hover:text-navy')}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                <label className="flex h-9 w-64 items-center gap-2 rounded-xl border border-line bg-ivory px-3 text-sm focus-within:border-navy/40">
                  <Search size={15} className="text-subtle" />
                  <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search ID, student, type" className="w-full bg-transparent outline-none placeholder:text-subtle" />
                </label>
              </div>

              <table className="w-full text-left text-sm">
                <thead className="bg-ivory/60 text-[11px] tracking-wider text-subtle uppercase">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Request</th>
                    <th className="px-5 py-3 font-semibold">Student</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">SLA</th>
                    <th className="px-5 py-3 font-semibold">Submitted</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {filtered.map(r => (
                    <tr
                      key={r.id}
                      onClick={() => setSelected(r.id)}
                      className={cx('cursor-pointer transition-colors', selected === r.id ? 'bg-navy-50' : 'hover:bg-ivory')}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {r.priority === 'High' && <span className="h-2 w-2 rounded-full bg-crimson" title="High priority" />}
                          <span className="font-semibold text-ink">{r.type}</span>
                        </div>
                        <div className="mt-0.5 font-mono text-[11px] text-subtle">{r.id}</div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar initials={r.initials} tone="light" />
                          <div>
                            <div className="font-medium text-ink">{r.student}</div>
                            <div className="text-xs text-subtle">{r.faculty}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge tone={statusTone[r.status]}>{r.status}</Badge>
                      </td>
                      <td className="px-5 py-4">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-line">
                          <div className={cx('h-full rounded-full', r.sla > 75 ? 'bg-crimson' : r.sla > 50 ? 'bg-warning' : 'bg-success')} style={{ width: `${r.sla}%` }} />
                        </div>
                        <div className="mt-1 text-[11px] text-subtle">{r.sla}% of window used</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-muted">{r.date}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-16 text-center text-sm text-muted">
                        No requests match this view.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </Reveal>

          <Reveal i={5}>
            <Card className="sticky top-6 overflow-hidden">
              <div className="bg-navy p-6 text-white">
                <div className="font-mono text-[11px] text-white/50">{active.id}</div>
                <div className="mt-1 font-display text-lg font-bold">{active.type}</div>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar initials={active.initials} tone="crimson" />
                  <div>
                    <div className="text-sm font-semibold">{active.student}</div>
                    <div className="text-xs text-white/60">Faculty of {active.faculty}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Status</span>
                  <Badge tone={statusTone[active.status]}>{active.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Priority</span>
                  <Badge tone={active.priority === 'High' ? 'danger' : 'neutral'}>{active.priority}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Attachments</span>
                  <span className="flex items-center gap-1 font-medium text-ink">
                    <Paperclip size={13} /> {active.files} files
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Submitted</span>
                  <span className="font-medium text-ink">{active.date}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="secondary" onClick={() => toast(`${active.id} assigned to you.`, 'success')}>
                    Claim
                  </Button>
                  <Button variant="primary" onClick={() => go('W09')}>
                    <FileText size={15} /> Review
                  </Button>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </AdminShell>
  )
}
