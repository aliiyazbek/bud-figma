import { useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useAnimation } from 'motion/react'
import {
  Search, ChevronLeft, ChevronUp, ChevronRight, X, Plus, Minus, LocateFixed, GraduationCap, Building2, DoorOpen, BusFront, Utensils, CalendarClock,
  ConciergeBell, BookOpen, FlaskConical, Trophy, Landmark, MapPin, Phone, Globe, ExternalLink, Info, Route, Navigation, ArrowLeft, ShieldAlert, Layers3,
} from 'lucide-react'
import { MobileShell } from '../../components/mobile'
import { CampusMap } from '../../components/maps'
import { useNav } from '../../state/NavContext'
import { Badge, cx } from '../../components/ui'
import { useToast } from '../../components/toast'
import { CAMPUS, places, confidenceMeta, type Place, type PlaceKind } from '../../data/campus'

type Filter = 'all' | 'faculties' | 'buildings' | 'rooms' | 'buses' | 'services' | 'food' | 'events'
const filters: { key: Filter; en: string; ar: string; icon: typeof Building2 }[] = [
  { key: 'faculties', en: 'Faculties', ar: 'الكليات', icon: GraduationCap },
  { key: 'rooms', en: 'Rooms', ar: 'القاعات', icon: DoorOpen },
  { key: 'buses', en: 'Buses', ar: 'الباصات', icon: BusFront },
  { key: 'services', en: 'Services', ar: 'الخدمات', icon: ConciergeBell },
  { key: 'buildings', en: 'Buildings', ar: 'المباني', icon: Building2 },
  { key: 'food', en: 'Food', ar: 'الطعام', icon: Utensils },
  { key: 'events', en: 'Events', ar: 'الفعاليات', icon: CalendarClock },
]
const match: Record<Filter, PlaceKind[]> = {
  all: [],
  faculties: ['faculty', 'institute'],
  buildings: ['building'],
  rooms: [],
  buses: ['transport'],
  services: ['service', 'library', 'labs', 'sports'],
  food: [],
  events: [],
}
const kindIcon: Record<PlaceKind, typeof Building2> = {
  faculty: GraduationCap,
  institute: GraduationCap,
  building: Building2,
  service: Landmark,
  library: BookOpen,
  labs: FlaskConical,
  transport: BusFront,
  sports: Trophy,
}
const empty: Partial<Record<Filter, { en: string; ar: string; body: string }>> = {
  rooms: { en: 'No live room data available', ar: 'لا تتوفر بيانات مباشرة عن القاعات', body: 'Room availability appears once the timetable and room inventory are connected.' },
  food: { en: 'Food locations not mapped yet', ar: 'لم تُحدّد مواقع الطعام بعد', body: 'Cafeteria and vendor locations will be added after the campus survey.' },
  events: { en: 'No events placed on the map', ar: 'لا توجد فعاليات على الخريطة', body: 'Browse campus events in Events & Activities.' },
}

type Sheet = 'open' | 'peek' | 'hidden'

