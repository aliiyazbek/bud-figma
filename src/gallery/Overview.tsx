import { ArrowRight, Monitor, Smartphone } from 'lucide-react'
import { motion } from 'motion/react'
import { screens, type ScreenDef } from '../screens/registry'
import type { ScreenCode } from '../state/NavContext'
import { proposalModules, proposalReqs } from '../data/proposal'
import { PriorityDots, PriorityLegend } from './Requirements'
import { cx } from '../components/ui'

// requirement id -> screens that express it
const screensByReq = new Map<string, ScreenCode[]>()
for (const s of screens) for (const r of s.reqs) screensByReq.set(r.id, [...(screensByReq.get(r.id) ?? []), s.code])

const coverage = proposalModules.map((m) => {
  const reqs = proposalReqs.filter((r) => r.module === m.code)
  const covered = reqs.filter((r) => screensByReq.has(r.id))
  const onScreens = [...new Set(covered.flatMap((r) => screensByReq.get(r.id)!))]
  return { ...m, total: reqs.length, covered: covered.length, screens: screens.filter((s) => onScreens.includes(s.code)) }
})

const groups = [
  { title: 'Web portal', note: 'Presidency, faculty and central offices · 1920×1080', icon: Monitor, items: screens.filter((s) => s.kind === 'web') },
  { title: 'Mobile app', note: 'Student app · 390×844', icon: Smartphone, items: screens.filter((s) => s.kind === 'mobile') },
]

function ScreenCard({ s, i, onPick }: { s: ScreenDef; i: number; onPick: (c: ScreenCode) => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.03 * i, duration: 0.3 }}
      onClick={() => onPick(s.code)}
      className="group flex flex-col rounded-2xl bg-white/[0.035] p-5 text-left ring-1 ring-white/[0.08] transition-colors hover:bg-white/[0.06] hover:ring-white/20 focus-visible:outline-2 focus-visible:outline-crimson-400"
    >
      <span className="flex items-center justify-between gap-3">
        <span className="font-mono text-[13px] font-semibold text-sky">{s.code}</span>
        <span className="text-[11.5px] text-white/40">{s.audience}</span>
      </span>
      <span className="mt-2 text-[16px] font-semibold">{s.name}</span>
      <span className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-white/55">{s.purpose}</span>
      <span className="mt-auto flex items-center gap-3 pt-4 text-[12px] text-white/50">
        <span className="font-semibold text-white/75">{s.reqs.length} requirements</span>
        <PriorityDots reqs={s.reqs} />
        <ArrowRight size={15} className="ml-auto text-white/40 opacity-0 transition-opacity group-hover:opacity-100" />
      </span>
    </motion.button>
  )
}

export default function Overview({ onPick }: { onPick: (c: ScreenCode) => void }) {
  const linked = screensByReq.size
  const modulesTouched = coverage.filter((m) => m.covered > 0).length
  const stats = [
    { value: screens.length, label: 'Screens' },
    { value: groups[0].items.length, label: 'Web portal' },
    { value: groups[1].items.length, label: 'Mobile app' },
    { value: linked, label: `Requirements linked · ${modulesTouched} of ${proposalModules.length} modules` },
  ]

  return (
    <div>
      <section>
        <div className="text-[11px] font-semibold tracking-[0.14em] text-white/40 uppercase">Graduation project · BUD Integrated University Management System</div>
        <h1 className="font-display mt-2 text-[40px] leading-tight font-bold tracking-tight">BUD Digital Campus</h1>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-white/60">
          Interface gallery for the proposal: every screen of the web portal and the student mobile app, each linked to the functional requirements it
          expresses from Appendix A. Pick a screen below or from the menu. All data is fictional.
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-white/[0.035] px-5 py-4 ring-1 ring-white/[0.08]">
              <dt className="text-[12.5px] text-white/50">{s.label}</dt>
              <dd className="font-display mt-1 text-[28px] font-bold tabular-nums">{s.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {groups.map((g, gi) => (
        <section key={g.title} className="mt-12" aria-labelledby={`group-${gi}`}>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 id={`group-${gi}`} className="flex items-center gap-2 text-[19px] font-semibold">
              <g.icon size={18} className="text-white/50" /> {g.title}
            </h2>
            <span className="text-[13px] text-white/40">{g.note}</span>
            {gi === 0 && (
              <span className="ml-auto flex items-center gap-2 text-[12px] text-white/40">
                Requirements by priority <PriorityLegend />
              </span>
            )}
          </div>
          <div className={cx('mt-4 grid gap-4', g.items[0]?.kind === 'web' ? 'md:grid-cols-2 2xl:grid-cols-3' : 'sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4')}>
            {g.items.map((s, i) => (
              <ScreenCard key={s.code} s={s} i={i} onPick={onPick} />
            ))}
          </div>
        </section>
      ))}

      <section className="mt-14" aria-labelledby="coverage-title">
        <h2 id="coverage-title" className="text-[19px] font-semibold">Requirements coverage by module</h2>
        <p className="mt-1 text-[13px] text-white/50">
          How many of each module&apos;s functional requirements (Appendix A, {proposalReqs.length} in total) appear on at least one screen.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl ring-1 ring-white/[0.08]">
          <table className="w-full min-w-[760px] text-left text-[13px]">
            <thead className="bg-white/[0.04] text-[11px] tracking-[0.1em] text-white/45 uppercase">
              <tr>
                <th className="w-12 px-4 py-3 font-semibold">#</th>
                <th className="px-4 py-3 font-semibold">Module</th>
                <th className="w-56 px-4 py-3 font-semibold">Covered</th>
                <th className="px-4 py-3 font-semibold">Screens</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {coverage.map((m) => (
                <tr key={m.code} className={cx(m.covered === 0 && 'text-white/40')}>
                  <td className="px-4 py-2.5 tabular-nums">{m.no}</td>
                  <td className="px-4 py-2.5">
                    <span className="font-medium">{m.en}</span>
                    <span dir="rtl" lang="ar" className="font-arabic ml-2 text-white/45">
                      {m.ar}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-3">
                      <span className="w-14 shrink-0 tabular-nums">
                        {m.covered} / {m.total}
                      </span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                        <span className="block h-full rounded-full bg-sky" style={{ width: `${(m.covered / m.total) * 100}%` }} />
                      </span>
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <span className="flex flex-wrap gap-1.5">
                      {m.screens.map((s) => (
                        <button
                          key={s.code}
                          onClick={() => onPick(s.code)}
                          title={s.name}
                          className="rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-sky ring-1 ring-white/10 hover:bg-white/[0.12]"
                        >
                          {s.code}
                        </button>
                      ))}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
