import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

function pathFrom(values: number[], w: number, h: number, min: number, max: number, pad = 6) {
  const step = (w - pad * 2) / (values.length - 1)
  const pts = values.map((v, i) => [pad + i * step, h - pad - ((v - min) / (max - min)) * (h - pad * 2)] as const)
  // Smooth with cardinal-like bezier
  let d = `M ${pts[0][0]} ${pts[0][1]}`
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1]
    const [x1, y1] = pts[i]
    const cxp = (x0 + x1) / 2
    d += ` C ${cxp} ${y0}, ${cxp} ${y1}, ${x1} ${y1}`
  }
  return { d, pts }
}

export interface Series {
  values: number[]
  color: string
  area?: boolean
  dashed?: boolean
  label?: string
}

export function LineChart({
  series,
  labels,
  width,
  height,
  min,
  max,
  dark,
  gridLines = 4,
  format = (v: number) => String(v),
  highlightLast = true,
}: {
  series: Series[]
  labels: string[]
  width: number
  height: number
  min: number
  max: number
  dark?: boolean
  gridLines?: number
  format?: (v: number) => string
  highlightLast?: boolean
}) {
  const reduce = useReducedMotion()
  const left = 44
  const bottom = 26
  const w = width - left
  const h = height - bottom
  const gridColor = dark ? 'rgb(255 255 255 / 0.07)' : 'var(--color-line)'
  const txt = dark ? 'rgb(255 255 255 / 0.42)' : 'var(--color-subtle)'
  const id = `g${series.map((s) => s.values.join('')).join('').length}${width}`
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        {series.map((s, i) => (
          <linearGradient key={i} id={`${id}-${i}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity={dark ? 0.28 : 0.18} />
            <stop offset="100%" stopColor={s.color} stopOpacity={0} />
          </linearGradient>
        ))}
      </defs>
      {Array.from({ length: gridLines + 1 }).map((_, i) => {
        const y = 6 + ((h - 12) / gridLines) * i
        const v = max - ((max - min) / gridLines) * i
        return (
          <g key={i}>
            <line x1={left} x2={width} y1={y} y2={y} stroke={gridColor} strokeDasharray={i === gridLines ? '' : '3 5'} />
            <text x={left - 10} y={y + 4} textAnchor="end" fontSize={11} fill={txt} className="tabular-nums">
              {format(v)}
            </text>
          </g>
        )
      })}
      {labels.map((l, i) => (
        <text
          key={l}
          x={left + 6 + ((w - 12) / (labels.length - 1)) * i}
          y={height - 6}
          textAnchor="middle"
          fontSize={11}
          fill={txt}
        >
          {l}
        </text>
      ))}
      <g transform={`translate(${left},0)`}>
        {series.map((s, i) => {
          const { d, pts } = pathFrom(s.values, w, h, min, max)
          const last = pts[pts.length - 1]
          return (
            <g key={i}>
              {s.area && (
                <motion.path
                  d={`${d} L ${last[0]} ${h} L ${pts[0][0]} ${h} Z`}
                  fill={`url(#${id}-${i})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: reduce ? 0 : 0.6 }}
                />
              )}
              <motion.path
                d={d}
                fill="none"
                stroke={s.color}
                strokeWidth={s.dashed ? 1.75 : 2.5}
                strokeDasharray={s.dashed ? '5 6' : undefined}
                strokeLinecap="round"
                initial={{ pathLength: reduce ? 1 : 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: reduce ? 0 : 1.3, delay: 0.25 + i * 0.15, ease }}
              />
              {highlightLast && !s.dashed && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: reduce ? 0 : 1.4 }}
                  style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}
                >
                  <circle cx={last[0]} cy={last[1]} r={8} fill={s.color} opacity={0.2} />
                  <circle
                    cx={last[0]}
                    cy={last[1]}
                    r={4}
                    fill={dark ? 'var(--color-navy-950)' : 'white'}
                    stroke={s.color}
                    strokeWidth={2.5}
                  />
                </motion.g>
              )}
            </g>
          )
        })}
      </g>
    </svg>
  )
}

export function Sparkline({ values, color, width = 120, height = 36 }: { values: number[]; color: string; width?: number; height?: number }) {
  const reduce = useReducedMotion()
  const min = Math.min(...values)
  const max = Math.max(...values)
  const { d } = pathFrom(values, width, height, min - (max - min) * 0.1, max + (max - min) * 0.1, 2)
  return (
    <svg width={width} height={height}>
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 1.1, delay: 0.4, ease }}
      />
    </svg>
  )
}

