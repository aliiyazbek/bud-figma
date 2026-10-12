import type { ReactNode } from 'react'
import {
  Bell,
  CalendarRange,
  ChevronDown,
  LayoutDashboard,
  Gavel,
  Building2,
  UserRound,
  ClipboardCheck,
  Bus,
  Landmark,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { Logo, Avatar, cx } from './ui'
import ReqChips from './reqs'
import { HeaderSearch, HeaderBell, SemesterPicker, ProfileMenu } from './headerControls'
import { useNav, type ScreenCode } from '../state/NavContext'
import { useDerived } from '../state/DemoContext'
import { SEMESTER, TODAY } from '../data/demo'

/* ---------- Executive (dark command room) ---------- */
export function ExecShell({ children, overlay }: { children: ReactNode; overlay?: ReactNode }) {
  const { screen, go } = useNav()
  const { pendingDecisions } = useDerived()
  const tabs: { code: ScreenCode; label: string; badge?: number }[] = [
    { code: 'W01', label: 'Executive Overview' },
    { code: 'W02', label: 'Decisions & Approvals', badge: pendingDecisions },
    { code: 'W03', label: 'Faculties' },
    { code: 'W07', label: 'Finance' },
  ]
  return (
    <div className="relative flex h-[1080px] w-[1920px] flex-col overflow-hidden bg-navy-950 text-white">
      <div className="pointer-events-none absolute -top-[380px] left-[30%] h-[900px] w-[1300px] rounded-full bg-navy-700/35 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-[400px] -right-[200px] h-[700px] w-[800px] rounded-full bg-crimson/[0.07] blur-[140px]" />
      <header className="relative z-10 flex h-[84px] shrink-0 items-center gap-8 border-b border-white/[0.07] px-10">
        <div className="flex items-center gap-4">
          <Logo className="h-12" />
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold tracking-tight">BUD Digital Campus</div>
            <div className="text-xs text-white/45">Executive Suite · Office of the President</div>
            <ReqChips dark max={6} className="mt-1.5" />
          </div>
        </div>
        <nav className="ml-6 flex items-center gap-1 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-1">
          {tabs.map((t) => (
            <button
              key={t.code}
              onClick={() => go(t.code)}
              className={cx(
                'flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-crimson',
                screen === t.code ? 'bg-white text-navy-950' : 'text-white/60 hover:bg-white/5 hover:text-white',
              )}
            >
              {t.label}
              {t.badge ? (
                <span className={cx('rounded-full px-1.5 text-[11px] font-bold tabular-nums', screen === t.code ? 'bg-crimson text-white' : 'bg-crimson/90 text-white')}>
                  {t.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          <HeaderSearch dark width={280} />
          <SemesterPicker dark />
          <div className="px-2 text-sm text-white/45 tabular-nums">{TODAY}</div>
          <HeaderBell dark />
          <div className="border-l border-white/10 pl-3">
            <ProfileMenu dark>
              <Avatar initials="UP" tone="crimson" className="h-10 w-10 text-sm" />
              <div className="leading-tight">
                <div className="text-sm font-semibold">University President</div>
                <div className="text-xs text-white/45">Full access</div>
              </div>
            </ProfileMenu>
          </div>
        </div>
      </header>
      <main className="relative z-10 min-h-0 flex-1 px-10 py-8">{children}</main>
      {overlay}
    </div>
  )
}

/* ---------- Administrative (light, navy sidebar) ---------- */
const adminNav: { code: ScreenCode; label: string; icon: ReactNode; group: string }[] = [
  { code: 'W01', label: 'Executive Overview', icon: <LayoutDashboard size={18} />, group: 'Executive' },
  { code: 'W02', label: 'Decisions', icon: <Gavel size={18} />, group: 'Executive' },
  { code: 'W03', label: 'Faculty Operations', icon: <Building2 size={18} />, group: 'Academic' },
  { code: 'W04', label: 'Student 360', icon: <UserRound size={18} />, group: 'Academic' },
  { code: 'W05', label: 'Grade Approval', icon: <ClipboardCheck size={18} />, group: 'Academic' },
  { code: 'W06', label: 'Transport', icon: <Bus size={18} />, group: 'Services' },
  { code: 'W07', label: 'Finance', icon: <Landmark size={18} />, group: 'Services' },
  { code: 'W08', label: 'Staff Inbox', icon: <ClipboardCheck size={18} />, group: 'Workflow' },
  { code: 'W09', label: 'File Review', icon: <Search size={18} />, group: 'Workflow' },
  { code: 'W10', label: 'Routing', icon: <Bell size={18} />, group: 'Workflow' },
  { code: 'W11', label: 'My Schedule', icon: <CalendarRange size={18} />, group: 'Academic' },
]

export function AdminShell({
  title,
  crumb,
  actions,
  children,
  overlay,
  user = { name: 'Dr. Samer Halabi', role: 'Dean, Engineering & IT', initials: 'SH' },
}: {
  title: string
  crumb: string
  actions?: ReactNode
  children: ReactNode
  overlay?: ReactNode
  user?: { name: string; role: string; initials: string }
}) {
  const { screen, go } = useNav()
  const groups = ['Executive', 'Academic', 'Services', 'Workflow']
  return (
    <div className="relative flex h-[1080px] w-[1920px] overflow-hidden bg-ivory text-ink">
      <aside className="relative flex w-[280px] shrink-0 flex-col bg-navy text-white">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-navy-950/60 to-transparent" />
        <div className="relative flex items-center gap-3 px-6 pt-7 pb-8">
          <Logo className="h-12" />
          <div className="leading-tight">
            <div className="font-display text-[15px] font-bold tracking-tight">Digital Campus</div>
            <div className="text-xs text-white/50">Administration</div>
          </div>
        </div>
        <nav className="relative flex-1 space-y-6 px-4">
          {groups.map((g) => (
            <div key={g}>
              <div className="px-3 pb-2 text-[11px] font-semibold tracking-[0.12em] text-white/35 uppercase">{g}</div>
              <div className="space-y-1">
                {adminNav
                  .filter((n) => n.group === g)
                  .map((n) => (
                    <button
                      key={n.code}
                      onClick={() => go(n.code)}
                      className={cx(
                        'relative flex h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-white',
                        screen === n.code ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
                      )}
                    >
                      {screen === n.code && <span className="absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-full bg-crimson-400" />}
                      {n.icon}
                      {n.label}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="relative m-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <ProfileMenu>
            <Avatar initials={user.initials} tone="light" className="h-10 w-10 text-sm" />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="truncate text-sm font-semibold">{user.name}</div>
              <div className="truncate text-xs text-white/50">{user.role}</div>
            </div>
          </ProfileMenu>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/45">
            <ShieldCheck size={13} /> Role-based access · Demo environment
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-[92px] shrink-0 items-center gap-6 border-b border-line bg-white px-10">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-subtle">{crumb}</span>
              <ReqChips max={6} />
            </div>
            <div className="font-display mt-1 text-[27px] leading-tight font-bold tracking-tight text-ink">{title}</div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <HeaderSearch width={320} />
            <SemesterPicker />
            <HeaderBell />
            {actions}
          </div>
        </header>
        <main className="relative min-h-0 flex-1 bg-[radial-gradient(1200px_400px_at_70%_-10%,rgb(16_41_69/0.06),transparent)] px-10 py-8">{children}</main>
      </div>
      {overlay}
    </div>
  )
}
