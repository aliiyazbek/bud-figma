import { motion, useReducedMotion } from 'motion/react'

const P = {
  navy: '#0E2C57',
  burgundy: '#A61C32',
  beige: '#D6C3A5',
  beigeTop: '#E9DCC4',
  beigeDark: '#C2AB86',
  road: '#EFE9DF',
  roadEdge: '#DED3C0',
  garden: '#ACC49C',
  gardenLight: '#C3D6B5',
  glass: '#86B4CC',
  bg: '#F6F7F8',
}

/** Illustrative 2.5D academic block: footprint (x,y,w,d) extruded by h. */
function Block({ x, y, w, d, h, floors, atrium, onClick }: { x: number; y: number; w: number; d: number; h: number; floors: number; atrium: number; onClick?: () => void }) {
  const top = y - h
  const ax = x + atrium
  return (
    <g onClick={onClick} style={{ cursor: onClick ? 'pointer' : undefined }}>
      <rect x={x + 6} y={y + 4} width={w + 4} height={d * 0.55} rx="4" fill="#3b3326" opacity="0.16" filter="url(#bm-blur)" />
      {/* front facade */}
      <rect x={x} y={top + d} width={w} height={h} fill={P.beige} />
      {Array.from({ length: floors }).map((_, f) => (
        <rect key={f} x={x + 3} y={top + d + 4 + f * ((h - 6) / floors)} width={w - 6} height={Math.max(2, (h - 6) / floors - 4)} rx="1" fill={P.beigeDark} opacity="0.55" />
      ))}
      {/* glass atrium */}
      <rect x={ax} y={top + d - 2} width="18" height={h + 2} fill={P.glass} />
      {Array.from({ length: 3 }).map((_, k) => (
        <line key={k} x1={ax + 4.5 + k * 4.5} y1={top + d} x2={ax + 4.5 + k * 4.5} y2={y + d} stroke="#ffffff" strokeOpacity="0.55" strokeWidth="0.8" />
      ))}
      {/* entrance stairs */}
      <rect x={ax - 4} y={y + d} width="26" height="3" fill="#e6dccb" />
      <rect x={ax - 7} y={y + d + 3} width="32" height="3" fill="#ece4d5" />
      {/* roof */}
      <rect x={x} y={top} width={w} height={d} fill={P.beigeTop} stroke={P.beigeDark} strokeWidth="0.8" />
      <rect x={ax} y={top} width="18" height={d} fill={P.glass} opacity="0.75" />
      <rect x={x + w - 26} y={top + 8} width="16" height="10" rx="2" fill="#dccdb2" />
    </g>
  )
}

