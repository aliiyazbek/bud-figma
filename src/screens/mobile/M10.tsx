import { useState } from 'react'
import { Search, BookMarked, CheckCircle2, Clock, BookOpen, X, Plus } from 'lucide-react'
import { useToast } from '../../components/toast'
import { MobileShell, MobileHeader } from '../../components/mobile'
import { Reveal, Badge, Button, GradedImage } from '../../components/ui'
import { useDemo } from '../../state/DemoContext'
import { images } from '../../data/images'

export default function M10() {
  const { state, dispatch } = useDemo()
  const toast = useToast()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('Computer Science')
  const [held, setHeld] = useState<string[]>([])
  const term = q.trim().toLowerCase()
  const results = catalogue.filter((b) => (term ? (b.title + b.author).toLowerCase().includes(term) : b.cat === cat)).slice(0, 4)
  return (
    <MobileShell>
      <MobileHeader title="Library" subtitle="Central Library · open until 22:00" />
      <div className="space-y-4 px-4 pb-6">
        <GradedImage src={images.library.src} alt={images.library.alt} className="h-[118px] rounded-[22px]">
          <div className="flex h-full flex-col justify-end p-4">
            <label className="flex h-11 items-center gap-2 rounded-2xl bg-white px-3.5 text-[14px] text-ink focus-within:ring-2 focus-within:ring-navy">
              <Search size={16} className="text-subtle" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search 48,000 titles" className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-subtle" />
              {q && (
                <button onClick={() => setQ('')} aria-label="Clear search" className="text-subtle">
                  <X size={15} />
                </button>
              )}
            </label>
          </div>
        </GradedImage>
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {['Computer Science', 'Engineering', 'Business', 'Pharmacy', 'Arabic literature'].map((c, i) => (
            <button key={c} onClick={() => (setCat(c), setQ(''))} aria-pressed={!q && c === cat} className={!q && c === cat ? 'shrink-0 rounded-full bg-navy px-3.5 py-1.5 text-[12.5px] font-semibold text-white' : 'shrink-0 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold ring-1 ring-line'}>
              {c}
            </button>
          ))}
        </div>
        <div className="rounded-[20px] bg-white p-1.5 ring-1 ring-line">
          <div className="px-2.5 pt-2 pb-1 text-[10.5px] font-bold tracking-wider text-subtle uppercase">{q ? `Results for “${q}”` : cat}</div>
          {results.length === 0 && <div className="px-2.5 py-4 text-[13px] text-subtle">No titles found. Try “database” or “networks”.</div>}
          {results.map((b) => {
            const on = held.includes(b.title)
            return (
              <div key={b.title} className="flex items-center gap-3 rounded-xl px-2.5 py-2">
                <span className="h-11 w-8 shrink-0 rounded-[4px] shadow-card" style={{ background: b.color }} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13.5px] font-semibold">{b.title}</div>
                  <div className="truncate text-[11.5px] text-muted">
                    {b.author} · {b.avail > 0 ? `${b.avail} available` : 'All on loan'}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setHeld((h) => (on ? h.filter((x) => x !== b.title) : [...h, b.title]))
                    toast(on ? 'Hold cancelled' : b.avail > 0 ? 'Reserved · pick up within 3 days' : 'Added to waitlist · we will notify you')
                  }}
                  aria-label={on ? `Cancel hold on ${b.title}` : `Reserve ${b.title}`}
                  className={on ? 'flex h-8 items-center gap-1 rounded-full bg-success-50 px-2.5 text-[11.5px] font-semibold text-success' : 'flex h-8 items-center gap-1 rounded-full bg-navy-50 px-2.5 text-[11.5px] font-semibold text-navy'}
                >
                  {on ? <CheckCircle2 size={13} /> : <Plus size={13} />} {on ? 'Held' : b.avail > 0 ? 'Reserve' : 'Waitlist'}
                </button>
              </div>
            )
          })}
        </div>
        <Reveal>
          <div className="rounded-[24px] bg-white p-4 ring-1 ring-line">
            <div className="flex gap-4">
              <div className="relative flex h-[148px] w-[104px] shrink-0 flex-col justify-between overflow-hidden rounded-lg bg-gradient-to-br from-navy-700 to-navy-950 p-3 text-white shadow-card">
                <span className="absolute inset-y-0 left-0 w-1.5 bg-crimson" />
                <span className="pl-1 text-[9px] font-semibold tracking-widest text-white/60 uppercase">7th edition</span>
                <span className="pl-1 text-[13px] leading-tight font-bold">Database System Concepts</span>
              </div>
              <div className="min-w-0 flex-1">
                <Badge tone="success">Recommended for CS301</Badge>
                <div className="mt-1.5 text-[16px] leading-snug font-bold">Database System Concepts</div>
                <div className="text-[12.5px] text-muted">Silberschatz, Korth & Sudarshan</div>
                <div className="mt-2 space-y-1 text-[12px] text-muted">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={13} /> Shelf QA76.9 · Floor 2
                  </div>
                  <div className="flex items-center gap-1.5">
                    <BookMarked size={13} /> {state.bookReserved ? '2 of 5 copies available' : '3 of 5 copies available'}
                  </div>
                </div>
              </div>
            </div>
            {state.bookReserved ? (
              <div className="mt-4 rounded-2xl bg-success-50 p-3 ring-1 ring-success/20">
                <div className="flex items-center gap-2 text-[13.5px] font-bold text-success">
                  <CheckCircle2 size={16} /> Reserved for you
                </div>
                <div className="mt-1 text-[12.5px] text-ink">Pick up by Wed 16 Sep · Return by Wed 30 Sep</div>
              </div>
            ) : (
              <Button size="lg" className="mt-4 w-full" onClick={() => dispatch({ type: 'reserveBook' })}>
                <BookMarked size={16} /> Reserve a copy
              </Button>
            )}
          </div>
        </Reveal>
        <Reveal i={1}>
          <div className="px-1 text-[16px] font-semibold">My loans</div>
          <div className="mt-2.5 space-y-2">
            {[
              { t: 'Operating System Concepts', d: 'Due Thu 17 Sep', warn: true },
              { t: 'Clean Architecture', d: 'Due Mon 28 Sep', warn: false },
            ].map((l) => (
              <div key={l.t} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-line">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy">
                  <BookOpen size={16} />
                </span>
                <span className="flex-1 truncate text-[13.5px] font-semibold">{l.t}</span>
                <Badge tone={l.warn ? 'warning' : 'neutral'} icon={<Clock size={11} />}>
                  {l.d}
                </Badge>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </MobileShell>
  )
}

const catalogue = [
  { title: 'Database System Concepts', author: 'Silberschatz et al.', cat: 'Computer Science', avail: 3, color: '#102945' },
  { title: 'Computer Networking: A Top-Down Approach', author: 'Kurose & Ross', cat: 'Computer Science', avail: 0, color: '#a51f2b' },
  { title: 'Clean Architecture', author: 'Robert C. Martin', cat: 'Computer Science', avail: 2, color: '#1f8a5b' },
  { title: 'Operating System Concepts', author: 'Silberschatz et al.', cat: 'Computer Science', avail: 1, color: '#c8932b' },
  { title: 'Fundamentals of Electric Circuits', author: 'Alexander & Sadiku', cat: 'Engineering', avail: 4, color: '#2a4c75' },
  { title: 'Engineering Mechanics: Statics', author: 'R. C. Hibbeler', cat: 'Engineering', avail: 2, color: '#5b6779' },
  { title: 'Principles of Marketing', author: 'Kotler & Armstrong', cat: 'Business', avail: 5, color: '#8e1a24' },
  { title: 'Corporate Finance', author: 'Berk & DeMarzo', cat: 'Business', avail: 0, color: '#0d223b' },
  { title: "Goodman & Gilman's Pharmacology", author: 'Brunton et al.', cat: 'Pharmacy', avail: 1, color: '#1f8a5b' },
  { title: 'Al-Ayyam', author: 'Taha Hussein', cat: 'Arabic literature', avail: 3, color: '#c8932b' },
]
