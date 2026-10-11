import { useEffect, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ChevronLeft,
  House,
  BookOpenCheck,
  CalendarDays,
  GraduationCap,
  Wallet,
  Signal,
  Wifi,
  BatteryFull,
  Award,
  Megaphone,
  BusFront,
  FileText,
  Receipt,
  X,
} from 'lucide-react'
import { cx } from './ui'
import ReqChips from './reqs'
import { useNav, type ScreenCode } from '../state/NavContext'
import { useDemo, type Notice } from '../state/DemoContext'

export function StatusBar({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  return (
    <div
      className={cx(
        'pointer-events-none absolute inset-x-0 top-0 z-40 flex h-[50px] items-center justify-between px-8 pt-1.5 text-[15px] font-semibold',
        tone === 'light' ? 'text-white' : 'text-ink',
      )}
    >
      <span className="tabular-nums">9:41</span>
      <span className="flex items-center gap-1.5">
        <Signal size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <BatteryFull size={22} strokeWidth={1.8} />
      </span>
    </div>
  )
}

const tabs: { code: ScreenCode; label: string; icon: typeof House }[] = [
  { code: 'M01', label: 'Home', icon: House },
  { code: 'M02', label: 'Courses', icon: BookOpenCheck },
  { code: 'M03', label: 'Schedule', icon: CalendarDays },
  { code: 'M07', label: 'Results', icon: GraduationCap },
  { code: 'M06', label: 'Fees', icon: Wallet },
]

export const noticeIcon: Record<Notice['kind'], { icon: typeof Award; cls: string }> = {
  result: { icon: Award, cls: 'bg-success-50 text-success' },
  decision: { icon: Megaphone, cls: 'bg-crimson-50 text-crimson' },
  transport: { icon: BusFront, cls: 'bg-warning-50 text-warning' },
  document: { icon: FileText, cls: 'bg-navy-50 text-navy' },
  finance: { icon: Receipt, cls: 'bg-navy-50 text-navy' },
}
export const noticeTarget: Record<Notice['kind'], ScreenCode> = {
  result: 'M07',
  decision: 'M01',
  transport: 'M05',
  document: 'M08',
  finance: 'M06',
}

function Banner() {
  const { state, dispatch } = useDemo()
  const { go } = useNav()
  const next = [...state.notices].reverse().find((n) => !state.bannersShown.includes(n.id))
  const [pending, setPending] = useState<Notice | null>(null)
  useEffect(() => {
    if (pending || !next) return
    setPending(next)
    dispatch({ type: 'bannerShown', id: next.id })
  }, [next, pending, dispatch])
  useEffect(() => {
    if (!pending) return
    const t = setTimeout(() => setPending(null), 4200)
    return () => clearTimeout(t)
  }, [pending])
  useEffect(() => {
    if (state.notices.length === 0) setPending(null)
  }, [state.notices.length])
  return (
    <AnimatePresence>
      {pending && (
        <motion.button
          key={pending.id}
          data-story="banner"
          onClick={() => {
            setPending(null)
            go(noticeTarget[pending.kind])
          }}
          initial={{ y: -110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -110, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 28, delay: 0.5 }}
          className="absolute inset-x-3 top-[52px] z-50 flex items-start gap-3 rounded-[22px] bg-white/95 p-3.5 text-left shadow-float ring-1 ring-navy/5 backdrop-blur-md focus-visible:outline-2 focus-visible:outline-crimson"
        >
          {(() => {
            const I = noticeIcon[pending.kind]
            return (
              <span className={cx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', I.cls)}>
                <I.icon size={19} />
              </span>
            )
          })()}
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between text-[11px] font-semibold text-subtle">
              <span>BUD CAMPUS</span>
              <span>now</span>
            </span>
            <span className="mt-0.5 block text-[14px] font-semibold text-ink">{pending.title}</span>
            <span className="mt-0.5 block text-[13px] leading-snug text-muted">{pending.body}</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}

export function MobileHeader({
  title,
  subtitle,
  back = true,
  action,
}: {
  title: string
  subtitle?: string
  back?: boolean
  action?: ReactNode
}) {
  const { go } = useNav()
  return (
    <div className="flex items-end gap-3 px-5 pt-[60px] pb-4">
      {back && (
        <button
          onClick={() => go('M01')}
          aria-label="Back to home"
          className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-navy shadow-card focus-visible:outline-2 focus-visible:outline-crimson"
        >
          <ChevronLeft size={20} />
        </button>
      )}
      <div className="min-w-0 flex-1">
        {subtitle && <div className="text-xs font-medium text-subtle">{subtitle}</div>}
        <div className="font-display truncate text-[25px] leading-tight font-extrabold tracking-tight text-ink">{title}</div>
        <ReqChips max={4} className="mt-1.5" />
      </div>
      {action}
    </div>
  )
}

export function MobileShell({
  children,
  tab,
  statusTone = 'dark',
  overlay,
  bg = 'bg-ivory',
}: {
  children: ReactNode
  tab?: ScreenCode
  statusTone?: 'dark' | 'light'
  overlay?: ReactNode
  bg?: string
}) {
  const { go } = useNav()
  return (
    <div className={cx('relative flex h-[844px] w-[390px] flex-col overflow-hidden text-ink', bg)}>
      <StatusBar tone={statusTone} />
      <Banner />
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto">{children}</div>
      <nav className="relative z-30 h-[86px] shrink-0 border-t border-line bg-white/95 backdrop-blur">
        <div className="flex h-[54px] items-stretch px-2 pt-1.5">
          {tabs.map((t) => {
            const active = t.code === tab
            return (
              <button
                key={t.code}
                onClick={() => go(t.code)}
                className={cx(
                  'flex flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[10.5px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-crimson',
                  active ? 'text-crimson' : 'text-subtle hover:text-navy',
                )}
              >
                <t.icon size={22} strokeWidth={active ? 2.3 : 1.9} />
                {t.label}
              </button>
            )
          })}
        </div>
        <div className="absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-ink" />
      </nav>
      {overlay}
    </div>
  )
}

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="relative rounded-[68px] bg-gradient-to-b from-[#3a3f47] via-[#1d2026] to-[#33373e] p-[3px] shadow-[0_50px_100px_-30px_rgb(0_0_0/0.65)]">
      {/* side buttons */}
      <span className="absolute top-[180px] -left-[3px] h-[34px] w-[4px] rounded-l bg-[#2a2e35]" />
      <span className="absolute top-[236px] -left-[3px] h-[62px] w-[4px] rounded-l bg-[#2a2e35]" />
      <span className="absolute top-[312px] -left-[3px] h-[62px] w-[4px] rounded-l bg-[#2a2e35]" />
      <span className="absolute top-[262px] -right-[3px] h-[96px] w-[4px] rounded-r bg-[#2a2e35]" />
      <div className="rounded-[65px] bg-black p-[12px]">
        <div className="relative overflow-hidden rounded-[54px]">
          {children}
          <div className="pointer-events-none absolute top-[11px] left-1/2 z-[60] h-[36px] w-[124px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  )
}

/** Slide-down notification centre for the student app. */
export function NotificationsSheet({ open, onClose, extra = [] }: { open: boolean; onClose: () => void; extra?: Notice[] }) {
  const { state } = useDemo()
  const { go } = useNav()
  const items = [...state.notices, ...extra]
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="bg" className="absolute inset-0 z-[70] bg-navy-950/40 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.div
            key="sheet"
            role="dialog"
            aria-label="Notifications"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute inset-x-0 top-0 z-[71] rounded-b-[28px] bg-white px-4 pt-[56px] pb-4 shadow-float"
          >
            <div className="flex items-center justify-between px-1 pb-3">
              <div className="font-display text-[20px] font-extrabold text-ink">Notifications</div>
              <button onClick={onClose} aria-label="Close notifications" className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory text-muted">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-[460px] space-y-2 overflow-y-auto">
              {items.length === 0 && <div className="py-8 text-center text-sm text-subtle">You're all caught up</div>}
              {items.map((n) => {
                const m = noticeIcon[n.kind]
                const Icon = m.icon
                return (
                  <button key={n.id} onClick={() => (onClose(), go(noticeTarget[n.kind]))} className="flex w-full items-start gap-3 rounded-2xl bg-ivory/70 p-3 text-left ring-1 ring-line/70 hover:bg-ivory">
                    <span className={cx('flex h-9 w-9 shrink-0 items-center justify-center rounded-xl', m.cls)}>
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-semibold text-ink">{n.title}</span>
                      <span className="block text-[12px] text-muted">{n.body}</span>
                    </span>
                    <span className="text-[10.5px] text-subtle">{n.time}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
