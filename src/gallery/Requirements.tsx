import { FileText } from 'lucide-react'
import type { Req } from '../data/requirements'
import { reqById, moduleByCode, priorityLabel, type Priority } from '../data/proposal'
import { cx } from '../components/ui'

const priorities: Priority[] = ['essential', 'important', 'later']

const tone: Record<Priority, { badge: string; dot: string }> = {
  essential: { badge: 'bg-crimson/20 text-crimson-400 ring-crimson-400/30', dot: 'bg-crimson-400' },
  important: { badge: 'bg-warning-400/10 text-warning-400 ring-warning-400/25', dot: 'bg-warning-400' },
  later: { badge: 'bg-sky/10 text-sky ring-sky/25', dot: 'bg-sky' },
}

export function countByPriority(reqs: Req[]) {
  const counts: Record<Priority, number> = { essential: 0, important: 0, later: 0 }
  for (const r of reqs) {
    const p = reqById[r.id]?.priority
    if (p) counts[p]++
  }
  return counts
}

export function PriorityBadge({ priority, count }: { priority: Priority; count?: number }) {
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ring-1', tone[priority].badge)}>
      {count !== undefined && <span className="tabular-nums">{count}</span>}
      {priorityLabel[priority].en}
      <span className="font-arabic font-medium opacity-80">{priorityLabel[priority].ar}</span>
    </span>
  )
}

/** Compact "● 2 ● 3 ● 1" summary of a screen's requirements by priority. */
export function PriorityDots({ reqs }: { reqs: Req[] }) {
  const counts = countByPriority(reqs)
  return (
    <span className="flex items-center gap-2.5" aria-label={priorities.map((p) => `${counts[p]} ${priorityLabel[p].en}`).join(', ')}>
      {priorities.map(
        (p) =>
          counts[p] > 0 && (
            <span key={p} className="flex items-center gap-1 tabular-nums" title={priorityLabel[p].en}>
              <span className={cx('h-1.5 w-1.5 rounded-full', tone[p].dot)} />
              {counts[p]}
            </span>
          ),
      )}
    </span>
  )
}

export function PriorityLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {priorities.map((p) => (
        <PriorityBadge key={p} priority={p} />
      ))}
    </div>
  )
}

function RequirementCard({ req }: { req: Req }) {
  const source = reqById[req.id]
  const module = source && moduleByCode[source.module]
  return (
    <li className="flex flex-col rounded-2xl bg-white/[0.04] p-4 ring-1 ring-white/[0.07]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-white/[0.07] px-1.5 py-0.5 font-mono text-[11px] font-semibold text-sky ring-1 ring-white/10">{req.id}</span>
        {source && <PriorityBadge priority={source.priority} />}
        {module && (
          <span dir="rtl" lang="ar" title={`Module ${module.no} · ${module.en}`} className="font-arabic ml-auto text-[12px] text-white/40">
            {module.no}. {module.ar}
          </span>
        )}
      </div>
      <div className="mt-2.5 text-[14px] font-semibold text-white/90">{req.title}</div>
      {source && (
        <p dir="rtl" lang="ar" className="font-arabic mt-1.5 text-[14.5px] leading-7 text-white/70">
          {source.text}
        </p>
      )}
    </li>
  )
}

/** The proposal requirements (Appendix A) a screen expresses, with their original Arabic text. */
export function RequirementsSection({ reqs, columns, className }: { reqs: Req[]; columns?: string; className?: string }) {
  const counts = countByPriority(reqs)
  return (
    <section className={className} aria-labelledby="reqs-title">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="reqs-title" className="flex items-center gap-2 text-[17px] font-semibold">
            <FileText size={17} className="text-white/50" /> Requirements from the proposal
            <span className="rounded-full bg-crimson/20 px-2 py-0.5 text-[11px] font-bold text-crimson-400 tabular-nums">{reqs.length}</span>
          </h2>
          <p className="mt-1 text-[13px] text-white/50">
            Functional requirements this screen expresses. Text and priority are quoted from Appendix A of the proposal (
            <span className="font-arabic">الملحق أ</span>).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {priorities.map((p) => counts[p] > 0 && <PriorityBadge key={p} priority={p} count={counts[p]} />)}
        </div>
      </div>
      <ol className={cx('mt-4 grid gap-3', columns)}>
        {reqs.map((r) => (
          <RequirementCard key={r.id} req={r} />
        ))}
      </ol>
    </section>
  )
}
