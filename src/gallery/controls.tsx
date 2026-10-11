import type { ReactNode } from 'react'
import { Smartphone, Square } from 'lucide-react'
import { cx } from '../components/ui'

export type Frame = 'device' | 'clean'

export function ToolButton({ children, label, onClick, wide }: { children: ReactNode; label: string; onClick: () => void; wide?: boolean }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cx(
        'flex h-9 items-center justify-center gap-1.5 rounded-lg bg-white/[0.06] text-sm font-medium text-white/80 ring-1 ring-white/10 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-crimson-400',
        wide ? 'px-3' : 'w-9',
      )}
    >
      {children}
    </button>
  )
}

/** Device mockup or the bare 390×844 screen, for mobile screens. */
export function FrameToggle({ frame, onChange }: { frame: Frame; onChange: (f: Frame) => void }) {
  return (
    <div className="flex rounded-lg bg-white/[0.06] p-0.5 ring-1 ring-white/10" role="group" aria-label="Mobile frame">
      {(['device', 'clean'] as Frame[]).map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          aria-pressed={frame === f}
          className={cx('flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold capitalize', frame === f ? 'bg-white text-navy-950' : 'text-white/60 hover:text-white')}
        >
          {f === 'device' ? <Smartphone size={13} /> : <Square size={13} />}
          {f}
        </button>
      ))}
    </div>
  )
}
