import { useState } from 'react'
import { CalendarDays, MapPin, Users, CheckCircle2, Ticket, BellPlus, BellRing } from 'lucide-react'
import { useToast } from '../../components/toast'
import { MobileShell, MobileHeader } from '../../components/mobile'
import { Reveal, Badge, Button, GradedImage } from '../../components/ui'
import { useDemo } from '../../state/DemoContext'
import { images } from '../../data/images'

const list = [
  { img: images.lecture, title: 'Guest lecture: AI in healthcare', when: 'Tue 15 Sep · 14:00', where: 'Auditorium A', tag: 'Academic' },
  { img: images.concert, title: 'Welcome-back concert', when: 'Thu 17 Sep · 18:30', where: 'Open-air stage', tag: 'Culture' },
  { img: images.hackathon, title: 'Robotics Club open day', when: 'Sun 20 Sep · 12:00', where: 'Student Center', tag: 'Clubs' },
  { img: images.lecture, title: 'CV & interview workshop', when: 'Mon 21 Sep · 11:00', where: 'Career Office', tag: 'Careers' },
  { img: images.concert, title: 'Inter-faculty football cup', when: 'Wed 23 Sep · 16:00', where: 'Sports court', tag: 'Sports' },
]

export default function M09() {
  const { state, dispatch } = useDemo()
  const toast = useToast()
  const [cat, setCat] = useState('All')
  const [remind, setRemind] = useState<string[]>([])
  const shown = list.filter((e) => cat === 'All' || e.tag === cat)
  return (
    <MobileShell>
      <MobileHeader title="Events & Activities" subtitle="What’s on at campus this week" />
      <div className="space-y-4 px-4 pb-6">
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {['All', 'Academic', 'Clubs', 'Culture', 'Sports', 'Careers'].map((c) => (
            <button key={c} onClick={() => setCat(c)} aria-pressed={cat === c} className={cat === c ? 'shrink-0 rounded-full bg-navy px-3.5 py-1.5 text-[12.5px] font-semibold text-white' : 'shrink-0 rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-ink ring-1 ring-line'}>
              {c}
            </button>
          ))}
        </div>
        <Reveal>
          <div className="overflow-hidden rounded-[24px] bg-white shadow-card ring-1 ring-line">
            <GradedImage src={images.hackathon.src} alt={images.hackathon.alt} className="h-[190px]">
              <div className="flex h-full flex-col justify-between p-4">
                <div className="flex justify-between">
                  <Badge tone="navy" className="border-white/20 bg-white/15 backdrop-blur">Featured</Badge>
                  <span className="rounded-xl bg-white px-2.5 py-1 text-center leading-tight text-navy">
                    <span className="block text-[10px] font-bold text-crimson">SEP</span>
                    <span className="block text-[17px] font-bold">24</span>
                  </span>
                </div>
                <div className="text-[21px] leading-tight font-bold text-white">BUD Hackathon 2026</div>
              </div>
            </GradedImage>
            <div className="p-4">
              <div className="text-[13px] leading-snug text-muted">48 hours to build digital services for Damascus. Teams of 3–5, mentors from industry.</div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] text-muted">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} /> Thu 24 Sep · 09:00
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> Engineering Hall
                </span>
                <span className="col-span-2 flex items-center gap-1.5">
                  <Users size={13} /> {state.eventBooked ? 143 : 142} of 160 seats booked
                </span>
              </div>
              {state.eventBooked ? (
                <Button variant="success" size="lg" className="mt-4 w-full" disabled>
                  <CheckCircle2 size={16} /> Seat booked · ticket in Wallet
                </Button>
              ) : (
                <Button size="lg" className="mt-4 w-full" story="book-event" onClick={() => dispatch({ type: 'bookEvent' })}>
                  <Ticket size={16} /> Book my seat
                </Button>
              )}
            </div>
          </div>
        </Reveal>
        <Reveal i={1}>
          <div className="px-1 text-[16px] font-semibold">Coming up</div>
          <div className="mt-2.5 space-y-2.5">
            {shown.length === 0 && <div className="rounded-[20px] bg-white p-4 text-center text-[13px] text-subtle ring-1 ring-line">No {cat.toLowerCase()} events this week</div>}
            {shown.map((e) => (
              <div key={e.title} className="flex items-center gap-3 rounded-[20px] bg-white p-2.5 ring-1 ring-line">
                <GradedImage src={e.img.src} alt={e.img.alt} strength="soft" className="h-[76px] w-[88px] shrink-0 rounded-2xl" />
                <div className="min-w-0 flex-1 py-1">
                  <Badge tone="info">{e.tag}</Badge>
                  <div className="mt-1 truncate text-[14px] font-semibold">{e.title}</div>
                  <div className="text-[11.5px] text-muted">
                    {e.when} · {e.where}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const on = remind.includes(e.title)
                    setRemind((r) => (on ? r.filter((x) => x !== e.title) : [...r, e.title]))
                    toast(on ? 'Reminder removed' : 'We will remind you 1 hour before')
                  }}
                  aria-label={`Remind me about ${e.title}`}
                  aria-pressed={remind.includes(e.title)}
                  className={remind.includes(e.title) ? 'mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy text-white' : 'mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ivory text-navy'}
                >
                  {remind.includes(e.title) ? <BellRing size={16} /> : <BellPlus size={16} />}
                </button>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </MobileShell>
  )
}
