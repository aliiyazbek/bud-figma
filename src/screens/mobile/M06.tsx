import { CreditCard, Receipt, Sparkles, Lock, Building2, CalendarClock } from 'lucide-react'
import { motion } from 'motion/react'
import { MobileShell, MobileHeader } from '../../components/mobile'
import { Reveal, Badge, Button, CountUp, Progress, cx } from '../../components/ui'
import { useDemo, useDerived } from '../../state/DemoContext'
import { finance } from '../../data/demo'

export default function M06() {
  const { state } = useDemo()
  const { invoice, prevInvoice, credits } = useDerived()
  const reg = state.registrationConfirmed
  const pct = (invoice.paid / invoice.total) * 100
  return (
    <MobileShell tab="M06">
      <MobileHeader title="Fees & Invoices" subtitle="Invoice INV-26-0187 · Fall 2026" back={false} />
      <div className="space-y-4 px-4 pb-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] bg-navy p-5 text-white shadow-float" data-story="balance">
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-crimson/30 blur-3xl" />
            <div className="relative flex items-center justify-between">
              <span className="text-[12.5px] text-white/60">Balance due</span>
              {reg && (
                <Badge tone="navy" className="border-white/20 bg-white/15 text-white" icon={<Sparkles size={11} />}>
                  Updated · CS301 added
                </Badge>
              )}
            </div>
            <div className="relative mt-1 text-[46px] leading-none font-bold tracking-tight">
              <CountUp value={invoice.balance} from={reg ? prevInvoice.balance : undefined} prefix="$" delay={0.5} duration={1.1} />
            </div>
            <div className="relative mt-2 flex items-center gap-1.5 text-[12.5px] text-white/65">
              <CalendarClock size={13} /> Due {finance.dueDate}
            </div>
            <div className="relative mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-4">
              <div>
                <div className="text-[11.5px] text-white/50">Invoice total</div>
                <div className="text-[18px] font-bold">
                  <CountUp value={invoice.total} from={reg ? prevInvoice.total : undefined} prefix="$" delay={0.5} duration={1.1} />
                </div>
              </div>
              <div>
                <div className="text-[11.5px] text-white/50">Paid so far</div>
                <div className="text-[18px] font-bold tabular-nums">${invoice.paid}</div>
              </div>
            </div>
            <Progress dark className="relative mt-3" value={pct} tone="sky" />
          </div>
        </Reveal>

        <Reveal i={1}>
          <div className="rounded-[20px] bg-white p-4 ring-1 ring-line">
            <div className="text-[13px] font-semibold text-subtle">Line items</div>
            <div className="mt-2.5 space-y-2.5 text-[13.5px]">
              <Item label="Tuition · 12 cr × $100" value="$1,200" />
              {reg && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ delay: 0.3 }}>
                  <Item label="CS301 Database Systems · 3 cr" value="$300" highlight />
                </motion.div>
              )}
              <Item label="Student services fee" value="$100" />
              <div className="flex justify-between border-t border-line pt-2.5 font-bold">
                <span>Total · {credits} credit hours</span>
                <span className="tabular-nums">${invoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal i={2}>
          <div className="rounded-[20px] bg-white p-4 ring-1 ring-line">
            <div className="text-[13px] font-semibold text-subtle">Payments</div>
            <div className="mt-2 divide-y divide-line">
              {finance.payments.map((p) => (
                <div key={p.ref} className="flex items-center gap-3 py-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-success-50 text-success">
                    <CreditCard size={16} />
                  </span>
                  <span className="flex-1">
                    <span className="block text-[13.5px] font-semibold">{p.method}</span>
                    <span className="block text-[11.5px] text-muted">
                      {p.date} · {p.ref}
                    </span>
                  </span>
                  <span className="text-[14px] font-bold tabular-nums">${p.amount}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal i={3}>
          <Button size="lg" className="w-full" disabled>
            <Lock size={15} /> Online payment — coming soon
          </Button>
          <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[12px] text-muted">
            <Building2 size={13} /> Pay at the cashier desk, Administration building
          </div>
        </Reveal>
      </div>
    </MobileShell>
  )
}

function Item({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={cx('flex items-center justify-between gap-2', highlight && '-mx-2 rounded-lg bg-success-50 px-2 py-1.5 text-success')}>
      <span className="flex items-center gap-2">
        {highlight ? <Sparkles size={13} /> : <Receipt size={13} className="text-subtle" />}
        {label}
      </span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  )
}
