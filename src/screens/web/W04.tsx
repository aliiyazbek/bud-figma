import { Mail, Phone, BookOpen, Receipt, Award, FileText, FileCheck2, Megaphone, BusFront, CalendarCheck, CreditCard, UserCheck, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { AdminShell } from '../../components/shells'
import { Card, CardHeader, Reveal, Badge, Progress, CountUp, GradedImage, DemoTag, cx } from '../../components/ui'
import { useDemo, useDerived, type LogKind } from '../../state/DemoContext'
import { student, grade, decision, transport } from '../../data/demo'
import { images } from '../../data/images'

const logMeta: Record<LogKind, { title: string; detail: string; time: string; icon: typeof Award; tone: string }> = {
  registration: { title: 'Registered in CS301 · Section B', detail: 'Conflict with CS305 avoided · 15 credit hours', time: 'Today, 09:32', icon: CalendarCheck, tone: 'bg-navy text-white' },
  invoice: { title: 'Invoice INV-26-0187 updated', detail: 'Total $1,300 → $1,600 · Balance $800', time: 'Today, 09:32', icon: Receipt, tone: 'bg-navy-50 text-navy' },
  grades: { title: `${grade.course} ${grade.assessment} published`, detail: `Score ${grade.maya}/100 · approved by Dean`, time: 'Today, 09:36', icon: Award, tone: 'bg-success-50 text-success' },
  'transcript-requested': { title: 'Transcript requested', detail: 'DOC-3391 · via mobile app', time: 'Today, 09:38', icon: FileText, tone: 'bg-navy-50 text-navy' },
  'transcript-ready': { title: 'Transcript issued', detail: 'DOC-3391 ready for download', time: 'Today, 09:39', icon: FileCheck2, tone: 'bg-success-50 text-success' },
  decision: { title: `Received ${decision.id}`, detail: 'Academic calendar amendment', time: 'Today, 09:43', icon: Megaphone, tone: 'bg-crimson-50 text-crimson' },
  trip: { title: `${transport.line} rescheduled`, detail: `Pickup ${transport.oldTime} → ${transport.newTime} · notified`, time: 'Today, 09:46', icon: BusFront, tone: 'bg-warning-50 text-warning' },
}

const base = [
  { title: 'Payment received · $300', detail: 'PAY-55871 · Cashier desk', time: '3 Sep 2026', icon: CreditCard, tone: 'bg-navy-50 text-navy' },
  { title: 'Fall 2026 registration · 12 credits', detail: 'Approved by advisor Dr. Lina Saleh', time: '1 Sep 2026', icon: UserCheck, tone: 'bg-navy-50 text-navy' },
  { title: 'Payment received · $500', detail: 'PAY-55102 · Bank transfer', time: '28 Aug 2026', icon: CreditCard, tone: 'bg-navy-50 text-navy' },
]

export default function W04() {
  const { state } = useDemo()
  const { courses, credits, invoice, prevInvoice } = useDerived()
  const timeline = [...state.log].reverse().map((k) => ({ key: k, ...logMeta[k] }))
  const paidPct = Math.round((invoice.paid / invoice.total) * 100)

  return (
    <AdminShell title="Student 360" crumb="Academic · Students · BUD-2024-0187" user={{ name: 'Rania Kassab', role: 'Student Affairs Officer', initials: 'RK' }}>
      <div className="grid h-full grid-cols-[360px_1fr_420px] gap-6">
        {/* Profile */}
        <Reveal className="min-h-0">
          <Card className="flex h-full flex-col overflow-hidden">
            <GradedImage src={images.portrait.src} alt={images.portrait.alt} strength="soft" className="h-[230px] shrink-0">
              <div className="flex h-full items-end justify-between p-5">
                <Badge tone="navy" className="bg-white/15 border-white/20 backdrop-blur">Active · {student.year}</Badge>
                <DemoTag dark>Demo persona</DemoTag>
              </div>
            </GradedImage>
            <div className="flex-1 p-6">
              <div className="text-[24px] font-semibold tracking-tight">{student.name}</div>
              <div className="mt-0.5 text-sm text-muted tabular-nums">{student.id}</div>
              <div className="mt-4 space-y-2 text-sm">
                <Row label="Programme" value={student.program} />
                <Row label="Faculty" value="Engineering & IT" />
                <Row label="Advisor" value={student.advisor} />
                <Row label="Standing" value={<Badge tone="success">Good standing</Badge>} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-ivory p-4">
                  <div className="text-xs text-subtle">Cumulative GPA</div>
                  <div className="mt-1 text-[28px] leading-none font-semibold tabular-nums">{student.gpa.toFixed(2)}</div>
                </div>
                <div className="rounded-2xl bg-ivory p-4">
                  <div className="text-xs text-subtle">Credits earned</div>
                  <div className="mt-1 text-[28px] leading-none font-semibold tabular-nums">
                    {student.creditsEarned}
                    <span className="text-base font-medium text-subtle">/{student.creditsRequired}</span>
                  </div>
                </div>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs text-muted">
                  <span>Degree progress</span>
                  <span className="tabular-nums">59%</span>
                </div>
                <Progress value={59} tone="crimson" />
              </div>
              <div className="mt-6 space-y-2.5 border-t border-line pt-5 text-sm text-muted">
                <div className="flex items-center gap-2.5">
                  <Mail size={15} /> {student.email}
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone size={15} /> +963 9•• ••• 214
                </div>
              </div>
            </div>
          </Card>
        </Reveal>

        {/* Middle */}
        <div className="flex min-h-0 flex-col gap-6">
          <Reveal i={1}>
            <Card className="p-6" story="w04-registration">
              <CardHeader
                title="Fall 2026 registration"
                subtitle="Synced with the mobile app in real time"
                action={<Badge tone={state.registrationConfirmed ? 'success' : 'info'}>{credits} credit hours</Badge>}
              />
              <div className="mt-4 divide-y divide-line">
                {courses.map((c) => {
                  const isNew = c.code === 'CS301'
                  return (
                    <motion.div
                      key={c.code}
                      initial={isNew ? { opacity: 0, x: -10 } : false}
                      animate={{ opacity: 1, x: 0 }}
                      className={cx('grid grid-cols-[90px_1fr_150px_80px_60px] items-center gap-3 py-3 text-sm', isNew && 'rounded-lg bg-success-50/60')}
                    >
                      <span className="pl-1 font-semibold">{c.code}</span>
                      <span className="flex items-center gap-2 truncate">
                        {c.title}
                        {isNew && <Badge tone="success" icon={<Sparkles size={11} />}>Added today</Badge>}
                      </span>
                      <span className="text-muted tabular-nums">
                        {c.days.join('/')} {c.start}
                      </span>
                      <span className="text-muted">{c.room}</span>
                      <span className="text-right text-muted tabular-nums">{c.credits} cr</span>
                    </motion.div>
                  )
                })}
              </div>
            </Card>
          </Reveal>
          <div className="grid min-h-0 flex-1 grid-cols-2 gap-6">
            <Reveal i={2} className="min-h-0">
              <Card className="h-full p-6" story="w04-finance">
                <CardHeader title="Payments" subtitle="Invoice INV-26-0187" action={<Receipt size={18} className="text-subtle" />} />
                <div className="mt-5 text-xs text-subtle">Balance due · {'1 Oct 2026'}</div>
                <div className="mt-1 text-[40px] leading-none font-semibold tracking-tight text-crimson">
                  <CountUp value={invoice.balance} from={state.registrationConfirmed ? prevInvoice.balance : undefined} prefix="$" />
                </div>
                <div className="mt-5 mb-2 flex justify-between text-xs text-muted">
                  <span>
                    Paid ${invoice.paid.toLocaleString()} of ${invoice.total.toLocaleString()}
                  </span>
                  <span className="tabular-nums">{paidPct}%</span>
                </div>
                <Progress value={paidPct} tone="success" />
                <div className="mt-5 space-y-2 text-sm">
                  <Row label={`Tuition · ${credits} cr × $100`} value={`$${invoice.tuition.toLocaleString()}`} />
                  <Row label="Student services fee" value="$100" />
                  <Row label="Payments received" value={`−$${invoice.paid}`} />
                </div>
              </Card>
            </Reveal>
            <Reveal i={3} className="min-h-0">
              <Card className="h-full p-6">
                <CardHeader title="Academic plan" subtitle="BSc Software Engineering · 132 credits" action={<BookOpen size={18} className="text-subtle" />} />
                <div className="mt-5 space-y-4">
                  {[
                    { l: 'University requirements', v: 18, t: 21 },
                    { l: 'Faculty core', v: 33, t: 42 },
                    { l: 'Major courses', v: 24 + (state.registrationConfirmed ? 0 : 0), t: 54 },
                    { l: 'Electives', v: 3, t: 15 },
                  ].map((p) => (
                    <div key={p.l}>
                      <div className="mb-1.5 flex justify-between text-xs">
                        <span className="text-muted">{p.l}</span>
                        <span className="font-medium tabular-nums">
                          {p.v}/{p.t}
                        </span>
                      </div>
                      <Progress value={(p.v / p.t) * 100} />
                    </div>
                  ))}
                </div>
                <div className="mt-5 rounded-xl bg-ivory px-4 py-3 text-xs text-muted">
                  {state.registrationConfirmed ? 'In progress: 15 credits incl. CS301 Database Systems' : 'In progress: 12 credits this semester'}
                </div>
              </Card>
            </Reveal>
          </div>
        </div>

        {/* Timeline */}
        <Reveal i={4} className="min-h-0">
          <Card className="flex h-full flex-col p-6" story="w04-timeline">
            <CardHeader title="Activity timeline" subtitle="Every system, one record" action={<Badge tone={timeline.length ? 'success' : 'neutral'}>{timeline.length} new today</Badge>} />
            <div className="mt-3 rounded-xl border border-line bg-ivory/60 px-4 py-3">
              <div className="text-xs font-semibold text-muted">Documents</div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <FileText size={15} className="text-navy" />
                <span className="flex-1">Academic transcript · DOC-3391</span>
                <Badge tone={state.transcript === 'ready' ? 'success' : state.transcript === 'processing' ? 'warning' : 'neutral'}>
                  {state.transcript === 'ready' ? 'Issued' : state.transcript === 'processing' ? 'Processing' : 'Not requested'}
                </Badge>
              </div>
            </div>
            <div className="no-scrollbar mt-4 min-h-0 flex-1 overflow-y-auto">
              <AnimatePresence initial={false}>
                {[...timeline, ...base.map((b) => ({ key: b.title, ...b }))].map((t, i, arr) => (
                  <motion.div
                    key={t.key}
                    layout
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="flex gap-3.5"
                  >
                    <div className="flex flex-col items-center">
                      <span className={cx('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', t.tone)}>
                        <t.icon size={16} />
                      </span>
                      {i < arr.length - 1 && <span className="my-1 w-px flex-1 bg-line" />}
                    </div>
                    <div className="min-w-0 pb-4">
                      <div className="text-sm font-semibold">{t.title}</div>
                      <div className="text-xs text-muted">{t.detail}</div>
                      <div className="mt-0.5 text-[11px] text-subtle tabular-nums">{t.time}</div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </Card>
        </Reveal>
      </div>
    </AdminShell>
  )
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className="text-right font-medium text-ink tabular-nums">{value}</span>
    </div>
  )
}
