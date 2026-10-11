import { Landmark, Wallet, AlertCircle, Percent, Sparkles, Receipt, CreditCard } from 'lucide-react'
import { motion } from 'motion/react'
import { AdminShell } from '../../components/shells'
import { Card, CardHeader, Reveal, Badge, CountUp, Progress, cx } from '../../components/ui'
import { LineChart, BarChart } from '../../components/charts'
import { useDemo, useDerived } from '../../state/DemoContext'
import { finance, student } from '../../data/demo'
import { Stat } from './W03'
import { useNav } from '../../state/NavContext'
import { useToast } from '../../components/toast'

export default function W07() {
  const { state } = useDemo()
  const { go } = useNav()
  const toast = useToast()
  const { invoice, prevInvoice, credits } = useDerived()
  const extra = state.registrationConfirmed ? 300 : 0
  const billed = 4821300 + extra
  const collected = 3612480
  const outstanding = billed - collected
  const reg = state.registrationConfirmed

  const students = [
    { name: 'Maya Haddad', id: student.id, prog: 'Software Eng.', total: invoice.total, paid: invoice.paid, maya: true },
    { name: 'Ahmad Rifai', id: 'BUD-2024-0102', prog: 'Software Eng.', total: 1600, paid: 1600 },
    { name: 'Lea Tawil', id: 'BUD-2022-0098', prog: 'Computer Eng.', total: 1900, paid: 950 },
    { name: 'Karim Issa', id: 'BUD-2024-0233', prog: 'Electrical Eng.', total: 1300, paid: 0 },
    { name: 'Rana Hamwi', id: 'BUD-2025-0017', prog: 'Pharmacy', total: 1700, paid: 1700 },
    { name: 'Omar Sabbagh', id: 'BUD-2023-0412', prog: 'Business Admin.', total: 1300, paid: 650 },
  ]

  return (
    <AdminShell title="Finance Overview" crumb="Services · Finance · Fall 2026 billing" user={{ name: 'Huda Sharif', role: 'Finance Director', initials: 'HS' }}>
      <div className="flex h-full flex-col gap-6">
        <div className="grid grid-cols-4 gap-5">
          <Stat i={0} icon={<Landmark size={18} />} label="Billed this semester" value={<CountUp value={billed} from={reg ? 4821300 : 0} prefix="$" />} note="6,240 student invoices" />
          <Stat i={1} icon={<Wallet size={18} />} label="Collected" value={<CountUp value={collected} from={0} prefix="$" />} note="Bank transfer 61% · Cashier 39%" />
          <Stat i={2} icon={<AlertCircle size={18} />} label="Outstanding" value={<CountUp value={outstanding} from={reg ? outstanding - 300 : 0} prefix="$" />} note="Due 1 Oct 2026" />
          <Stat i={3} icon={<Percent size={18} />} label="Collection rate" value="74.9%" note="+6.2 pts vs same week 2025" />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[1.5fr_1fr] gap-6">
          <div className="flex min-h-0 flex-col gap-6">
            <div className="grid grid-cols-[1.3fr_1fr] gap-6">
              <Reveal i={4}>
                <Card className="h-full p-6">
                  <CardHeader title="Cumulative collection" subtitle="% of billed amount · Fall 2026 vs Fall 2025" />
                  <div className="mt-4">
                    <LineChart
                      width={500}
                      height={200}
                      min={0}
                      max={100}
                      labels={['Jul 1', 'Jul 15', 'Aug 1', 'Aug 15', 'Sep 1', 'Sep 13']}
                      format={(v) => `${v}%`}
                      series={[
                        { values: [8, 19, 33, 47, 63, 68.7], color: 'var(--color-subtle)', dashed: true },
                        { values: [12, 26, 41, 56, 70, 74.9], color: 'var(--color-navy)', area: true },
                      ]}
                    />
                  </div>
                </Card>
              </Reveal>
              <Reveal i={5}>
                <Card className="h-full p-6">
                  <CardHeader title="Outstanding by faculty" subtitle="USD thousands" />
                  <div className="mt-4">
                    <BarChart
                      width={340}
                      height={200}
                      accentIndex={0}
                      accentColor="var(--color-crimson)"
                      data={[
                        { label: 'Eng.', value: 362 },
                        { label: 'Bus.', value: 298 },
                        { label: 'Pharm.', value: 274 },
                        { label: 'Arch.', value: 168 },
                        { label: 'Media', value: 107 },
                      ]}
                      format={(v) => `${v}`}
                    />
                  </div>
                </Card>
              </Reveal>
            </div>
            <Reveal i={6} className="min-h-0 flex-1">
              <Card className="h-full p-6">
                <CardHeader title="Student balances" subtitle="Updated automatically from registration" />
                <table className="mt-3 w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[11px] font-semibold tracking-wider text-subtle uppercase">
                      <th className="pb-2.5 font-semibold">Student</th>
                      <th className="pb-2.5 font-semibold">Programme</th>
                      <th className="pb-2.5 text-right font-semibold">Invoice</th>
                      <th className="pb-2.5 text-right font-semibold">Paid</th>
                      <th className="pb-2.5 text-right font-semibold">Balance</th>
                      <th className="pb-2.5 text-right font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => {
                      const bal = s.total - s.paid
                      return (
                        <tr key={s.id} onClick={() => (s.maya ? go('W04') : bal > 0 ? toast(`Payment reminder sent to ${s.name}`) : toast(`${s.name} is fully paid`, 'info'))} title={s.maya ? 'Open Student 360' : 'Send payment reminder'} className={cx('cursor-pointer border-b border-line/70 transition-colors hover:bg-ivory', s.maya && 'bg-navy-50/70')} data-story={s.maya ? 'maya-row' : undefined}>
                          <td className="py-2.5">
                            <div className="font-semibold">{s.name}</div>
                            <div className="text-xs text-muted tabular-nums">{s.id}</div>
                          </td>
                          <td className="py-2.5 text-muted">{s.prog}</td>
                          <td className="py-2.5 text-right tabular-nums">
                            {s.maya ? <CountUp value={s.total} from={reg ? prevInvoice.total : undefined} prefix="$" /> : `$${s.total.toLocaleString()}`}
                          </td>
                          <td className="py-2.5 text-right text-muted tabular-nums">${s.paid.toLocaleString()}</td>
                          <td className={cx('py-2.5 text-right font-semibold tabular-nums', bal > 0 && 'text-crimson')}>
                            {s.maya ? <CountUp value={bal} from={reg ? prevInvoice.balance : undefined} prefix="$" /> : `$${bal.toLocaleString()}`}
                          </td>
                          <td className="py-2.5 text-right">
                            {bal === 0 ? <Badge tone="success">Paid</Badge> : s.paid === 0 ? <Badge tone="danger">Unpaid</Badge> : <Badge tone="warning">Partial</Badge>}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </Card>
            </Reveal>
          </div>

          {/* Invoice statement */}
          <Reveal i={7} className="min-h-0">
            <Card className="flex h-full flex-col overflow-hidden" story="maya-invoice">
              <div className="bg-navy px-7 pt-6 pb-7 text-white">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold tracking-[0.16em] text-white/55 uppercase">Invoice statement</div>
                  {reg && (
                    <motion.span initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      <Badge tone="navy" className="border-white/25 bg-white/15 text-white" icon={<Sparkles size={11} />}>
                        Updated from registration
                      </Badge>
                    </motion.span>
                  )}
                </div>
                <div className="mt-3 text-xl font-semibold">INV-26-0187 · {student.name}</div>
                <div className="text-sm text-white/55">
                  {student.id} · {student.program} · Due {finance.dueDate}
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <div className="text-xs text-white/55">Balance due</div>
                    <div className="mt-1 text-[46px] leading-none font-semibold tracking-tight">
                      <CountUp value={invoice.balance} from={reg ? prevInvoice.balance : undefined} prefix="$" />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-white/55">Invoice total</div>
                    <div className="mt-1 text-2xl font-semibold">
                      <CountUp value={invoice.total} from={reg ? prevInvoice.total : undefined} prefix="$" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 px-7 py-5">
                <div className="text-xs font-semibold tracking-wider text-subtle uppercase">Line items</div>
                <div className="mt-3 space-y-3 text-sm">
                  <Line icon={<Receipt size={15} />} label="Tuition · 12 credit hours × $100" value="$1,200" />
                  {reg && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                      <Line icon={<Sparkles size={15} />} label="CS301 Database Systems · 3 cr × $100" value="$300" highlight />
                    </motion.div>
                  )}
                  <Line icon={<Receipt size={15} />} label="Student services fee" value="$100" />
                </div>
                <div className="mt-4 flex justify-between border-t border-line pt-4 text-sm font-semibold">
                  <span>Total · {credits} credit hours</span>
                  <span className="tabular-nums">${invoice.total.toLocaleString()}</span>
                </div>
                <div className="mt-6 text-xs font-semibold tracking-wider text-subtle uppercase">Payments</div>
                <div className="mt-3 space-y-3 text-sm">
                  {finance.payments.map((p) => (
                    <Line key={p.ref} icon={<CreditCard size={15} />} label={`${p.date} · ${p.method}`} value={`−$${p.amount}`} muted />
                  ))}
                </div>
                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-xs text-muted">
                    <span>Paid ${invoice.paid} of ${invoice.total.toLocaleString()}</span>
                    <span className="tabular-nums">{Math.round((invoice.paid / invoice.total) * 100)}%</span>
                  </div>
                  <Progress value={(invoice.paid / invoice.total) * 100} tone="success" />
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </AdminShell>
  )
}

function Line({ icon, label, value, highlight, muted }: { icon: React.ReactNode; label: string; value: string; highlight?: boolean; muted?: boolean }) {
  return (
    <div className={cx('flex items-center gap-3', highlight && '-mx-2 rounded-lg bg-success-50 px-2 py-1.5')}>
      <span className={cx(highlight ? 'text-success' : 'text-subtle')}>{icon}</span>
      <span className={cx('flex-1', muted ? 'text-muted' : 'text-ink')}>{label}</span>
      <span className={cx('font-medium tabular-nums', highlight && 'text-success')}>{value}</span>
    </div>
  )
}
