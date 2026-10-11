import { BusFront, Clock, AlertTriangle, BadgeCheck, MapPin, Info, QrCode } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { MobileShell, MobileHeader } from '../../components/mobile'
import { RouteLine } from '../../components/maps'
import { Reveal, Badge } from '../../components/ui'
import { useDemo } from '../../state/DemoContext'
import { transport } from '../../data/demo'

export default function M05() {
  const { state } = useDemo()
  const moved = state.tripRescheduled
  const time = moved ? transport.newTime : transport.oldTime
  const stops = moved
    ? [
        { name: 'Stop 4', time: '07:00' },
        { name: 'Kafr Sousa', time: '07:13' },
        { name: 'Umayyad', time: '07:26' },
        { name: 'Campus', time: '07:55' },
      ]
    : [
        { name: 'Stop 4', time: '07:15' },
        { name: 'Kafr Sousa', time: '07:28' },
        { name: 'Umayyad', time: '07:41' },
        { name: 'Campus', time: '08:10' },
      ]
  return (
    <MobileShell>
      <MobileHeader title="My Transport" subtitle={transport.subscription} />
      <div className="space-y-4 px-4 pb-6">
        <AnimatePresence>
          {moved && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-warning-50 p-3.5 ring-1 ring-warning/25" data-story="trip-change">
              <div className="flex items-center gap-2 text-[13.5px] font-bold text-warning">
                <AlertTriangle size={16} /> Schedule change from tomorrow
              </div>
              <div className="mt-1 text-[12.5px] leading-snug text-ink">
                Your pickup moves <span className="font-semibold">15 minutes earlier</span> because of roadworks near Umayyad Square.
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Reveal>
          <div className="overflow-hidden rounded-[24px] bg-navy text-white shadow-float">
            <div className="flex items-center justify-between px-5 pt-5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-10 items-center justify-center rounded-lg bg-crimson text-[12px] font-bold">{transport.lineShort}</span>
                <div>
                  <div className="text-[15px] font-bold">{transport.line}</div>
                  <div className="text-[12px] text-white/55">
                    {transport.bus} · {transport.plate}
                  </div>
                </div>
              </div>
              <BusFront size={22} className="text-white/40" />
            </div>
            <div className="px-5 pt-5 pb-4">
              <div className="text-[12px] text-white/55">Tomorrow’s pickup</div>
              <div className="mt-1 flex items-end gap-3">
                <motion.span key={time} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[54px] leading-none font-bold tracking-tight tabular-nums">
                  {time}
                </motion.span>
                {moved && <span className="mb-1.5 text-[18px] font-medium text-white/40 line-through tabular-nums">{transport.oldTime}</span>}
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[13px] text-white/70">
                <MapPin size={14} /> {transport.stop}
              </div>
            </div>
            <div className="bg-white/[0.06] px-2 pt-3">
              <RouteLine dark width={342} stops={stops} highlight={0} color="var(--color-sky)" />
            </div>
          </div>
        </Reveal>

        <Reveal i={1}>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl bg-white p-3.5 ring-1 ring-line">
              <Clock size={16} className="text-navy" />
              <div className="mt-2 text-[12px] text-subtle">Arrives at campus</div>
              <div className="text-[17px] font-bold tabular-nums">{moved ? transport.arrival : '08:10'}</div>
            </div>
            <div className="rounded-2xl bg-white p-3.5 ring-1 ring-line">
              <BadgeCheck size={16} className="text-success" />
              <div className="mt-2 text-[12px] text-subtle">Return trip</div>
              <div className="text-[17px] font-bold tabular-nums">14:45</div>
            </div>
          </div>
        </Reveal>

        <Reveal i={2}>
          <div className="flex items-center gap-3.5 rounded-[20px] bg-white p-4 ring-1 ring-line">
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-ivory text-navy">
              <QrCode size={30} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[14px] font-bold">Semester pass</div>
              <div className="text-[12px] text-muted">Valid until {transport.validUntil}</div>
            </div>
            <Badge tone="success">Active</Badge>
          </div>
        </Reveal>
        <div className="flex items-start gap-2 px-1 text-[11.5px] leading-snug text-subtle">
          <Info size={13} className="mt-px shrink-0" /> Times are schedule-based. Live bus tracking is not part of this demo.
        </div>
      </div>
    </MobileShell>
  )
}
