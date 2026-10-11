import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Bell, CalendarRange, Check, ChevronDown, Search, UserRound, BookOpen, Gavel, LayoutGrid, LogOut, Smartphone, Repeat2, CornerDownLeft } from 'lucide-react'
import { useNav, type ScreenCode } from '../state/NavContext'
import { useDemo } from '../state/DemoContext'
import { SEMESTER } from '../data/demo'
import { useToast } from './toast'
import { cx } from './ui'

/* ---------- generic popover ---------- */
function usePopover() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false)
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [open])
  return { open, setOpen, ref }
}

function Panel({ open, dark, up, className, children }: { open: boolean; dark?: boolean; up?: boolean; className?: string; children: ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.16 }}
          className={cx(
            'absolute z-[60] overflow-hidden rounded-2xl shadow-float ring-1',
            up ? 'bottom-[calc(100%+8px)] left-0 origin-bottom-left' : 'top-[calc(100%+8px)] right-0 origin-top-right',
            dark ? 'bg-navy-900 text-white ring-white/10' : 'bg-white text-ink ring-line',
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- global search ---------- */
type Hit = { group: string; title: string; sub: string; code: ScreenCode; icon: ReactNode }
const index: Hit[] = [
  { group: 'Students', title: 'Maya Haddad', sub: 'BUD-2024-0187 · Software Eng. · Year 3', code: 'W04', icon: <UserRound size={15} /> },
  { group: 'Students', title: 'Omar Sabbagh', sub: 'BUD-2023-0412 · Computer Eng.', code: 'W04', icon: <UserRound size={15} /> },
  { group: 'Students', title: 'Lea Tawil', sub: 'BUD-2022-0098 · Overload request', code: 'W04', icon: <UserRound size={15} /> },
  { group: 'Courses', title: 'CS301 · Database Systems', sub: 'Sections A, B · grade approval pending', code: 'W05', icon: <BookOpen size={15} /> },
  { group: 'Courses', title: 'CS320 · Computer Networks', sub: 'Over capacity · 42/40', code: 'W03', icon: <BookOpen size={15} /> },
  { group: 'Courses', title: 'EE210 · Circuit Analysis', sub: 'Under-filled · 21/45', code: 'W03', icon: <BookOpen size={15} /> },
  { group: 'Decisions', title: 'DEC-2026-014 · Academic calendar', sub: 'Pending presidential approval', code: 'W02', icon: <Gavel size={15} /> },
  { group: 'Decisions', title: 'DEC-2026-012 · Qudsaya Line 7', sub: 'Transport proposal', code: 'W02', icon: <Gavel size={15} /> },
  { group: 'Pages', title: 'Executive Overview', sub: 'President dashboard', code: 'W01', icon: <LayoutGrid size={15} /> },
  { group: 'Pages', title: 'Transport Operations', sub: 'Lines, trips & fleet', code: 'W06', icon: <LayoutGrid size={15} /> },
  { group: 'Pages', title: 'Finance Overview', sub: 'Billing, collection & holds', code: 'W07', icon: <LayoutGrid size={15} /> },
  { group: 'Pages', title: 'Faculty Operations', sub: 'Sections & requests', code: 'W03', icon: <LayoutGrid size={15} /> },
]

export function HeaderSearch({ dark, width = 300, placeholder = 'Search students, courses, decisions…' }: { dark?: boolean; width?: number; placeholder?: string }) {
  const { go } = useNav()
  const { open, setOpen, ref } = usePopover()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const hits = useMemo(() => {
    const t = q.trim().toLowerCase()
    const list = t ? index.filter((h) => (h.title + ' ' + h.sub).toLowerCase().includes(t)) : index.filter((h) => h.group !== 'Pages').slice(0, 5)
    return list.slice(0, 7)
  }, [q])
  const pick = (h: Hit) => {
    setOpen(false)
    setQ('')
    go(h.code)
  }
  return (
    <div ref={ref} className="relative" style={{ width }}>
      <label
        className={cx(
          'flex h-10 items-center gap-2 rounded-xl border px-3 text-sm transition-colors',
          dark ? 'border-white/10 bg-white/[0.04] text-white focus-within:border-sky/50' : 'border-line bg-ivory text-ink focus-within:border-navy/40 focus-within:bg-white',
        )}
      >
        <Search size={16} className={dark ? 'text-white/50' : 'text-subtle'} />
        <input
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => (setQ(e.target.value), setActive(0), setOpen(true))}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') (e.preventDefault(), setActive((a) => Math.min(a + 1, hits.length - 1)))
            if (e.key === 'ArrowUp') (e.preventDefault(), setActive((a) => Math.max(a - 1, 0)))
            if (e.key === 'Enter' && hits[active]) pick(hits[active])
            e.stopPropagation()
          }}
          placeholder={placeholder}
          className={cx('min-w-0 flex-1 bg-transparent outline-none', dark ? 'placeholder:text-white/40' : 'placeholder:text-subtle')}
        />
        <kbd className={cx('rounded px-1.5 text-[10px] font-semibold', dark ? 'bg-white/10 text-white/50' : 'bg-white text-subtle ring-1 ring-line')}>⌘K</kbd>
      </label>
      <Panel open={open} dark={dark} className="left-0 w-[420px] p-2">
        {!q && <div className={cx('px-3 pt-1.5 pb-1 text-[10.5px] font-bold tracking-wider uppercase', dark ? 'text-white/40' : 'text-subtle')}>Suggested</div>}
        {hits.length === 0 && <div className={cx('px-3 py-4 text-sm', dark ? 'text-white/50' : 'text-muted')}>No results for “{q}”</div>}
        {hits.map((h, i) => (
          <button
            key={h.title}
            onMouseEnter={() => setActive(i)}
            onClick={() => pick(h)}
            className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left', i === active && (dark ? 'bg-white/[0.07]' : 'bg-navy-50'))}
          >
            <span className={cx('flex h-8 w-8 items-center justify-center rounded-lg', dark ? 'bg-white/10 text-sky' : 'bg-white text-navy ring-1 ring-line')}>{h.icon}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold">{h.title}</span>
              <span className={cx('block truncate text-xs', dark ? 'text-white/50' : 'text-muted')}>{h.sub}</span>
            </span>
            <span className={cx('text-[10.5px] font-semibold', dark ? 'text-white/35' : 'text-subtle')}>{h.group}</span>
            {i === active && <CornerDownLeft size={13} className={dark ? 'text-white/40' : 'text-subtle'} />}
          </button>
        ))}
      </Panel>
    </div>
  )
}

