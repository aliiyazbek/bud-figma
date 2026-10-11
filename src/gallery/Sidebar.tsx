import type { ReactNode } from 'react'
import { LayoutGrid, Monitor, Smartphone, Play, RotateCcw } from 'lucide-react'
import { screens } from '../screens/registry'
import type { ScreenCode } from '../state/NavContext'
import { Logo, cx } from '../components/ui'

const groups = [
  { title: 'Web portal', icon: Monitor, items: screens.filter((s) => s.kind === 'web') },
  { title: 'Mobile app', icon: Smartphone, items: screens.filter((s) => s.kind === 'mobile') },
]

function SideItem({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cx(
        'relative flex h-8 w-full items-center gap-3 rounded-lg px-3 text-left text-[13.5px] transition-colors focus-visible:outline-2 focus-visible:outline-crimson-400',
        active ? 'bg-white/[0.08] font-medium text-white' : 'text-white/65 hover:bg-white/[0.04] hover:text-white',
      )}
    >
      {active && <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-crimson-400" />}
      {children}
    </button>
  )
}

/** Site navigation: every screen, grouped by platform, one click away. */
export default function Sidebar({
  open,
  current,
  onOverview,
  onPick,
  onStory,
  onReset,
}: {
  open: boolean
  current: ScreenCode | null
  onOverview: () => void
  onPick: (code: ScreenCode) => void
  onStory: () => void
  onReset: () => void
}) {
  return (
    <aside
      aria-label="Screens"
      aria-hidden={!open}
      inert={!open}
      className={cx(
        'fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col border-r border-white/[0.06] bg-[#14171c] transition-transform duration-300',
        !open && '-translate-x-full',
      )}
    >
      <button onClick={onOverview} className="flex items-center gap-2.5 px-5 pt-5 pb-3 text-left">
        <Logo className="h-9 rounded-md px-1 py-0.5" />
        <span className="leading-tight">
          <span className="block text-[14px] font-semibold">BUD Digital Campus</span>
          <span className="block text-[11.5px] text-white/45">Interface gallery · {screens.length} screens</span>
        </span>
      </button>

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 [scrollbar-color:rgb(255_255_255/0.15)_transparent] [scrollbar-width:thin]">
        <SideItem active={current === null} onClick={onOverview}>
          <LayoutGrid size={16} className="text-white/50" /> Overview
        </SideItem>
        {groups.map((g) => (
          <div key={g.title} className="mt-4">
            <div className="flex items-center gap-2 px-3 pb-1.5 text-[11px] font-semibold tracking-[0.12em] text-white/35 uppercase">
              <g.icon size={13} /> {g.title}
              <span className="ml-auto tabular-nums">{g.items.length}</span>
            </div>
            {g.items.map((s) => (
              <SideItem key={s.code} active={current === s.code} onClick={() => onPick(s.code)}>
                <span className={cx('w-8 shrink-0 font-mono text-[11.5px] font-semibold', current === s.code ? 'text-sky' : 'text-white/40')}>{s.code}</span>
                <span className="truncate">{s.name}</span>
              </SideItem>
            ))}
          </div>
        ))}
      </nav>

      <div className="flex gap-2 border-t border-white/[0.06] p-4">
        <button
          onClick={onStory}
          className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-crimson text-sm font-semibold hover:bg-crimson-600 focus-visible:outline-2 focus-visible:outline-white"
        >
          <Play size={15} /> Story mode
        </button>
        <button
          onClick={onReset}
          title="Reset the demo data"
          className="flex h-10 items-center justify-center gap-1.5 rounded-xl bg-white/[0.06] px-3 text-[13px] font-medium text-white/75 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
        >
          <RotateCcw size={14} /> Reset
        </button>
      </div>
    </aside>
  )
}
