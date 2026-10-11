import { Bus, Route, Users, Gauge as GaugeIcon, Clock, ArrowRight, CalendarClock, BellRing, Info, CheckCircle2 } from 'lucide-react'
import { AdminShell } from '../../components/shells'
import { Card, CardHeader, Reveal, Badge, Button, Dialog, Progress, cx } from '../../components/ui'
import { RouteLine } from '../../components/maps'
import { useDemo } from '../../state/DemoContext'
import { transport } from '../../data/demo'
import { Stat } from './W03'

const shift = (t: string, mins: number) => {
  const [h, m] = t.split(':').map(Number)
  const v = h * 60 + m + mins
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`
}

export default function W06() {
  const { state, dispatch } = useDemo()
  const moved = state.tripRescheduled
  const off = moved ? -15 : 0
  const stops = [
    { name: 'Mezzeh Stop 4', t: '07:15' },
    { name: 'Kafr Sousa', t: '07:28' },
    { name: 'Mazzeh Autostrad', t: '07:34' },
    { name: 'Umayyad Sq.', t: '07:41' },
    { name: 'BUD Campus', t: '08:10' },
  ].map((s) => ({ name: s.name, time: shift(s.t, off) }))

  const lines = [
    { id: 'L1', name: 'Malki Line 1', buses: 6, riders: 312, occ: 84 },
    { id: 'L2', name: 'Dummar Line 2', buses: 5, riders: 248, occ: 77 },
    { id: 'L3', name: transport.line, buses: 7, riders: 386, occ: 93, active: true },
    { id: 'L4', name: 'Jaramana Line 4', buses: 6, riders: 301, occ: 80 },
    { id: 'L5', name: 'Barzeh Line 5', buses: 5, riders: 237, occ: 72 },
    { id: 'L6', name: 'Sahnaya Line 6', buses: 5, riders: 229, occ: 76 },
    { id: 'L7', name: 'Qudsaya Line 7 (proposed)', buses: 4, riders: 0, occ: 0, proposed: true },
  ]

  const trips = [
    { id: 'T3-01', dir: 'To campus', time: moved ? transport.newTime : transport.oldTime, bus: 'Bus 12', riders: 46, cap: 50, changed: moved, story: true },
    { id: 'T3-02', dir: 'To campus', time: '08:30', bus: 'Bus 17', riders: 41, cap: 50 },
    { id: 'T3-03', dir: 'To campus', time: '10:15', bus: 'Bus 12', riders: 22, cap: 50 },
    { id: 'T3-04', dir: 'From campus', time: '14:45', bus: 'Bus 17', riders: 48, cap: 50 },
    { id: 'T3-05', dir: 'From campus', time: '16:15', bus: 'Bus 12', riders: 39, cap: 50 },
  ]

  return (
    <AdminShell
      title="Transport Operations"
      crumb="Services · Transport · Fall 2026 timetable"
      user={{ name: 'Bassam Nahhas', role: 'Transport Coordinator', initials: 'BN' }}
      overlay={
        <Dialog
          open={state.dialog === 'trip'}
          onClose={() => dispatch({ type: 'closeDialog' })}
          story="trip-dialog"
          icon={
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning-50 text-warning">
              <CalendarClock size={20} />
            </span>
          }
          title="Reschedule trip T3-01?"
          footer={
            <>
              <Button variant="secondary" onClick={() => dispatch({ type: 'closeDialog' })}>
                Cancel
              </Button>
              <Button data-autofocus story="confirm-trip" onClick={() => dispatch({ type: 'rescheduleTrip' })}>
                <BellRing size={16} /> Save & notify riders
              </Button>
            </>
          }
        >
          <div className="flex items-center justify-center gap-6 rounded-2xl bg-ivory py-6">
            <div className="text-center">
              <div className="text-xs text-subtle">Current</div>
              <div className="text-[34px] font-semibold text-subtle line-through tabular-nums">{transport.oldTime}</div>
            </div>
            <ArrowRight className="text-navy" />
            <div className="text-center">
              <div className="text-xs text-subtle">New departure</div>
              <div className="text-[34px] font-semibold text-navy tabular-nums">{transport.newTime}</div>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Starting tomorrow, all stops on {transport.line} shift 15 minutes earlier to avoid the Umayyad Square roadworks. <span className="font-semibold text-ink">46 subscribed riders</span> will be notified in the app.
          </p>
        </Dialog>
      }
    >
      <div className="flex h-full flex-col gap-6">
        <div className="grid grid-cols-4 gap-5">
          <Stat i={0} icon={<Route size={18} />} label="Active lines" value="6" note="1 proposed · Qudsaya" />
          <Stat i={1} icon={<Bus size={18} />} label="Buses in service" value="34" note="4 on standby" />
          <Stat i={2} icon={<Users size={18} />} label="Subscribed riders" value="1,713" note="Semester passes · Fall 2026" />
          <Stat i={3} icon={<GaugeIcon size={18} />} label="Avg. seat occupancy" value="81%" note="Peak 93% · Mezzeh Line 3" />
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-[440px_1fr] gap-6">
          <Reveal i={4} className="min-h-0">
            <Card className="h-full p-6">
              <CardHeader title="Lines" subtitle="Morning peak occupancy" />
              <div className="mt-4 space-y-2">
                {lines.map((l) => (
                  <div key={l.id} className={cx('rounded-xl border px-4 py-3', l.active ? 'border-navy/25 bg-navy-50/70' : 'border-line')}>
                    <div className="flex items-center gap-3">
                      <span className={cx('flex h-8 w-9 items-center justify-center rounded-lg text-xs font-bold', l.active ? 'bg-crimson text-white' : 'bg-ivory text-navy')}>{l.id}</span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{l.name}</div>
                        <div className="text-xs text-muted">{l.proposed ? 'Awaiting decision DEC-2026-012' : `${l.buses} buses · ${l.riders} riders`}</div>
                      </div>
                      {!l.proposed && <span className="text-sm font-semibold tabular-nums">{l.occ}%</span>}
                    </div>
                    {!l.proposed && <Progress className="mt-2.5" value={l.occ} tone={l.occ > 90 ? 'crimson' : 'navy'} />}
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>
          <div className="flex min-h-0 flex-col gap-6">
            <Reveal i={5}>
              <Card className="p-6">
                <CardHeader
                  title={<span className="flex items-center gap-3">{transport.line} · route schematic</span>}
                  subtitle="Scheduled stop times for trip T3-01 · not to scale"
                  action={
                    <Badge icon={<Info size={11} />}>Schedule-based · no live GPS tracking</Badge>
                  }
                />
                <div className="mt-4 rounded-2xl bg-ivory px-4 pt-4 pb-2">
                  <RouteLine width={1020} stops={stops} highlight={0} />
                </div>
              </Card>
            </Reveal>
            <Reveal i={6} className="min-h-0 flex-1">
              <Card className="flex h-full flex-col p-6">
                <CardHeader
                  title="Today’s trips · Line 3"
                  subtitle="Changes are pushed instantly to subscribed students"
                  action={
                    moved ? (
                      <Badge tone="success" icon={<CheckCircle2 size={12} />}>46 riders notified</Badge>
                    ) : (
                      <Button size="md" variant="primary" story="reschedule" onClick={() => dispatch({ type: 'openDialog', dialog: 'trip' })}>
                        <CalendarClock size={16} /> Reschedule T3-01
                      </Button>
                    )
                  }
                />
                <table className="mt-4 w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-[11px] font-semibold tracking-wider text-subtle uppercase">
                      <th className="pb-3 font-semibold">Trip</th>
                      <th className="pb-3 font-semibold">Direction</th>
                      <th className="pb-3 font-semibold">Departure</th>
                      <th className="pb-3 font-semibold">Bus</th>
                      <th className="w-[260px] pb-3 font-semibold">Booked seats</th>
                      <th className="pb-3 text-right font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((t) => (
                      <tr key={t.id} className={cx('border-b border-line/70', t.changed && 'bg-warning-50/60')}>
                        <td className="py-3 font-semibold">{t.id}</td>
                        <td className="py-3 text-muted">{t.dir}</td>
                        <td className="py-3">
                          <span className="flex items-center gap-2 font-semibold tabular-nums">
                            <Clock size={14} className="text-subtle" />
                            {t.changed && <span className="font-normal text-subtle line-through">{transport.oldTime}</span>}
                            {t.time}
                          </span>
                        </td>
                        <td className="py-3 text-muted">{t.bus}</td>
                        <td className="py-3 pr-8">
                          <div className="flex items-center gap-3">
                            <Progress value={(t.riders / t.cap) * 100} tone={t.riders / t.cap > 0.9 ? 'crimson' : 'navy'} />
                            <span className="w-12 text-xs tabular-nums">
                              {t.riders}/{t.cap}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          {t.changed ? <Badge tone="warning">Rescheduled</Badge> : <Badge tone="success">On schedule</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </Reveal>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
