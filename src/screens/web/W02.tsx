import { CheckCircle2, Circle, FileText, Paperclip, Send, Users, Megaphone, Smartphone, Globe, Mail, Gavel, Clock, ShieldCheck } from 'lucide-react'
import { ExecShell } from '../../components/shells'
import { Card, CardHeader, Reveal, Badge, Button, Dialog, CountUp, Logo, cx } from '../../components/ui'
import { useState } from 'react'
import { useDemo } from '../../state/DemoContext'
import { useToast } from '../../components/toast'
import { decision } from '../../data/demo'

export default function W02() {
  const { state, dispatch } = useDemo()
  const published = state.decisionPublished
  const toast = useToast()
  const [filter, setFilter] = useState('All')
  const [sel, setSel] = useState<string>(decision.id)

  const queue = [
    { id: decision.id, title: decision.title, from: 'Registrar · Academic Council', status: published ? 'Published' : 'Awaiting signature', urgent: true, active: true },
    { id: 'DEC-2026-013', title: 'Tuition installment policy 2026/27', from: 'Finance Directorate', status: 'Awaiting signature', urgent: true },
    { id: 'DEC-2026-012', title: 'New transport line — Qudsaya route', from: 'Student Services', status: 'Legal review', urgent: false },
    { id: 'DEC-2026-010', title: 'Research grant allocation, round 2', from: 'Research Office', status: 'Council review', urgent: false },
    { id: 'DEC-2026-009', title: 'Extended library hours for exams', from: 'Library', status: 'Published', urgent: false, done: true },
  ]

  const steps = [
    { label: 'Drafted by Registrar', who: 'Office of the Registrar', when: '8 Sep, 11:20', done: true },
    { label: 'Academic Council review', who: 'Approved 9 votes to 0', when: '10 Sep, 14:05', done: true },
    { label: 'Legal & compliance check', who: 'No issues raised', when: '11 Sep, 10:40', done: true },
    { label: 'President signature', who: 'University President', when: published ? 'Today, 09:43' : 'Awaiting you', done: published, current: !published },
    { label: 'Published to all portals', who: 'Web · Mobile · Email', when: published ? 'Today, 09:43' : '—', done: published },
  ]

  return (
    <ExecShell
      overlay={
        <Dialog
          dark
          open={state.dialog === 'decision'}
          onClose={() => dispatch({ type: 'closeDialog' })}
          story="decision-dialog"
          icon={
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-crimson/25 text-crimson-400">
              <Gavel size={20} />
            </span>
          }
          title={<>Sign and publish {decision.id}?</>}
          footer={
            <>
              <Button variant="darkGhost" onClick={() => dispatch({ type: 'closeDialog' })}>
                Cancel
              </Button>
              <Button variant="crimson" data-autofocus story="confirm-decision" onClick={() => dispatch({ type: 'publishDecision' })}>
                <Send size={16} /> Sign & publish
              </Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-white/65">
            The decision will be signed digitally on behalf of the Office of the President and delivered immediately to{' '}
            <span className="font-semibold text-white">7,180 recipients</span> through the student app, staff portal and email. This action can’t be undone.
          </p>
        </Dialog>
      }
    >
      <div className="grid h-full grid-cols-[440px_1fr_460px] gap-6">
        {/* Queue */}
        <Reveal className="min-h-0">
          <Card dark className="flex h-full flex-col p-6">
            <CardHeader dark title="Decision queue" subtitle={`${published ? 3 : 4} awaiting action · Fall 2026`} />
            <div className="mt-5 flex gap-2 text-xs">
              {['All', 'Awaiting me', 'In review', 'Published'].map((f) => (
                <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f} className={cx('rounded-full px-3 py-1.5 font-medium transition-colors', filter === f ? 'bg-white text-navy-950' : 'border border-white/10 text-white/60 hover:bg-white/5 hover:text-white')}>
                  {f}
                </button>
              ))}
            </div>
            <div className="mt-5 space-y-2.5">
              {queue
                .filter((q) => filter === 'All' || (filter === 'Awaiting me' ? q.status === 'Awaiting signature' : filter === 'Published' ? q.status === 'Published' : /review/i.test(q.status)))
                .map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    setSel(q.id)
                    if (q.id !== decision.id) toast(`${q.id} opened · full preview available for ${decision.id} in this demo`, 'info')
                  }}
                  aria-pressed={sel === q.id}
                  className={cx(
                    'block w-full rounded-2xl border p-4 text-left transition-colors',
                    sel === q.id ? 'border-white/25 bg-white/[0.06]' : 'border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.04]',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/45 tabular-nums">{q.id}</span>
                    <Badge dark tone={q.status === 'Published' ? 'success' : q.urgent ? 'danger' : 'neutral'}>{q.status}</Badge>
                  </div>
                  <div className="mt-2 text-[15px] leading-snug font-semibold">{q.title}</div>
                  <div className="mt-1.5 text-xs text-white/45">{q.from}</div>
                </button>
              ))}
            </div>
          </Card>
        </Reveal>

        {/* Document preview */}
        <Reveal i={1} className="min-h-0">
          <div className="relative flex h-full flex-col overflow-hidden rounded-card bg-white text-ink shadow-float">
            <div className="flex items-center justify-between border-b border-line px-12 pt-10 pb-7">
              <Logo className="h-[84px]" padded={false} />
              <div className="text-right">
                <div className="text-xs font-semibold tracking-[0.18em] text-crimson uppercase">Presidential Decision</div>
                <div className="mt-1 text-2xl font-semibold tabular-nums">{decision.id}</div>
                <div className="mt-1 text-sm text-muted">Damascus · 13 September 2026</div>
              </div>
            </div>
            <div className="flex-1 px-12 py-9">
              <div className="text-[28px] leading-tight font-semibold tracking-tight text-navy">{decision.title}</div>
              <p className="mt-5 max-w-[720px] text-[15px] leading-7 text-muted">
                Following the recommendation of the Academic Council in its session of 10 September 2026, and to ensure adequate teaching weeks
                after the delayed start of term, the President of the University decides the following:
              </p>
              <ol className="mt-6 space-y-4 text-[15px] leading-7">
                {[
                  'The mid-semester break is moved to 25–29 October 2026.',
                  'Final examinations for Fall 2026 begin on 4 January 2027 and conclude on 21 January 2027.',
                  'The add/drop window is extended until 20 September 2026 for all programmes.',
                  'Faculties shall update course schedules within five working days of publication.',
                ].map((t, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-navy-50 text-sm font-semibold text-navy tabular-nums">{i + 1}</span>
                    <span className="pt-px">{t}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex items-end justify-between border-t border-line bg-ivory/70 px-12 py-6">
              <div className="text-xs text-subtle">
                Demo document — for presentation purposes only
                <div className="mt-1">Issued by: {decision.issuedBy}</div>
              </div>
              <div className="text-right">
                {published ? (
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-success" size={28} />
                    <div>
                      <div className="text-sm font-semibold text-success">Digitally signed</div>
                      <div className="text-xs text-muted">Today, 09:43 · SIG-7F3A-22C1</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm font-medium text-warning">
                    <Clock size={16} /> Awaiting presidential signature
                  </div>
                )}
              </div>
            </div>
            {published && (
              <div className="pointer-events-none absolute top-[210px] right-14 rotate-[-8deg] rounded-xl border-[3px] border-success/70 px-5 py-2 text-xl font-bold tracking-[0.2em] text-success/80 uppercase">
                Published
              </div>
            )}
          </div>
        </Reveal>

        {/* Right column */}
        <div className="flex min-h-0 flex-col gap-5">
          <Reveal i={2}>
            <Card dark className="p-6">
              <CardHeader dark title="Target audience" subtitle="Recipients resolved from the student & HR records" />
              <div className="mt-4 flex flex-wrap gap-2">
                {decision.audience.map((a) => (
                  <Badge key={a} dark tone="info" icon={<Users size={12} />}>
                    {a}
                  </Badge>
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3">
                <Channel icon={<Smartphone size={16} />} label="Student app" value="6,240" />
                <Channel icon={<Globe size={16} />} label="Staff portal" value="940" />
                <Channel icon={<Mail size={16} />} label="Email" value="7,180" />
              </div>
            </Card>
          </Reveal>
          <Reveal i={3}>
            <Card dark className="p-6">
              <CardHeader dark title="Attachments" />
              <div className="mt-3 space-y-2">
                {decision.attachments.map((f) => (
                  <div key={f.name} className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2.5 text-sm">
                    <FileText size={16} className="text-sky" />
                    <span className="flex-1 truncate">{f.name}</span>
                    <span className="text-xs text-white/40">{f.size}</span>
                    <Paperclip size={14} className="text-white/30" />
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
          <Reveal i={4} className="min-h-0 flex-1">
            <Card dark className="flex h-full flex-col p-6">
              <CardHeader dark title="Approval pathway" />
              <div className="mt-4 flex-1 space-y-0">
                {steps.map((s, i) => (
                  <div key={s.label} className="flex gap-3.5">
                    <div className="flex flex-col items-center">
                      {s.done ? (
                        <CheckCircle2 size={20} className="text-success-400" />
                      ) : s.current ? (
                        <span className="relative flex h-5 w-5 items-center justify-center">
                          <span className="absolute inset-0 animate-ping rounded-full bg-crimson-400/50" />
                          <span className="h-3 w-3 rounded-full bg-crimson-400" />
                        </span>
                      ) : (
                        <Circle size={20} className="text-white/20" />
                      )}
                      {i < steps.length - 1 && <span className={cx('my-1 w-px flex-1', s.done ? 'bg-success-400/40' : 'bg-white/10')} />}
                    </div>
                    <div className="pb-3.5">
                      <div className={cx('text-sm font-semibold', s.current ? 'text-white' : s.done ? 'text-white/85' : 'text-white/40')}>{s.label}</div>
                      <div className="text-xs text-white/45">
                        {s.who} · {s.when}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {published ? (
                <div className="rounded-2xl border border-success-400/25 bg-success-400/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-success-400">
                    <Megaphone size={16} /> Published to all portals
                  </div>
                  <div className="mt-1 text-sm text-white/65">
                    Delivered to <CountUp value={7180} from={0} duration={1.2} /> recipients · 0 failures
                  </div>
                </div>
              ) : (
                <Button
                  size="xl"
                  variant="crimson"
                  story="publish-decision"
                  className="w-full"
                  onClick={() => dispatch({ type: 'openDialog', dialog: 'decision' })}
                >
                  <Gavel size={18} /> Sign & publish decision
                </Button>
              )}
            </Card>
          </Reveal>
        </div>
      </div>
    </ExecShell>
  )
}

function Channel({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-1.5 text-xs text-white/50">
        <span className="text-sky">{icon}</span>
        {label}
      </div>
      <div className="mt-1.5 text-lg font-semibold tabular-nums">{value}</div>
    </div>
  )
}