/* ---------- notifications ---------- */
const staffFeed: { title: string; body: string; time: string; code: ScreenCode }[] = [
  { title: 'Grades awaiting your approval', body: 'CS301 midterm · 66 students', time: '10 min', code: 'W05' },
  { title: 'Decision DEC-2026-014 pending', body: 'Academic calendar amendment', time: '1 h', code: 'W02' },
  { title: 'CS320 is over capacity', body: '42 of 40 seats · consider a new section', time: '2 h', code: 'W03' },
  { title: 'Line 3 occupancy at 93%', body: 'Morning peak · Mezzeh', time: '3 h', code: 'W06' },
  { title: 'Collection rate +6.2 pts', body: 'Finance weekly summary', time: 'Yesterday', code: 'W07' },
]

export function HeaderBell({ dark }: { dark?: boolean }) {
  const { go } = useNav()
  const { state } = useDemo()
  const { open, setOpen, ref } = usePopover()
  const [read, setRead] = useState(false)
  const live = state.notices.map((n) => ({ title: n.title, body: n.body, time: 'Just now', code: 'W04' as ScreenCode }))
  const feed = [...live, ...staffFeed].slice(0, 6)
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        className={cx('relative flex h-10 w-10 items-center justify-center rounded-xl border transition-colors', dark ? 'border-white/10 bg-white/[0.03] hover:bg-white/10' : 'border-line hover:bg-ivory')}
      >
        <Bell size={17} className={dark ? 'text-white/75' : 'text-muted'} />
        {!read && <span className={cx('absolute top-2 right-2 h-2 w-2 rounded-full', dark ? 'bg-crimson-400 ring-2 ring-navy-950' : 'bg-crimson ring-2 ring-white')} />}
      </button>
      <Panel open={open} dark={dark} className="w-[380px]">
        <div className={cx('flex items-center justify-between border-b px-4 py-3', dark ? 'border-white/10' : 'border-line')}>
          <span className="text-sm font-semibold">Notifications</span>
          <button onClick={() => setRead(true)} className={cx('text-xs font-semibold', dark ? 'text-sky' : 'text-navy-600')}>
            Mark all as read
          </button>
        </div>
        <div className="max-h-[380px] overflow-y-auto p-1.5">
          {feed.map((n, i) => (
            <button key={i} onClick={() => (setOpen(false), go(n.code))} className={cx('flex w-full gap-3 rounded-xl px-3 py-2.5 text-left', dark ? 'hover:bg-white/[0.06]' : 'hover:bg-ivory')}>
              <span className={cx('mt-1.5 h-2 w-2 shrink-0 rounded-full', read ? 'bg-transparent' : dark ? 'bg-crimson-400' : 'bg-crimson')} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{n.title}</span>
                <span className={cx('block text-xs', dark ? 'text-white/50' : 'text-muted')}>{n.body}</span>
              </span>
              <span className={cx('text-[11px]', dark ? 'text-white/35' : 'text-subtle')}>{n.time}</span>
            </button>
          ))}
        </div>
      </Panel>
    </div>
  )
}

