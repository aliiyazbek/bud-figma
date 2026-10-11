import { MapPin, Clock, CalendarDays, Map, BusFront, FileText, Ticket, Library, Briefcase, Wallet, ChevronRight, Bell } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { MobileShell, NotificationsSheet, noticeIcon, noticeTarget } from '../../components/mobile'
import { GradedImage, Reveal, Avatar, Badge, Logo, cx } from '../../components/ui'
import { useDemo, useDerived, type Notice } from '../../state/DemoContext'
import { useNav, type ScreenCode } from '../../state/NavContext'
import { student, TODAY_SHORT } from '../../data/demo'
import { images } from '../../data/images'

const services: { code: ScreenCode; label: string; icon: typeof Map }[] = [
  { code: 'M03', label: 'Schedule', icon: CalendarDays },
  { code: 'M04', label: 'Campus map', icon: Map },
  { code: 'M05', label: 'Transport', icon: BusFront },
  { code: 'M08', label: 'Documents', icon: FileText },
  { code: 'M09', label: 'Events', icon: Ticket },
  { code: 'M10', label: 'Library', icon: Library },
  { code: 'M11', label: 'Careers', icon: Briefcase },
  { code: 'M06', label: 'Fees', icon: Wallet },
]

export default function M01() {
  const { state } = useDemo()
  const { invoice, tripTime } = useDerived()
  const { go } = useNav()
  const [bell, setBell] = useState(false)
  const base = [
    { id: 'b-1', kind: 'finance' as const, title: `Balance due $${invoice.balance}`, body: 'Pay before 1 Oct 2026 to keep registration active.', time: '8:00' },
  ]
  const feed = [...state.notices.filter((n) => n.kind !== 'finance'), ...base].slice(0, 4)

  return (
    <MobileShell tab="M01" statusTone="light" overlay={<NotificationsSheet open={bell} onClose={() => setBell(false)} extra={base as Notice[]} />}>
      <GradedImage src={images.hero.src} alt={images.hero.alt} className="h-[292px]">
        <div className="flex h-full flex-col px-5 pt-[58px] pb-[64px]">
          <div className="flex items-center justify-between">
            <Logo className="h-9 rounded-lg px-1.5 py-0.5" />
            <button
              onClick={() => setBell(true)}
              aria-label="Notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur"
            >
              <Bell size={18} />
              {state.notices.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-crimson px-1 text-[10px] font-bold ring-2 ring-navy">
                  {state.notices.length}
                </span>
              )}
            </button>
          </div>
          <div className="mt-auto flex items-end justify-between">
            <div>
              <div className="text-[13px] font-medium text-white/70">{TODAY_SHORT} · Week 2</div>
              <div className="mt-1 text-[28px] leading-tight font-bold tracking-tight text-white">Good morning, {student.first}</div>
              <div className="mt-1 text-[13px] text-white/65">
                {student.program} · {student.year}
              </div>
            </div>
            <Avatar initials={student.initials} src={images.portrait.src} className="h-12 w-12 text-sm ring-2 ring-white/70" />
          </div>
        </div>
      </GradedImage>

      <div className="relative -mt-[46px] space-y-5 px-4 pb-6">
        <Reveal>
          <button onClick={() => go('M03')} className="block w-full rounded-[22px] bg-white p-4 text-left shadow-float ring-1 ring-navy/5" data-story="next-class">
            <div className="flex items-center justify-between">
              <Badge tone="danger">Next lecture · in 19 min</Badge>
              <span className="text-[12px] font-semibold text-subtle tabular-nums">10:00–11:30</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-12 w-12 flex-col items-center justify-center rounded-2xl bg-navy text-white">
                <span className="text-[10px] font-medium text-white/60">SUN</span>
                <span className="text-[15px] leading-none font-bold">10:00</span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[16px] font-semibold">Probability & Statistics</div>
                <div className="mt-0.5 flex items-center gap-3 text-[12.5px] text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> B-105 · Science
                  </span>
                  <span>MATH302</span>
                </div>
              </div>
              <span
                role="link"
                onClick={(e) => {
                  e.stopPropagation()
                  go('M04')
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-crimson-50 text-crimson"
              >
                <Map size={18} />
              </span>
            </div>
          </button>
        </Reveal>

        <Reveal i={1}>
          <div className="flex items-center justify-between px-1">
            <div className="text-[16px] font-semibold">Updates</div>
            <span className="text-[12px] font-medium text-subtle">{feed.length} new</span>
          </div>
          <div className="mt-2.5 overflow-hidden rounded-[20px] bg-white ring-1 ring-line" data-story="updates">
            <AnimatePresence initial={false}>
              {feed.map((n, i) => {
                const I = noticeIcon[n.kind]
                return (
                  <motion.button
                    key={n.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onClick={() => go(noticeTarget[n.kind])}
                    className={cx('flex w-full items-start gap-3 px-4 py-3 text-left', i > 0 && 'border-t border-line')}
                  >
                    <span className={cx('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', I.cls)}>
                      <I.icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2">
                        <span className="truncate text-[14px] font-semibold">{n.title}</span>
                        <span className="shrink-0 text-[11px] text-subtle">{n.time}</span>
                      </span>
                      <span className="mt-0.5 line-clamp-2 block text-[12.5px] leading-snug text-muted">{n.body}</span>
                    </span>
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </Reveal>

        <Reveal i={2}>
          <div className="px-1 text-[16px] font-semibold">Campus services</div>
          <div className="mt-2.5 grid grid-cols-4 gap-2.5">
            {services.map((s) => (
              <button key={s.code} onClick={() => go(s.code)} className="flex flex-col items-center gap-1.5 rounded-2xl bg-white py-3 ring-1 ring-line transition-colors hover:ring-navy/20">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy">
                  <s.icon size={19} />
                </span>
                <span className="text-[11px] font-semibold text-ink">{s.label}</span>
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal i={3}>
          <button onClick={() => go('M05')} className="flex w-full items-center gap-3 rounded-[20px] bg-navy p-4 text-left text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <BusFront size={19} />
            </span>
            <span className="flex-1">
              <span className="block text-[14px] font-semibold">Tomorrow’s pickup · {tripTime}</span>
              <span className="block text-[12px] text-white/60">Mezzeh Line 3 · Stop 4</span>
            </span>
            <Clock size={16} className="text-white/50" />
            <ChevronRight size={16} className="text-white/50" />
          </button>
        </Reveal>
      </div>
    </MobileShell>
  )
}
