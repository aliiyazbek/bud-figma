import { useState } from 'react'
import { AdminShell } from '../../components/shells'
import { Card, CardHeader, Reveal, Badge, Button, cx } from '../../components/ui'
import { Settings2, ShieldCheck, Check, Clock, Building2, User, Cpu, Timer, Activity, CheckCircle2 } from 'lucide-react'
import { useToast } from '../../components/toast'

const pathway = [
  { name: 'Student submission', office: 'Student Portal', actor: 'Maya Al-Safi', date: 'Today, 09:12', sla: 'Instant', icon: User },
  { name: 'Initial verification', office: 'Student Affairs', actor: 'Tarek Haddad', date: 'Today, 09:15', sla: '1 day', icon: ShieldCheck },
  { name: 'Academic review', office: 'Faculty Advisor', actor: 'Assigned automatically', date: '—', sla: '3 days', icon: Building2 },
  { name: 'Final approval', office: 'Dean of Faculty', actor: 'Dr. Samer Halabi', date: '—', sla: '2 days', icon: CheckCircle2 },
  { name: 'Record update', office: 'Registrar system', actor: 'Automated', date: '—', sla: 'Instant', icon: Cpu },
]

const initialRules = [
  { text: 'Check that required attachments are present before routing.', on: true },
  { text: 'Return to student if the requested course is not in their degree plan.', on: true },
  { text: 'Send a mobile notification when status changes.', on: true },
  { text: 'Escalate to supervisor when a step exceeds its SLA.', on: false },
]

export default function W10() {
  const [current, setCurrent] = useState(1)
  const [rules, setRules] = useState(initialRules)
  const toast = useToast()

  const advance = () => {
    if (current >= pathway.length) return
    const next = current + 1
    setCurrent(next)
    toast(next >= pathway.length ? 'Workflow complete. Record updated.' : `Moved to: ${pathway[next].name}`, 'success')
  }

  return (
    <AdminShell
      title="Workflow Routing"
      crumb="Workflow Configuration / Course Exemption"
      actions={
        <Button variant="secondary" onClick={() => toast('Workflow editor is not part of this prototype.', 'info')}>
          <Settings2 size={16} /> Edit workflow
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Files in routing', value: '42', icon: Activity, tint: 'bg-navy-50 text-navy' },
            { label: 'Median turnaround', value: '4.2 days', icon: Timer, tint: 'bg-warning-50 text-warning' },
            { label: 'Completed this term', value: '128', icon: CheckCircle2, tint: 'bg-success-50 text-success' },
          ].map((k, i) => (
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

        <Reveal i={3}>
          <Card className="p-8">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-mono text-[11px] text-subtle">REQ-2026-081 · Course Exemption</div>
                <h2 className="mt-1 font-display text-xl font-bold text-ink">Routing path</h2>
              </div>
              <div className="flex items-center gap-3">
                <Badge tone="success" icon={<ShieldCheck size={12} />}>Active configuration</Badge>
                <Button variant="primary" size="sm" onClick={advance} disabled={current >= pathway.length}>
                  {current >= pathway.length ? 'Completed' : 'Simulate next step'}
                </Button>
              </div>
            </div>

            <div className="relative mt-10 grid grid-cols-5 gap-4">
              <div className="absolute top-6 right-[10%] left-[10%] h-0.5 bg-line" />
              <div
                className="absolute top-6 left-[10%] h-0.5 bg-navy transition-all duration-700"
                style={{ width: `${(Math.min(current, pathway.length - 1) / (pathway.length - 1)) * 80}%` }}
              />
              {pathway.map((p, i) => {
                const done = i < current
                const now = i === current
                return (
                  <div key={p.name} className="relative flex flex-col items-center text-center">
                    <div
                      className={cx(
                        'relative z-10 flex h-12 w-12 items-center justify-center rounded-full ring-4 ring-white transition-colors',
                        done ? 'bg-navy text-white' : now ? 'bg-crimson text-white' : 'border border-line bg-ivory text-subtle',
                      )}
                    >
                      {now && <span className="absolute inset-0 animate-ping rounded-full bg-crimson/30" />}
                      {done ? <Check size={20} /> : now ? <Clock size={20} /> : <p.icon size={18} />}
                    </div>
                    <div
                      className={cx(
                        'mt-4 w-full rounded-2xl border p-4 text-left transition-colors',
                        now ? 'border-crimson/30 bg-crimson-50/50 shadow-card' : done ? 'border-line bg-white' : 'border-dashed border-line bg-ivory/50',
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-widest text-subtle uppercase">Step {i + 1}</span>
                        <Badge tone={done ? 'success' : now ? 'danger' : 'neutral'}>{done ? 'Done' : now ? 'Active' : 'Queued'}</Badge>
                      </div>
                      <div className="mt-2 text-sm font-semibold text-ink">{p.name}</div>
                      <div className="mt-3 space-y-1 text-xs text-muted">
                        <div>{p.office}</div>
                        <div className="text-ink">{p.actor}</div>
                        <div className="flex justify-between border-t border-line pt-2">
                          <span>SLA {p.sla}</span>
                          <span>{done ? p.date : '—'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </Reveal>

        <Reveal i={4}>
          <Card className="p-6">
            <CardHeader title="Automation rules" subtitle="Applied to every file routed through this workflow" />
            <div className="mt-5 grid grid-cols-2 gap-3">
              {rules.map((r, i) => (
                <button
                  key={r.text}
                  onClick={() => setRules(rs => rs.map((x, j) => (j === i ? { ...x, on: !x.on } : x)))}
                  className="flex items-center gap-4 rounded-xl border border-line p-4 text-left transition-colors hover:bg-ivory"
                >
                  <span className={cx('relative h-5 w-9 shrink-0 rounded-full transition-colors', r.on ? 'bg-navy' : 'bg-line')}>
                    <span className={cx('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all', r.on ? 'left-[18px]' : 'left-0.5')} />
                  </span>
                  <span className={cx('text-sm', r.on ? 'text-ink' : 'text-subtle')}>{r.text}</span>
                </button>
              ))}
            </div>
          </Card>
        </Reveal>
      </div>
    </AdminShell>
  )
}