export default function M04() {
  const { go } = useNav()
  const toast = useToast()
  const pan = useAnimation()
  const [filter, setFilter] = useState<Filter>('all')
  const [sel, setSel] = useState<Place | null>(null)
  const [sheet, setSheet] = useState<Sheet>('open')
  const [zoom, setZoom] = useState(1)
  const [q, setQ] = useState('')
  const [focused, setFocused] = useState(false)
  const [highlight, setHighlight] = useState(false)
  const [demo, setDemo] = useState(false)

  const list = useMemo(() => (filter === 'all' ? places : places.filter((p) => match[filter].includes(p.kind))), [filter])
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    return places.filter((p) => [p.en, p.ar, p.summary, p.room ?? '', ...(p.programmes ?? []), ...(p.services ?? [])].join(' ').toLowerCase().includes(t)).slice(0, 6)
  }, [q])

  const open = (p: Place) => {
    setSel(p)
    setSheet('open')
    setQ('')
    setFocused(false)
    setDemo(false)
    setHighlight(true)
  }
  const recenter = () => {
    setZoom(1)
    pan.start({ x: 0, y: 0, transition: { type: 'spring', stiffness: 260, damping: 30 } })
  }
  const back = () => {
    setSel(null)
    setHighlight(false)
    setDemo(false)
  }

  return (
    <MobileShell>
      <div className="relative h-full overflow-hidden bg-[#F6F7F8]">
        <motion.div drag dragMomentum={false} dragElastic={0.15} dragConstraints={{ left: -170 * zoom, right: 170 * zoom, top: -240 * zoom, bottom: 240 * zoom }} animate={pan} className="absolute inset-0 cursor-grab active:cursor-grabbing">
          <motion.div className="h-full w-full" animate={{ scale: zoom }} transition={{ type: 'spring', stiffness: 220, damping: 28 }}>
            <CampusMap
              highlight={highlight}
              demoRoute={demo}
              onBlock={() => toast('Building identities will be labelled after BUD confirms the site plan', 'info')}
              onCampus={() => (back(), setSheet('open'))}
              className="h-full w-full"
            />
          </motion.div>
        </motion.div>

        {/* header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-white via-white/85 to-transparent pt-[52px] pb-6">
          <div className="pointer-events-auto flex items-center gap-2.5 px-4">
            <button onClick={() => go('M01')} aria-label="Back to home" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-[#0E2C57] shadow-card ring-1 ring-line">
              <ChevronLeft size={20} />
            </button>
            <div className="min-w-0 flex-1 leading-tight">
              <div className="font-display text-[19px] font-extrabold tracking-tight text-[#0E2C57]">BUD Campus</div>
              <div className="text-[11.5px] font-semibold text-muted" dir="rtl" lang="ar">
                خريطة الجامعة
              </div>
            </div>
            <button onClick={() => toast('Main campus · Ghabageb is the only campus', 'info')} className="flex h-9 items-center gap-1.5 rounded-full bg-white px-3 text-[11.5px] font-semibold text-ink shadow-card ring-1 ring-line">
              <MapPin size={13} className="text-[#A61C32]" /> Ghabageb
            </button>
          </div>

          <div className="pointer-events-auto mt-3 px-4">
            <label className={cx('flex h-11 items-center gap-2 rounded-2xl bg-white px-3.5 shadow-card ring-1 transition-shadow', focused ? 'ring-2 ring-[#0E2C57]' : 'ring-line')}>
              <Search size={16} className="shrink-0 text-[#0E2C57]" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setTimeout(() => setFocused(false), 150)}
                placeholder="Search faculties, buildings, rooms…"
                className="min-w-0 flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-subtle"
              />
              {q && (
                <button onClick={() => setQ('')} aria-label="Clear search" className="text-subtle">
                  <X size={15} />
                </button>
              )}
            </label>
            <AnimatePresence>
              {focused && q && (
                <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="relative z-20 mt-2 overflow-hidden rounded-2xl bg-white shadow-float ring-1 ring-line">
                  {results.length === 0 ? (
                    <div className="px-4 py-3 text-[13px] text-subtle">No matches for “{q}”. Try “Pharmacy”, “123” or “Engineering”.</div>
                  ) : (
                    results.map((p) => <Row key={p.id} p={p} onClick={() => open(p)} compact />)
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="no-scrollbar pointer-events-auto mt-2.5 flex gap-1.5 overflow-x-auto px-4 pb-1">
            {filters.map(({ key, en, icon: Icon }) => {
              const on = filter === key
              return (
                <button
                  key={key}
                  onClick={() => {
                    setFilter(on ? 'all' : key)
                    setSel(null)
                    setHighlight(false)
                    setDemo(false)
                    setSheet('open')
                  }}
                  aria-pressed={on}
                  className={cx('flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[12px] font-semibold shadow-card ring-1 transition-colors', on ? 'bg-[#0E2C57] text-white ring-[#0E2C57]' : 'bg-white text-ink ring-line')}
                >
                  <Icon size={13} /> {en}
                </button>
              )
            })}
          </div>
        </div>

        {/* map controls (kept clear of the sheet) */}
        <div className="absolute top-[206px] right-3 flex flex-col items-end gap-2">
          <div className="overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-line">
            <button aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.4).toFixed(1)))} className="flex h-10 w-10 items-center justify-center border-b border-line text-[#0E2C57]">
              <Plus size={17} />
            </button>
            <button aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(1, +(z - 0.4).toFixed(1)))} className="flex h-10 w-10 items-center justify-center text-[#0E2C57]">
              <Minus size={17} />
            </button>
          </div>
          <button aria-label="Recenter on campus" onClick={recenter} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0E2C57] shadow-card ring-1 ring-line">
            <LocateFixed size={17} />
          </button>
          <button aria-label="Floor plans" onClick={() => toast('Floor plans appear once BUD shares building drawings', 'info')} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0E2C57] shadow-card ring-1 ring-line">
            <Layers3 size={17} />
          </button>
        </div>

        {/* reopen pill */}
        <AnimatePresence>
          {sheet === 'hidden' && (
            <motion.button initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }} onClick={() => setSheet('peek')} className="absolute bottom-4 left-1/2 flex h-11 -translate-x-1/2 items-center gap-2 rounded-full bg-[#0E2C57] px-4 text-[13px] font-semibold whitespace-nowrap text-white shadow-float">
              {sel ? sel.en : 'Campus directory'} <ChevronUp size={16} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* bottom sheet */}
        <AnimatePresence>
          {sheet !== 'hidden' && (
            <motion.div
              key="sheet"
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0.05, bottom: 0.6 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 60) setSheet((s) => (s === 'open' ? 'peek' : 'hidden'))
                else if (info.offset.y < -40) setSheet('open')
              }}
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 120, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute inset-x-3 bottom-3 rounded-[24px] bg-white shadow-float ring-1 ring-line"
            >
              <button onClick={() => setSheet((s) => (s === 'open' ? 'peek' : 'open'))} aria-label={sheet === 'open' ? 'Collapse' : 'Expand'} className="flex h-6 w-full cursor-grab items-center justify-center pt-1.5">
                <span className="h-1 w-10 rounded-full bg-line" />
              </button>
              <button onClick={() => setSheet('hidden')} aria-label="Close panel" className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-ivory text-muted hover:text-ink">
                <X size={15} />
              </button>

              <div className="px-4 pb-4">
                {sel ? (
                  <Detail p={sel} sheet={sheet} demo={demo} onBack={back} onExpand={() => setSheet('open')} onShow={() => (setHighlight(true), recenter())} onDemo={() => setDemo((d) => !d)} onLink={(c) => go(c)} />
                ) : (
                  <Directory sheet={sheet} filter={filter} list={list} onPick={open} onExpand={() => setSheet('open')} onGo={go} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileShell>
  )
}