/* ---------- semester picker ---------- */
const semesters = [SEMESTER, 'Summer 2026', 'Spring 2026', 'Fall 2025']
export function SemesterPicker({ dark }: { dark?: boolean }) {
  const { open, setOpen, ref } = usePopover()
  const [sem, setSem] = useState(SEMESTER)
  const toast = useToast()
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={cx('flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors', dark ? 'border-white/10 bg-white/[0.03] text-white/80 hover:bg-white/10' : 'border-line text-ink hover:bg-ivory')}
      >
        <CalendarRange size={16} className={dark ? 'text-sky' : 'text-navy-600'} />
        {sem}
        <ChevronDown size={14} className={cx('transition-transform', open && 'rotate-180', dark ? 'text-white/40' : 'text-subtle')} />
      </button>
      <Panel open={open} dark={dark} className="w-[220px] p-1.5">
        {semesters.map((s) => (
          <button
            key={s}
            onClick={() => {
              setSem(s)
              setOpen(false)
              if (s !== SEMESTER) toast(`Viewing ${s} · archived figures (demo)`, 'info')
            }}
            className={cx('flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm', dark ? 'hover:bg-white/[0.06]' : 'hover:bg-ivory')}
          >
            <span>
              {s}
              {s === SEMESTER && <span className={cx('ml-2 text-[10.5px] font-semibold', dark ? 'text-success-400' : 'text-success')}>Current</span>}
            </span>
            {s === sem && <Check size={14} />}
          </button>
        ))}
      </Panel>
    </div>
  )
}

/* ---------- profile / portal switcher ---------- */
const portals: { label: string; role: string; code: ScreenCode; mobile?: boolean }[] = [
  { label: 'President', role: 'Executive suite', code: 'W01' },
  { label: 'Dean · Engineering & IT', role: 'Faculty portal', code: 'W03' },
  { label: 'Student Affairs', role: 'Student 360', code: 'W04' },
  { label: 'Transport Office', role: 'Operations', code: 'W06' },
  { label: 'Finance Office', role: 'Billing & collection', code: 'W07' },
  { label: 'Maya Haddad', role: 'Student mobile app', code: 'M01', mobile: true },
]
export function ProfileMenu({ dark, children }: { dark?: boolean; children: ReactNode }) {
  const { go, screen } = useNav()
  const { open, setOpen, ref } = usePopover()
  const toast = useToast()
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Account and portal switcher" className={cx('flex w-full items-center gap-3 rounded-xl p-1 pr-2 text-left transition-colors', dark ? 'hover:bg-white/[0.06]' : 'hover:bg-white/10')}>
        {children}
        <ChevronDown size={14} className={cx('transition-transform', open && 'rotate-180', dark ? 'text-white/40' : 'text-white/50')} />
      </button>
      <Panel open={open} dark={dark} up={!dark} className="w-[300px] p-1.5">
        <div className={cx('flex items-center gap-2 px-3 pt-2 pb-1.5 text-[10.5px] font-bold tracking-wider uppercase', dark ? 'text-white/40' : 'text-subtle')}>
          <Repeat2 size={12} /> Switch portal
        </div>
        {portals.map((p) => (
          <button key={p.code} onClick={() => (setOpen(false), go(p.code))} className={cx('flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left', dark ? 'hover:bg-white/[0.06]' : 'hover:bg-ivory')}>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">{p.label}</span>
              <span className={cx('block text-xs', dark ? 'text-white/45' : 'text-muted')}>{p.role}</span>
            </span>
            {p.mobile && <Smartphone size={14} className={dark ? 'text-white/40' : 'text-subtle'} />}
            {p.code === screen && <Check size={14} className={dark ? 'text-sky' : 'text-navy'} />}
          </button>
        ))}
        <div className={cx('my-1 h-px', dark ? 'bg-white/10' : 'bg-line')} />
        <button onClick={() => (setOpen(false), toast('Signed out of demo · session kept', 'info'))} className={cx('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm', dark ? 'text-white/70 hover:bg-white/[0.06]' : 'text-muted hover:bg-ivory')}>
          <LogOut size={14} /> Sign out
        </button>
      </Panel>
    </div>
  )
}
