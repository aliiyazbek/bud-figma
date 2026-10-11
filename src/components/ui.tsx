import { useEffect, useRef, useState, type ReactNode, type ButtonHTMLAttributes } from 'react'
import { animate, motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import logo from '../assets/bud-logo.png'

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ')
export { cx }

/* ---------- Button ---------- */
type Variant = 'primary' | 'crimson' | 'secondary' | 'ghost' | 'dark' | 'darkGhost' | 'success'
const variants: Record<Variant, string> = {
  primary: 'bg-navy text-white hover:bg-navy-700 disabled:bg-navy/40',
  crimson: 'bg-crimson text-white hover:bg-crimson-600 disabled:bg-crimson/40',
  secondary: 'bg-white text-navy border border-line hover:border-navy/30 hover:bg-navy-50 disabled:text-subtle',
  ghost: 'text-navy hover:bg-navy-50',
  dark: 'bg-white text-navy-950 hover:bg-mist disabled:bg-white/30',
  darkGhost: 'text-white/80 border border-white/15 hover:bg-white/10 hover:text-white',
  success: 'bg-success-50 text-success border border-success/20',
}
const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-12 px-5 text-[15px] gap-2 rounded-xl',
  xl: 'h-14 px-6 text-base gap-2.5 rounded-2xl',
}