function Row({ p, onClick, compact }: { p: Place; onClick: () => void; compact?: boolean }) {
  const Icon = kindIcon[p.kind]
  return (
    <button onClick={onClick} onMouseDown={compact ? onClick : undefined} className={cx('flex w-full items-center gap-3 text-left hover:bg-ivory', compact ? 'border-b border-line/70 px-4 py-2.5 last:border-0' : 'rounded-xl px-2 py-2')}>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0E2C57]/[0.07] text-[#0E2C57]">
        <Icon size={16} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-semibold text-ink">{p.en}</span>
        <span className="block truncate text-[11.5px] text-muted">
          {p.room ?? p.summary}
          <span className="mx-1 text-line">·</span>
          <span dir="rtl" lang="ar">
            {p.ar}
          </span>
        </span>
      </span>
      <ChevronRight size={15} className="shrink-0 text-subtle" />
    </button>
  )
}

function Directory({ sheet, filter, list, onPick, onExpand, onGo }: { sheet: Sheet; filter: Filter; list: Place[]; onPick: (p: Place) => void; onExpand: () => void; onGo: (c: 'M09') => void }) {
  const e = empty[filter]
  const title = filter === 'all' ? 'Campus directory' : filters.find((f) => f.key === filter)!.en
  return (
    <>
      <button onClick={onExpand} className="flex w-full items-center gap-3 pr-8 text-left">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0E2C57] text-[12px] font-extrabold tracking-wide text-white">BUD</span>
        <div className="min-w-0 flex-1">
          <div className="text-[15.5px] leading-tight font-bold text-ink">{filter === 'all' ? CAMPUS.en : title}</div>
          <div className="mt-0.5 truncate text-[12px] text-muted">{filter === 'all' ? `${CAMPUS.place} · ${CAMPUS.road}` : `${e ? 0 : list.length} listed · locations pending survey`}</div>
        </div>
      </button>
      {sheet === 'open' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {filter === 'all' && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Action href={CAMPUS.maps} icon={<ExternalLink size={15} />} label="Open in Maps" />
              <Action href={`tel:${CAMPUS.phone.replace(/\s/g, '')}`} icon={<Phone size={15} />} label="Call" />
              <Action href={CAMPUS.web} icon={<Globe size={15} />} label="Website" />
            </div>
          )}
          {e ? (
            <div className="mt-3 rounded-2xl bg-ivory p-4 text-center">
              <div className="text-[13.5px] font-bold text-ink">{e.en}</div>
              <div className="mt-0.5 text-[12px] text-muted" dir="rtl" lang="ar">
                {e.ar}
              </div>
              <div className="mt-2 text-[12px] leading-snug text-muted">{e.body}</div>
              {filter === 'events' && (
                <button onClick={() => onGo('M09')} className="mt-3 h-9 rounded-xl bg-[#0E2C57] px-4 text-[12.5px] font-semibold text-white">
                  Open Events & Activities
                </button>
              )}
            </div>
          ) : (
            <div className="no-scrollbar -mx-2 mt-2 max-h-[220px] overflow-y-auto">
              {list.map((p) => (
                <Row key={p.id} p={p} onClick={() => onPick(p)} />
              ))}
            </div>
          )}
          <div className="mt-2 flex items-start gap-1.5 border-t border-line pt-2.5 text-[10.5px] leading-snug text-subtle">
            <Info size={12} className="mt-px shrink-0" /> Illustrative overview. Building positions, floors, routes and room data will be added once BUD provides the official site plan.
          </div>
        </motion.div>
      )}
    </>
  )
}