function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <ellipse cx={x + 3} cy={y + 9} rx="6" ry="2" fill="#000" opacity="0.12" />
      <line x1={x} y1={y + 8} x2={x} y2={y} stroke="#9a7f58" strokeWidth="1.6" />
      {[0, 60, 120, 180, 240, 300].map((r) => (
        <ellipse key={r} cx={x} cy={y - 3} rx="6.5" ry="2" fill="#6f9a5e" transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </g>
  )
}
function Pine({ x, y, r = 6 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <ellipse cx={x + 2.5} cy={y + r * 0.9} rx={r} ry={r * 0.35} fill="#000" opacity="0.12" />
      <path d={`M${x} ${y - r * 1.6} L${x + r} ${y + r * 0.7} L${x - r} ${y + r * 0.7} Z`} fill="#5f8a55" />
      <path d={`M${x} ${y - r * 1.6} L${x + r * 0.35} ${y + r * 0.7} L${x - r} ${y + r * 0.7} Z`} fill="#77a46a" />
    </g>
  )
}

const palms: [number, number][] = [[186, 560], [214, 560], [186, 600], [214, 600], [186, 520], [214, 520]]
const pines: [number, number, number?][] = [[60, 120], [52, 260], [64, 420], [340, 110], [350, 260], [338, 430], [150, 460], [262, 470], [120, 100], [290, 92]]

/**
 * Illustrative 2.5D overview of the BUD campus in Ghabageb.
 * NOT a surveyed plan: building identities, entrances and paths are unverified.
 */
export function CampusMap({
  highlight = false,
  demoRoute = false,
  onBlock,
  onCampus,
  className,
}: {
  highlight?: boolean
  demoRoute?: boolean
  onBlock?: () => void
  onCampus?: () => void
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <svg viewBox="0 0 390 720" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label="Illustrative overview of BUD campus, Ghabageb">
      <defs>
        <filter id="bm-blur" x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
        <pattern id="bm-field" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(18)">
          <line x1="0" y1="0" x2="0" y2="10" stroke="#d7d0bd" strokeWidth="1" />
        </pattern>
        <pattern id="bm-pave" width="9" height="9" patternUnits="userSpaceOnUse">
          <rect width="9" height="9" fill={P.road} />
          <path d="M0 9 L9 0" stroke={P.roadEdge} strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* surrounding countryside */}
      <rect width="390" height="720" fill={P.bg} />
      <g opacity="0.9">
        <rect x="-30" y="-10" width="200" height="60" fill="#ebe5d4" transform="rotate(-4)" />
        <rect x="-30" y="-10" width="200" height="60" fill="url(#bm-field)" transform="rotate(-4)" />
        <rect x="210" y="-14" width="210" height="52" fill="#e3e8d8" transform="rotate(3 300 10)" />
        <rect x="-20" y="590" width="150" height="140" fill="#e8e2d0" />
        <rect x="-20" y="590" width="150" height="140" fill="url(#bm-field)" />
        <rect x="260" y="610" width="160" height="120" fill="#e3e8d8" />
      </g>

      {/* Damascus–Daraa highway */}
      <g>
        <path d="M-20 612 L410 660" stroke="#cfcac0" strokeWidth="34" />
        <path d="M-20 612 L410 660" stroke="#bdb7ab" strokeWidth="34" strokeDasharray="0" opacity="0.25" />
        <path d="M-20 612 L410 660" stroke="#fff" strokeWidth="1.3" strokeDasharray="10 9" opacity="0.8" />
        <text fontSize="8.5" fontWeight="700" fill="#6f6a60" letterSpacing="0.6" transform="rotate(6.4 30 600)" x="12" y="598">← DAMASCUS</text>
        <text fontSize="8.5" fontWeight="700" fill="#6f6a60" letterSpacing="0.6" transform="rotate(6.4 330 640)" x="318" y="636">DARAA →</text>
        <text fontSize="8" fontWeight="600" fill="#8b867b" transform="rotate(6.4 200 640)" x="150" y="657">Damascus–Daraa Highway</text>
      </g>

      {/* campus plot */}
      <path d="M34 78 Q36 60 56 58 L340 46 Q362 46 362 68 L370 500 Q370 522 348 524 L58 560 Q38 562 36 540 Z" fill="#f1ece2" stroke="#d9cdb8" strokeWidth="1.5" onClick={onCampus} />
      {/* gardens */}
      <path d="M52 84 L120 80 L118 136 L54 140 Z" fill={P.garden} opacity="0.85" />
      <rect x="240" y="66" width="106" height="58" rx="14" fill={P.garden} opacity="0.75" />
      <rect x="52" y="214" width="66" height="96" rx="16" fill={P.gardenLight} />
      <rect x="326" y="214" width="32" height="140" rx="12" fill={P.gardenLight} />
      <rect x="120" y="408" width="160" height="70" rx="18" fill={P.garden} opacity="0.8" />
      <rect x="132" y="418" width="136" height="50" rx="14" fill={P.gardenLight} />

      {/* access road from highway + internal loop */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M200 640 L200 500" stroke={P.roadEdge} strokeWidth="20" />
        <path d="M200 640 L200 500" stroke={P.road} strokeWidth="16" />
        <rect x="76" y="160" width="248" height="330" rx="34" stroke={P.roadEdge} strokeWidth="16" />
        <rect x="76" y="160" width="248" height="330" rx="34" stroke={P.road} strokeWidth="12" />
      </g>
      {/* pedestrian spine & plaza */}
      <rect x="186" y="170" width="28" height="320" fill="url(#bm-pave)" />
      <rect x="128" y="300" width="144" height="40" rx="10" fill="url(#bm-pave)" stroke={P.roadEdge} />

      {/* illustrative academic blocks (identities unverified) */}
      <Block x={96} y={196} w={84} d={60} h={34} floors={4} atrium={30} onClick={onBlock} />
      <Block x={222} y={196} w={92} d={64} h={40} floors={5} atrium={40} onClick={onBlock} />
      <Block x={98} y={370} w={80} d={44} h={24} floors={3} atrium={26} onClick={onBlock} />
      <Block x={224} y={372} w={86} d={44} h={22} floors={3} atrium={34} onClick={onBlock} />

      {/* vegetation */}
      {pines.map(([x, y, r], k) => (
        <Pine key={k} x={x} y={y} r={r ?? 6} />
      ))}
      {palms.map(([x, y], k) => (
        <Palm key={k} x={x} y={y} />
      ))}

      {/* pending-location ring */}
      {highlight && (
        <g>
          <motion.rect
            x="60"
            y="140"
            width="280"
            height="372"
            rx="60"
            fill={P.burgundy}
            fillOpacity="0.05"
            stroke={P.burgundy}
            strokeWidth="2"
            strokeDasharray="7 6"
            initial={{ opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, strokeDashoffset: [0, -26] }}
            transition={reduce ? undefined : { strokeDashoffset: { duration: 1.4, repeat: Infinity, ease: 'linear' } }}
          />
          <g transform="translate(200 146)">
            <rect x="-96" y="-11" width="192" height="22" rx="11" fill={P.burgundy} />
            <text y="4" fontSize="9.5" fontWeight="700" fill="#fff" textAnchor="middle">Within campus · exact position pending</text>
          </g>
        </g>
      )}

      {/* demo route */}
      {demoRoute && (
        <g>
          <motion.path d="M200 636 L200 490 L200 330" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 1.1 }} />
          <motion.path d="M200 636 L200 490 L200 330" fill="none" stroke={P.navy} strokeWidth="3.5" strokeDasharray="2 7" strokeLinecap="round" initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 1.1 }} />
          <g transform="translate(262 560)">
            <rect x="-48" y="-12" width="96" height="24" rx="12" fill="#fff" stroke={P.navy} strokeWidth="1.2" />
            <text y="-1" fontSize="8.5" fontWeight="800" fill={P.navy} textAnchor="middle">DEMO ROUTE</text>
            <text y="8.5" fontSize="7.5" fontWeight="600" fill="#5b6779" textAnchor="middle">مسار تجريبي</text>
          </g>
        </g>
      )}

      {/* verified campus anchor */}
      <g transform="translate(200 318)" onClick={onCampus} style={{ cursor: onCampus ? 'pointer' : undefined }}>
        {!reduce && <motion.circle r="12" fill={P.navy} animate={{ r: [12, 30], opacity: [0.28, 0] }} transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }} />}
        <path d="M0 0 c -12 -14 -17 -20 -17 -28 a 17 17 0 0 1 34 0 c 0 8 -5 14 -17 28 z" fill={P.navy} stroke="#fff" strokeWidth="2.5" />
        <text y="-24" fontSize="9.5" fontWeight="800" fill="#fff" textAnchor="middle" letterSpacing="0.4">BUD</text>
        <g transform="translate(0 16)">
          <rect x="-58" y="-10" width="116" height="20" rx="10" fill="#fff" stroke="#e3e6eb" />
          <text y="4" fontSize="9.5" fontWeight="700" fill={P.navy} textAnchor="middle">BUD Campus · Ghabageb</text>
        </g>
      </g>

      {/* footer note */}
      <g transform="translate(14 700)">
        <rect x="0" y="-11" width="232" height="17" rx="8.5" fill="#fff" opacity="0.92" />
        <text x="8" y="1" fontSize="8" fontWeight="600" fill="#5b6779">33.1729° N · 36.2951° E · Illustrative, not to scale</text>
      </g>
    </svg>
  )
}