export function Button({
  variant = 'primary',
  size = 'md',
  story,
  className,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: keyof typeof sizes
  story?: string
}) {
  return (
    <button
      data-story={story}
      className={cx(
        'inline-flex items-center justify-center font-semibold whitespace-nowrap transition-colors duration-150',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}

/* ---------- Badge ---------- */
type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'navy'
const tones: Record<Tone, string> = {
  neutral: 'bg-ivory text-muted border-line',
  success: 'bg-success-50 text-success border-success/20',
  warning: 'bg-warning-50 text-warning border-warning/25',
  danger: 'bg-crimson-50 text-crimson border-crimson/20',
  info: 'bg-navy-50 text-navy-600 border-navy/10',
  navy: 'bg-navy text-white border-navy',
}
const darkTones: Record<Tone, string> = {
  neutral: 'bg-white/5 text-white/70 border-white/10',
  success: 'bg-success-400/10 text-success-400 border-success-400/25',
  warning: 'bg-warning-400/10 text-warning-400 border-warning-400/25',
  danger: 'bg-crimson-400/15 text-crimson-400 border-crimson-400/30',
  info: 'bg-sky/10 text-sky border-sky/25',
  navy: 'bg-white text-navy-950 border-white',
}
export function Badge({
  tone = 'neutral',
  dark,
  icon,
  children,
  className,
}: {
  tone?: Tone
  dark?: boolean
  icon?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap',
        (dark ? darkTones : tones)[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  )
}

/* ---------- Card ---------- */
export function Card({
  children,
  className,
  dark,
  story,
}: {
  children: ReactNode
  className?: string
  dark?: boolean
  story?: string
}) {
  return (
    <div
      data-story={story}
      className={cx(
        'rounded-card',
        dark
          ? 'bg-navy-900/80 border border-white/[0.07] shadow-[inset_0_1px_0_rgb(255_255_255/0.04)]'
          : 'bg-white border border-line/80 shadow-card',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  title,
  subtitle,
  action,
  dark,
  className,
}: {
  title: ReactNode
  subtitle?: ReactNode
  action?: ReactNode
  dark?: boolean
  className?: string
}) {
  return (
    <div className={cx('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <div className={cx('font-display text-[15.5px] font-bold tracking-tight', dark ? 'text-white' : 'text-ink')}>{title}</div>
        {subtitle && <div className={cx('mt-0.5 text-xs', dark ? 'text-white/50' : 'text-muted')}>{subtitle}</div>}
      </div>
      {action}
    </div>
  )
}

/* ---------- Motion helpers ---------- */
export function Reveal({ children, i = 0, className }: { children: ReactNode; i?: number; className?: string }) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.2 : 0.5, delay: reduce ? 0 : 0.08 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function CountUp({
  value,
  from,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 0.9,
  delay = 0.2,
}: {
  value: number
  from?: number
  prefix?: string
  suffix?: string
  decimals?: number
  duration?: number
  delay?: number
}) {
  const reduce = useReducedMotion()
  const start = from ?? value
  const [n, setN] = useState(reduce ? value : start)
  const last = useRef(start)
  useEffect(() => {
    if (reduce) {
      setN(value)
      return
    }
    const c = animate(last.current, value, {
      duration,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(v),
    })
    last.current = value
    return () => c.stop()
  }, [value, reduce, duration, delay])
  const s = n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return (
    <span className="tabular-nums">
      {prefix}
      {s}
      {suffix}
    </span>
  )
}

/* ---------- Imagery ---------- */
export function GradedImage({
  src,
  alt,
  className,
  strength = 'strong',
  children,
}: {
  src: string
  alt: string
  className?: string
  strength?: 'strong' | 'soft'
  children?: ReactNode
}) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={cx('relative overflow-hidden bg-gradient-to-br from-navy-700 via-navy to-navy-950', className)}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover grayscale-[35%] contrast-[1.05]"
          loading="eager"
        />
      )}
      <div
        className={cx(
          'absolute inset-0 bg-navy mix-blend-multiply',
          strength === 'strong' ? 'opacity-60' : 'opacity-35',
        )}
      />
      <div
        className={cx(
          'absolute inset-0 bg-gradient-to-t',
          strength === 'strong' ? 'from-navy-950/90 via-navy-950/25 to-transparent' : 'from-navy-950/60 to-transparent',
        )}
      />
      {children && <div className="relative h-full">{children}</div>}
    </div>
  )
}

export function Logo({ className, padded = true }: { className?: string; padded?: boolean }) {
  return (
    <span className={cx('inline-flex items-center justify-center bg-white', padded && 'rounded-xl px-2 py-1', className)}>
      <img src={logo} alt="The British University in Damascus" className="h-full w-auto object-contain" />
    </span>
  )
}

export function Avatar({
  initials,
  src,
  className,
  tone = 'navy',
}: {
  initials: string
  src?: string
  className?: string
  tone?: 'navy' | 'crimson' | 'light'
}) {
  const [failed, setFailed] = useState(false)
  return (
    <span
      className={cx(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-semibold',
        tone === 'navy' && 'bg-navy text-white',
        tone === 'crimson' && 'bg-crimson text-white',
        tone === 'light' && 'bg-navy-100 text-navy',
        className,
      )}
    >
      {src && !failed ? (
        <img src={src} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  )
}

export function Progress({
  value,
  tone = 'navy',
  dark,
  className,
}: {
  value: number
  tone?: 'navy' | 'crimson' | 'success' | 'warning' | 'sky'
  dark?: boolean
  className?: string
}) {
  const reduce = useReducedMotion()
  const bg = {
    navy: 'bg-gradient-to-r from-navy-600 to-navy',
    crimson: 'bg-gradient-to-r from-crimson-400 to-crimson',
    success: 'bg-gradient-to-r from-success-400 to-success',
    warning: 'bg-gradient-to-r from-warning-400 to-warning',
    sky: 'bg-gradient-to-r from-sky to-[#6fa0da]',
  }[tone]
  return (
    <div className={cx('h-1.5 w-full overflow-hidden rounded-full', dark ? 'bg-white/10' : 'bg-navy-100', className)}>
      <motion.div
        className={cx('h-full rounded-full', bg)}
        initial={{ width: reduce ? `${value}%` : 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

/* ---------- Dialog (rendered inside the screen canvas so it is captured) ---------- */
export function Dialog({
  open,
  onClose,
  title,
  icon,
  children,
  footer,
  dark,
  width = 'w-[560px]',
  story,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  icon?: ReactNode
  children: ReactNode
  footer?: ReactNode
  dark?: boolean
  width?: string
  story?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    const el = ref.current
    const t = setTimeout(() => {
      const target = el?.querySelector<HTMLElement>('[data-autofocus]') ?? el?.querySelector<HTMLElement>('button')
      target?.focus({ preventScroll: true })
    }, 30)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key === 'Tab' && el) {
        const f = Array.from(el.querySelectorAll<HTMLElement>('button:not([disabled]),[href],input'))
        if (!f.length) return
        const first = f[0]
        const last = f[f.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey, true)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey, true)
      prev?.focus?.({ preventScroll: true })
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className={cx('absolute inset-0', dark ? 'bg-navy-950/70' : 'bg-navy-950/40')} onClick={onClose} />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            data-story={story}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={cx(
              'relative max-w-[92%] rounded-3xl shadow-float',
              dark ? 'bg-navy-900 border border-white/10 text-white' : 'bg-white text-ink',
              width,
            )}
          >
            <div className="flex items-start gap-4 p-7 pb-0">
              {icon}
              <div className="min-w-0 flex-1 pt-1 text-lg font-semibold tracking-tight">{title}</div>
              <button
                onClick={onClose}
                aria-label="Close"
                className={cx(
                  'rounded-full p-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-crimson',
                  dark ? 'text-white/50 hover:bg-white/10' : 'text-subtle hover:bg-ivory',
                )}
              >
                <X size={18} />
              </button>
            </div>
            <div className="px-7 pt-4 pb-6">{children}</div>
            {footer && (
              <div
                className={cx(
                  'flex justify-end gap-3 rounded-b-3xl px-7 py-5',
                  dark ? 'border-t border-white/10 bg-white/[0.02]' : 'border-t border-line bg-ivory/60',
                )}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function DemoTag({ children, dark }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase',
        dark ? 'bg-white/5 text-white/45' : 'bg-ivory text-subtle',
      )}
    >
      {children}
    </span>
  )
}
