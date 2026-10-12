import { useState } from 'react'
import { AdminShell } from '../../components/shells'
import { Card, CardHeader, Reveal, Badge, Button, Avatar, cx } from '../../components/ui'
import { CheckCircle2, XCircle, FileSignature, Paperclip, Send, ArrowLeft, ShieldCheck, FileText, Undo2 } from 'lucide-react'
import { useToast } from '../../components/toast'
import { useNav } from '../../state/NavContext'

type Note = { who: string; text: string; mine?: boolean; time: string }

const docs = [
  { name: 'Exemption form', size: '214 KB' },
  { name: 'Prior transcript', size: '1.2 MB' },
]

export default function W09() {
  const toast = useToast()
  const { go } = useNav()
  const [doc, setDoc] = useState(0)
  const [draft, setDraft] = useState('')
  const [decision, setDecision] = useState<null | 'approved' | 'rejected'>(null)
  const [notes, setNotes] = useState<Note[]>([
    { who: 'System check', text: 'Attachment received. Course code CS-101 flagged as a possible equivalent to ENG-101.', time: '09:13' },
    { who: 'You', text: 'Meets policy. Forwarding to the academic advisor for sign-off.', mine: true, time: '09:20' },
  ])

  const send = () => {
    if (!draft.trim()) return
    setNotes(n => [...n, { who: 'You', text: draft.trim(), mine: true, time: 'Now' }])
    setDraft('')
  }

  return (
    <AdminShell
      title="File Review"
      crumb="Workflow & Requests / REQ-2026-081"
      user={{ name: 'Tarek Haddad', role: 'Student Affairs Officer', initials: 'TH' }}
      actions={
        <Button variant="secondary" onClick={() => go('W08')}>
          <ArrowLeft size={16} /> Back to inbox
        </Button>
      }
    >
      <div className="grid grid-cols-[1fr_380px] gap-6">
        <Reveal>
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy">
                  <FileSignature size={20} />
                </div>
                <div>
                  <div className="font-semibold text-ink">Course Exemption Request</div>
                  <div className="text-xs text-muted">REQ-2026-081 · Submitted today, 09:12</div>
                </div>
              </div>
              <div className="flex gap-1 rounded-xl bg-ivory p-1 text-xs font-semibold">
                {docs.map((d, i) => (
                  <button
                    key={d.name}
                    onClick={() => setDoc(i)}
                    className={cx('flex items-center gap-1.5 rounded-lg px-3 py-1.5', doc === i ? 'bg-white text-navy shadow-card' : 'text-muted hover:text-navy')}
                  >
                    <FileText size={13} /> {d.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[linear-gradient(180deg,var(--color-ivory),var(--color-navy-50))] p-10">
              <div className="relative mx-auto max-w-2xl rounded-sm bg-white p-12 shadow-[0_20px_50px_-20px_rgb(16_41_69/0.35)] ring-1 ring-black/5">
                {decision && (
                  <div
                    className={cx(
                      'absolute top-10 right-10 rotate-[-8deg] rounded-lg border-[3px] px-4 py-1 font-display text-lg font-black tracking-widest uppercase',
                      decision === 'approved' ? 'border-success text-success' : 'border-crimson text-crimson',
                    )}
                  >
                    {decision}
                  </div>
                )}
                {doc === 0 ? (
                  <>
                    <div className="border-b-2 border-navy pb-4 text-center">
                      <div className="font-display text-lg font-bold tracking-wider text-navy uppercase">British University in Damascus</div>
                      <div className="mt-1 text-[11px] font-semibold tracking-[0.25em] text-subtle uppercase">Student Affairs</div>
                    </div>
                    <div className="mt-8 text-center font-display text-base font-bold text-ink">Course Exemption Request</div>
                    <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                      {[
                        ['Student name', 'Maya Al-Safi'],
                        ['Student ID', '20260492'],
                        ['Faculty', 'Engineering'],
                        ['Academic year', '2026/2027'],
                      ].map(([k, v]) => (
                        <div key={k} className="border-b border-dashed border-line pb-2">
                          <dt className="text-[11px] tracking-wider text-subtle uppercase">{k}</dt>
                          <dd className="font-medium text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-6 rounded-lg bg-ivory p-4 text-sm">
                      <div className="text-[11px] tracking-wider text-subtle uppercase">Requested course</div>
                      <div className="mt-1 font-medium text-ink">ENG-101 · Introduction to Engineering (3 credits)</div>
                      <div className="mt-4 text-[11px] tracking-wider text-subtle uppercase">Justification</div>
                      <div className="mt-1 leading-relaxed text-muted">
                        Completed an equivalent course (CS-101) at a previous institution with a grade of 85%. Transcript attached.
                      </div>
                    </div>
                    <div className="mt-12 grid grid-cols-3 gap-6 text-center text-xs text-subtle">
                      {['Student', 'Academic advisor', 'Dean'].map(s => (
                        <div key={s} className="border-t border-line pt-2">{s}</div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="font-display text-base font-bold text-ink">Academic Transcript (attachment)</div>
                    <div className="text-xs text-muted">Sample preview, not a real record</div>
                    <table className="mt-4 w-full text-sm">
                      <tbody className="divide-y divide-line">
                        {[['CS-101', 'Intro to Computing', '85'], ['MA-102', 'Calculus I', '78'], ['PH-101', 'Physics I', '81']].map(r => (
                          <tr key={r[0]} className={r[0] === 'CS-101' ? 'bg-warning-50' : ''}>
                            <td className="py-2 font-mono text-xs">{r[0]}</td>
                            <td className="py-2">{r[1]}</td>
                            <td className="py-2 text-right font-semibold">{r[2]}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-line px-6 py-3 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <Paperclip size={13} /> {docs[doc].name} · {docs[doc].size}
              </span>
              <span>Page 1 of 1</span>
            </div>
          </Card>
        </Reveal>

        <div className="flex flex-col gap-6">
          <Reveal i={1}>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <Avatar initials="MA" tone="navy" />
                <div className="flex-1">
                  <div className="font-semibold text-ink">Maya Al-Safi</div>
                  <div className="text-xs text-muted">Engineering · Year 1 · ID 20260492</div>
                </div>
                <Badge tone="success">Active</Badge>
              </div>
              <div className="mt-5 space-y-2.5">
                {['Identity verified', 'Enrolled this term', 'No outstanding holds'].map(c => (
                  <div key={c} className="flex items-center gap-2 text-sm text-ink">
                    <ShieldCheck size={15} className="text-success" /> {c}
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          <Reveal i={2}>
            <Card className="flex flex-col p-6">
              <CardHeader title="Internal notes" subtitle="Visible to staff only" />
              <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
                {notes.map((n, i) => (
                  <div key={i} className={cx('rounded-2xl p-3 text-sm', n.mine ? 'ml-6 rounded-tr-sm bg-navy text-white' : 'mr-6 rounded-tl-sm bg-ivory text-ink')}>
                    <div className={cx('flex justify-between text-[11px] font-semibold', n.mine ? 'text-white/60' : 'text-subtle')}>
                      <span>{n.who}</span>
                      <span>{n.time}</span>
                    </div>
                    <div className="mt-1 leading-relaxed">{n.text}</div>
                  </div>
                ))}
              </div>
              <form
                className="mt-4 flex gap-2"
                onSubmit={e => {
                  e.preventDefault()
                  send()
                }}
              >
                <input
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  placeholder="Add a note…"
                  className="h-10 w-full rounded-xl border border-line bg-ivory px-3 text-sm outline-none focus:border-navy/40"
                />
                <Button type="submit" variant="primary" className="w-10 shrink-0 px-0" aria-label="Send note">
                  <Send size={15} />
                </Button>
              </form>
            </Card>
          </Reveal>

          <Reveal i={3}>
            <Card className="p-6">
              <CardHeader title="Decision" subtitle="Approving forwards the file to the next step" />
              {decision ? (
                <div className="mt-4 space-y-3">
                  <div className={cx('rounded-xl p-4 text-sm font-medium', decision === 'approved' ? 'bg-success-50 text-success' : 'bg-crimson-50 text-crimson')}>
                    {decision === 'approved' ? 'Approved and forwarded to Academic Review.' : 'Rejected. The student will be notified.'}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="ghost" onClick={() => setDecision(null)}>
                      <Undo2 size={15} /> Undo
                    </Button>
                    <Button variant="primary" onClick={() => go('W10')}>
                      Track routing
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    className="text-crimson hover:border-crimson/30 hover:bg-crimson-50"
                    onClick={() => {
                      setDecision('rejected')
                      toast('Request rejected.', 'info')
                    }}
                  >
                    <XCircle size={16} /> Reject
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setDecision('approved')
                      toast('Approved and forwarded.', 'success')
                    }}
                  >
                    <CheckCircle2 size={16} /> Approve
                  </Button>
                </div>
              )}
            </Card>
          </Reveal>
        </div>
      </div>
    </AdminShell>
  )
}