export interface Stop {
  name: string
  time: string
}

/** Schematic route strip used for transport screens (no live tracking). */
export function RouteLine({
  stops,
  width,
  dark,
  highlight,
  color = 'var(--color-crimson)',
}: {
  stops: Stop[]
  width: number
  dark?: boolean
  highlight?: number
  color?: string
}) {
  const reduce = useReducedMotion()
  const pad = 34
  const step = (width - pad * 2) / (stops.length - 1)
  const y = 34
  const gid = `rl-${width}-${dark ? 'd' : 'l'}`
  // gentle wave so the line reads as a road, not a progress bar
  const pts = stops.map((_, i) => [pad + step * i, y + (i % 2 === 0 ? 0 : -6)] as const)
  const d = pts.map(([x, py], i) => (i === 0 ? `M${x} ${py}` : `S${x - step / 2} ${py} ${x} ${py}`)).join(' ')
  return (
    <svg width={width} height={96} aria-label="Route schematic">
      <defs>
        <linearGradient id={gid} x1="0" x2="1">
          <stop offset="0" stopColor={color} />
          <stop offset="1" stopColor={dark ? 'var(--color-sky)' : 'var(--color-navy)'} />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke={dark ? 'rgb(255 255 255 / 0.08)' : 'var(--color-navy-100)'} strokeWidth={12} strokeLinecap="round" />
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth={6}
        strokeLinecap="round"
        initial={{ pathLength: reduce ? 1 : 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 1.3, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      />
      <path d={d} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={1.2} strokeDasharray="4 7" />
      {stops.map((s, i) => {
        const [x, py] = pts[i]
        const hl = i === highlight
        const last = i === stops.length - 1
        return (
          <g key={s.name}>
            {hl && !reduce && <motion.circle cx={x} cy={py} r={10} fill={color} animate={{ r: [10, 20], opacity: [0.4, 0] }} transition={{ duration: 1.8, repeat: Infinity }} />}
            {last ? (
              <g>
                <rect x={x - 12} y={py - 12} width={24} height={24} rx={8} fill={dark ? 'var(--color-sky)' : 'var(--color-navy)'} stroke={dark ? 'var(--color-navy-950)' : '#fff'} strokeWidth={3} />
                <path d={`M${x - 5} ${py + 4} L${x - 5} ${py - 1} L${x} ${py - 5} L${x + 5} ${py - 1} L${x + 5} ${py + 4} Z`} fill={dark ? 'var(--color-navy-950)' : '#fff'} />
              </g>
            ) : (
              <circle cx={x} cy={py} r={hl ? 10 : 6.5} fill={dark ? 'var(--color-navy-950)' : 'white'} stroke={hl ? color : dark ? 'rgb(255 255 255 / 0.5)' : 'var(--color-navy-600)'} strokeWidth={hl ? 4.5 : 3} />
            )}
            {hl && <circle cx={x} cy={py} r={3.5} fill={color} />}
            <text x={x} y={70} textAnchor="middle" fontSize={11.5} fontWeight={hl || last ? 700 : 600} fill={dark ? 'rgb(255 255 255 / 0.85)' : 'var(--color-ink)'}>
              {s.name}
            </text>
            <text x={x} y={87} textAnchor="middle" fontSize={11} fontWeight={600} fill={hl ? color : dark ? 'rgb(255 255 255 / 0.45)' : 'var(--color-subtle)'} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {s.time}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