function Action({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="flex h-14 flex-col items-center justify-center gap-1 rounded-xl bg-ivory text-[11.5px] font-semibold text-[#0E2C57] ring-1 ring-line/70 hover:bg-[#0E2C57]/[0.06]">
      {icon}
      {label}
    </a>
  )
}

function Detail({ p, sheet, demo, onBack, onExpand, onShow, onDemo, onLink }: { p: Place; sheet: Sheet; demo: boolean; onBack: () => void; onExpand: () => void; onShow: () => void; onDemo: () => void; onLink: (c: 'M05' | 'M06' | 'M10' | 'M02') => void }) {
  const Icon = kindIcon[p.kind]
  const c = confidenceMeta[p.confidence]
  return (
    <>
      <div className="flex items-center gap-3 pr-8">
        <button onClick={onBack} aria-label="Back to directory" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ivory text-ink">
          <ArrowLeft size={15} />
        </button>
        <button onClick={onExpand} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#A61C32] text-white">
            <Icon size={19} />
          </span>
          <span className="min-w-0">
            <span className="block truncate text-[15.5px] leading-tight font-bold text-ink">{p.en}</span>
            <span className="block truncate text-[12px] text-muted" dir="rtl" lang="ar">
              {p.ar}
            </span>
          </span>
        </button>
      </div>
      {sheet === 'open' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mt-3">
            <Badge tone={c.tone} icon={<ShieldAlert size={11} />}>
              {c.en}
            </Badge>
          </div>
          <dl className="mt-3 divide-y divide-line/70 rounded-2xl bg-ivory/70 px-3.5 text-[12.5px] ring-1 ring-line/60">
            <Fact k="Type" v={p.summary} />
            {p.room && <Fact k="Room" v={p.room} />}
            {p.programmes && <Fact k={p.programmes.length > 1 ? 'Programmes' : 'Programme'} v={p.programmes.join(' · ')} />}
            {p.services && <Fact k="Known services" v={p.services.join(' · ')} />}
            <Fact k="Floor" v="Not yet mapped" muted />
            <Fact k="Directions" v="Coming soon · سيتم توفير الاتجاهات قريباً" muted />
          </dl>
          <div className="mt-3 flex gap-2">
            <button onClick={onShow} className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0E2C57] text-[13.5px] font-semibold text-white">
              <Navigation size={15} /> Show on campus
            </button>
            {p.link && (
              <button onClick={() => onLink(p.link!.code)} className="flex h-11 flex-1 items-center justify-center gap-1.5 rounded-xl bg-white text-[13px] font-semibold text-[#0E2C57] ring-1 ring-line">
                {p.link.label} <ChevronRight size={14} />
              </button>
            )}
          </div>
          <button onClick={onDemo} aria-pressed={demo} className={cx('mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl text-[12px] font-semibold ring-1 transition-colors', demo ? 'bg-[#0E2C57]/[0.07] text-[#0E2C57] ring-[#0E2C57]/20' : 'bg-white text-muted ring-line')}>
            <Route size={14} /> {demo ? 'Hide demo route' : 'Preview demo route'} <span className="text-subtle">· مسار تجريبي</span>
          </button>
        </motion.div>
      )}
    </>
  )
}

function Fact({ k, v, muted }: { k: string; v: string; muted?: boolean }) {
  return (
    <div className="flex gap-3 py-2">
      <dt className="w-[92px] shrink-0 font-semibold text-subtle">{k}</dt>
      <dd className={cx('min-w-0 flex-1', muted ? 'text-subtle italic' : 'font-medium text-ink')}>{v}</dd>
    </div>
  )
}