export function BarChart({
  data,
  width,
  height,
  dark,
  max,
  color = 'var(--color-navy)',
  accentIndex,
  accentColor = 'var(--color-crimson)',
  showValues = true,
  format = (v: number) => String(v),
}: {
  data: { label: string; value: number }[]
  width: number
  height: number
  dark?: boolean
  max?: number
  color?: string
  accentIndex?: number
  accentColor?: string
  showValues?: boolean
  format?: (v: number) => string
}) {
  const reduce = useReducedMotion()
  const bottom = 24
  const top = showValues ? 20 : 4
  const h = height - bottom - top
  const m = max ?? Math.max(...data.map((d) => d.value))
  const slot = width / data.length
  const bw = Math.min(44, slot * 0.56)
  const txt = dark ? 'rgb(255 255 255 / 0.45)' : 'var(--color-subtle)'
  const val = dark ? 'rgb(255 255 255 / 0.85)' : 'var(--color-ink)'
  return (
    <svg width={width} height={height}>
      <line x1={0} x2={width} y1={top + h} y2={top + h} stroke={dark ? 'rgb(255 255 255 / 0.1)' : 'var(--color-line)'} />
      {data.map((d, i) => {
        const bh = (d.value / m) * h
        const x = slot * i + (slot - bw) / 2
        const fill = i === accentIndex ? accentColor : color
        return (
          <g key={d.label}>
            <rect x={x} y={top} width={bw} height={h} rx={6} fill={dark ? 'rgb(255 255 255 / 0.03)' : 'var(--color-navy-50)'} />
            <motion.rect
              x={x}
              width={bw}
              rx={6}
              fill={fill}
              initial={{ height: reduce ? bh : 0, y: reduce ? top + h - bh : top + h }}
              animate={{ height: bh, y: top + h - bh }}
              transition={{ duration: reduce ? 0 : 0.8, delay: 0.2 + i * 0.05, ease }}
            />
            {showValues && (
              <text x={x + bw / 2} y={top + h - bh - 7} textAnchor="middle" fontSize={11} fontWeight={600} fill={val} className="tabular-nums">
                {format(d.value)}
              </text>
            )}
            <text x={x + bw / 2} y={height - 6} textAnchor="middle" fontSize={11} fill={txt}>
              {d.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export function Donut({
  segments,
  size,
  thickness = 14,
  dark,
  children,
}: {
  segments: { value: number; color: string }[]
  size: number
  thickness?: number
  dark?: boolean
  children?: ReactNode
}) {
  const reduce = useReducedMotion()
  const r = (size - thickness) / 2
  const total = segments.reduce((n, s) => n + s.value, 0)
  const gap = 0.012
  let acc = 0
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={dark ? 'rgb(255 255 255 / 0.06)' : 'var(--color-navy-50)'} strokeWidth={thickness} />
        {segments.map((s, i) => {
          const frac = s.value / total
          const start = acc
          acc += frac
          const len = Math.max(frac - gap, 0.001)
          return (
            <motion.circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray={`${len} 1`}
              initial={{ strokeDashoffset: reduce ? -start : -start + len, opacity: reduce ? 1 : 0 }}
              animate={{ strokeDashoffset: -start, opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.9, delay: 0.25 + i * 0.12, ease }}
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div>
    </div>
  )
}

export function Gauge({
  value,
  size = 180,
  color,
  dark,
  children,
}: {
  value: number
  size?: number
  color: string
  dark?: boolean
  children?: ReactNode
}) {
  const reduce = useReducedMotion()
  const stroke = 12
  const r = (size - stroke) / 2
  const d = `M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`
  return (
    <div className="relative" style={{ width: size, height: size / 2 + 8 }}>
      <svg width={size} height={size / 2 + 8}>
        <path d={d} fill="none" stroke={dark ? 'rgb(255 255 255 / 0.08)' : 'var(--color-navy-50)'} strokeWidth={stroke} strokeLinecap="round" />
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          initial={{ pathLength: reduce ? value / 100 : 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: reduce ? 0 : 1.1, delay: 0.3, ease }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">{children}</div>
    </div>
  )
}
