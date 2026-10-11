import { useNav } from '../state/NavContext'
import { screenReqs } from '../data/requirements'
import { cx } from './ui'

// `?reqs=0` hides the in-screen requirement chips for clean recordings.
const visible = typeof window === 'undefined' || new URLSearchParams(window.location.search).get('reqs') !== '0'

/** Small traceability chips: the functional requirements this screen expresses. */
export default function ReqChips({ dark, max = 6, className }: { dark?: boolean; max?: number; className?: string }) {
  const { screen } = useNav()
  const reqs = screenReqs[screen]?.reqs ?? []
  if (!visible || !reqs.length) return null
  const shown = reqs.slice(0, max)
  const more = reqs.length - shown.length
  return (
    <div className={cx('flex flex-wrap items-center gap-1', className)} aria-label="Requirements expressed by this screen">
      {shown.map((r) => (
        <span
          key={r.id}
          title={r.title}
          className={cx(
            'rounded-md px-1.5 py-[1px] font-mono text-[10px] font-semibold tracking-tight ring-1',
            dark ? 'bg-white/[0.05] text-sky/90 ring-white/10' : 'bg-navy-50 text-navy-600 ring-navy/10',
          )}
        >
          {r.id}
        </span>
      ))}
      {more > 0 && <span className={cx('text-[10px] font-semibold', dark ? 'text-white/40' : 'text-subtle')}>+{more}</span>}
    </div>
  )
}
