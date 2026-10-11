import { useState } from 'react'
import { Bookmark, BookmarkCheck, MapPin, Clock, Send, CheckCircle2, Briefcase } from 'lucide-react'
import { MobileShell, MobileHeader } from '../../components/mobile'
import { Reveal, Badge, Button, GradedImage, cx } from '../../components/ui'
import { useDemo } from '../../state/DemoContext'
import { images } from '../../data/images'
import { useToast } from '../../components/toast'

export default function M11() {
  const { state, dispatch } = useDemo()
  const toast = useToast()
  const [applied, setApplied] = useState<string[]>([])
  return (
    <MobileShell>
      <MobileHeader title="Career Opportunities" subtitle="Matched to Software Engineering · Year 3" />
      <div className="space-y-4 px-4 pb-6">
        <Reveal>
          <div className="overflow-hidden rounded-[24px] bg-white shadow-card ring-1 ring-line">
            <GradedImage src={images.developer.src} alt={images.developer.alt} className="h-[168px]">
              <div className="flex h-full flex-col justify-between p-4">
                <div className="flex justify-between">
                  <Badge tone="navy" className="border-white/20 bg-white/15 backdrop-blur">94% match</Badge>
                  <button
                    onClick={() => dispatch({ type: 'toggleSaveJob' })}
                    aria-pressed={state.jobSaved}
                    aria-label={state.jobSaved ? 'Remove from saved' : 'Save opportunity'}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-navy"
                  >
                    {state.jobSaved ? <BookmarkCheck size={17} className="text-crimson" /> : <Bookmark size={17} />}
                  </button>
                </div>
                <div>
                  <div className="text-[12px] font-medium text-white/70">Levant Software Studio · Demo partner</div>
                  <div className="text-[21px] leading-tight font-bold text-white">Summer Software Intern</div>
                </div>
              </div>
            </GradedImage>
            <div className="p-4">
              <div className="flex flex-wrap gap-1.5">
                {['React', 'SQL', 'REST APIs', '8 weeks'].map((t) => (
                  <span key={t} className="rounded-md bg-ivory px-2 py-0.5 text-[11.5px] font-semibold text-muted">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex gap-4 text-[12px] text-muted">
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} /> Damascus · Hybrid
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={13} /> Apply by 30 Sep
                </span>
              </div>
              {state.jobApplied ? (
                <div className="mt-4 rounded-2xl bg-success-50 p-3 ring-1 ring-success/20">
                  <div className="flex items-center gap-2 text-[13.5px] font-bold text-success">
                    <CheckCircle2 size={16} /> Application sent (demo)
                  </div>
                  <div className="mt-1 text-[12.5px] text-ink">Your profile and transcript were shared with the Career Office.</div>
                </div>
              ) : (
                <Button size="lg" className="mt-4 w-full" onClick={() => dispatch({ type: 'applyJob' })}>
                  <Send size={15} /> Send demo application
                </Button>
              )}
            </div>
          </div>
        </Reveal>
        <Reveal i={1}>
          <div className="px-1 text-[16px] font-semibold">More for you</div>
          <div className="mt-2.5 space-y-2.5">
            {[
              { img: images.engineering, t: 'Graduate Trainee — Systems', c: 'Damascus Engineering Group', tag: 'Full-time · 2027' },
              { img: images.hackathon, t: 'Teaching Assistant — CS201', c: 'BUD Faculty of Engineering', tag: 'On campus · Part-time' },
            ].map((j, i) => (
              <div key={j.t} className="flex gap-3 rounded-[20px] bg-white p-2.5 ring-1 ring-line">
                <GradedImage src={j.img.src} alt={j.img.alt} strength="soft" className="h-[76px] w-[76px] shrink-0 rounded-2xl">
                  <div className="flex h-full items-center justify-center text-white/90">
                    <Briefcase size={20} />
                  </div>
                </GradedImage>
                <div className="min-w-0 flex-1 py-1">
                  <div className="truncate text-[14px] font-semibold">{j.t}</div>
                  <div className="truncate text-[12px] text-muted">{j.c}</div>
                  <span className={cx('mt-1.5 inline-block')}>
                    <Badge tone={i === 0 ? 'info' : 'success'}>{j.tag}</Badge>
                  </span>
                </div>
                <button
                  onClick={() => {
                    const on = applied.includes(j.t)
                    setApplied((a) => (on ? a.filter((x) => x !== j.t) : [...a, j.t]))
                    toast(on ? 'Application withdrawn' : `Applied to ${j.c} · CV attached`)
                  }}
                  className={cx('self-center rounded-full px-3 py-1.5 text-[12px] font-semibold', applied.includes(j.t) ? 'bg-success-50 text-success' : 'bg-navy text-white')}
                >
                  {applied.includes(j.t) ? 'Applied' : 'Apply'}
                </button>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </MobileShell>
  )
}
