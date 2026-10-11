import { FileText, CheckCircle2, Circle, Loader2, Eye, IdCard, ScrollText, FlaskConical } from 'lucide-react'
import { motion } from 'motion/react'
import { MobileShell, MobileHeader } from '../../components/mobile'
import { Reveal, Badge, Button, Dialog, Logo, cx } from '../../components/ui'
import { useDemo } from '../../state/DemoContext'
import { student, SEMESTER } from '../../data/demo'

export default function M08() {
  const { state, dispatch } = useDemo()
  const t = state.transcript
  const steps = [
    { l: 'Request submitted', d: 'Today, 09:38', done: t !== 'none' },
    { l: 'Processing by Registrar', d: t === 'ready' ? 'Completed 09:39' : t === 'processing' ? 'In progress' : '—', done: t === 'ready', current: t === 'processing' },
    { l: 'Ready to download', d: t === 'ready' ? 'Today, 09:39' : '—', done: t === 'ready' },
  ]
  return (
    <MobileShell
      overlay={
        <Dialog open={state.dialog === 'transcript'} onClose={() => dispatch({ type: 'closeDialog' })} title="Transcript preview" width="w-[360px]" story="transcript-preview">
          <div className="relative overflow-hidden rounded-xl border border-line bg-white p-4">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <Logo className="h-10" padded={false} />
              <div className="text-right text-[10px] text-subtle">
                DOC-3391
                <div>13 Sep 2026</div>
              </div>
            </div>
            <div className="mt-3 text-[12px] font-bold tracking-wider text-navy uppercase">Academic Transcript</div>
            <div className="mt-1 text-[11px] text-muted">
              {student.name} · {student.id} · {student.program}
            </div>
            <div className="mt-3 space-y-1.5 text-[11px]">
              {[
                ['Spring 2026', '15 cr', '3.68'],
                ['Fall 2025', '18 cr', '3.55'],
                ['Spring 2025', '15 cr', '3.61'],
                ['Fall 2024', '15 cr', '3.59'],
              ].map((r) => (
                <div key={r[0]} className="flex justify-between border-b border-dashed border-line pb-1.5">
                  <span>{r[0]}</span>
                  <span className="text-muted">{r[1]}</span>
                  <span className="font-semibold tabular-nums">{r[2]}</span>
                </div>
              ))}
              <div className="flex justify-between pt-1 font-bold">
                <span>Cumulative GPA</span>
                <span className="tabular-nums">{student.gpa.toFixed(2)}</span>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <span className="rotate-[-24deg] rounded-md border-2 border-crimson/40 px-3 py-1 text-center text-[13px] font-bold tracking-wider text-crimson/45 uppercase">
                Demo — not an official document
              </span>
            </div>
          </div>
        </Dialog>
      }
    >
      <MobileHeader title="Documents & Requests" subtitle={`Registrar services · ${SEMESTER}`} />
      <div className="space-y-4 px-4 pb-6">
        <Reveal>
          <div className="rounded-[24px] bg-white p-5 ring-1 ring-line">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
                <FileText size={20} />
              </span>
              <div className="flex-1">
                <div className="text-[16px] font-bold">Academic transcript</div>
                <div className="text-[12.5px] text-muted">All terms · digitally verified</div>
              </div>
              {t !== 'none' && <Badge tone={t === 'ready' ? 'success' : 'warning'}>{t === 'ready' ? 'Ready' : 'Processing'}</Badge>}
            </div>

            {t === 'none' ? (
              <Button size="lg" className="mt-5 w-full" story="request-transcript" onClick={() => dispatch({ type: 'requestTranscript' })}>
                Request transcript
              </Button>
            ) : (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="overflow-hidden">
                <div className="mt-4 text-[11.5px] font-medium text-subtle">Request DOC-3391</div>
                <div className="mt-3">
                  {steps.map((s, i) => (
                    <div key={s.l} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        {s.done ? (
                          <CheckCircle2 size={19} className="text-success" />
                        ) : s.current ? (
                          <Loader2 size={19} className="animate-spin text-warning" />
                        ) : (
                          <Circle size={19} className="text-line" />
                        )}
                        {i < steps.length - 1 && <span className={cx('my-1 h-5 w-px', s.done ? 'bg-success/40' : 'bg-line')} />}
                      </div>
                      <div className="pb-2">
                        <div className={cx('text-[13.5px] font-semibold', !s.done && !s.current && 'text-subtle')}>{s.l}</div>
                        <div className="text-[11.5px] text-muted">{s.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {t === 'processing' && (
                  <Button variant="secondary" size="md" className="mt-2 w-full" story="simulate" onClick={() => dispatch({ type: 'markTranscriptReady' })}>
                    <FlaskConical size={15} /> Simulate processing (demo)
                  </Button>
                )}
                {t === 'ready' && (
                  <Button size="lg" className="mt-2 w-full" story="preview-transcript" onClick={() => dispatch({ type: 'openDialog', dialog: 'transcript' })}>
                    <Eye size={16} /> Preview document
                  </Button>
                )}
              </motion.div>
            )}
          </div>
        </Reveal>

        <Reveal i={1}>
          <div className="px-1 text-[13px] font-semibold text-subtle">Other requests</div>
          <div className="mt-2 space-y-2">
            {[
              { icon: ScrollText, l: 'Enrollment certificate', d: 'Usually ready in 1 working day' },
              { icon: IdCard, l: 'Student ID replacement', d: 'Collect from Student Center' },
              { icon: FileText, l: 'Graduation expectation letter', d: 'Requires advisor approval' },
            ].map((r) => (
              <div key={r.l} className="flex items-center gap-3 rounded-2xl bg-white p-3.5 ring-1 ring-line">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-50 text-navy">
                  <r.icon size={17} />
                </span>
                <span className="flex-1">
                  <span className="block text-[13.5px] font-semibold">{r.l}</span>
                  <span className="block text-[11.5px] text-muted">{r.d}</span>
                </span>
                <Badge>Available</Badge>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="px-2 text-center text-[11px] leading-snug text-subtle">Documents in this prototype are demo previews and carry no official value.</div>
      </div>
    </MobileShell>
  )
}
