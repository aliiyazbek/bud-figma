import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Pause, Play, X } from 'lucide-react'
import { storyScript, storyTotal } from './storyScript'
import type { DemoAction } from '../state/DemoContext'
import type { ScreenCode } from '../state/NavContext'

interface Props {
  dispatch: (a: DemoAction) => void
  go: (s: ScreenCode) => void
  onExit: () => void
  captions: boolean
  cursor: boolean
  present: boolean
}

export default function StoryPlayer({ dispatch, go, onExit, captions, cursor, present }: Props) {
  const [idx, setIdx] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [done, setDone] = useState(false)
  const [hl, setHl] = useState<string | null>(null)
  const elapsed = useRef(0)
  const fired = useRef(new Set<number>())
  const hlUntil = useRef(0)
  const idxRef = useRef(0)
  const [progress, setProgress] = useState(0)

  const startStep = useCallback(
    (i: number, fastForward: boolean) => {
      if (fastForward) {
        dispatch({ type: 'reset' })
        const apply = (j: number) => storyScript[j].beats?.forEach((b) => b.action && dispatch(b.action))
        for (let j = 0; j < i - 1; j++) apply(j)
        dispatch({ type: 'markAllBannersShown' })
        if (i > 0) apply(i - 1)
      }
      go(storyScript[i].screen)
      elapsed.current = 0
      fired.current = new Set()
      hlUntil.current = 0
      idxRef.current = i
      setHl(null)
      setIdx(i)
      setDone(false)
    },
    [dispatch, go],
  )

  // Always begin from a clean reset.
  useEffect(() => {
    startStep(0, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!playing || done) return
    let raf = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100)
      last = now
      elapsed.current += dt
      const i = idxRef.current
      const step = storyScript[i]
      step.beats?.forEach((b, k) => {
        if (fired.current.has(k) || elapsed.current < b.at) return
        fired.current.add(k)
        if (b.highlight) {
          setHl(b.highlight)
          hlUntil.current = elapsed.current + 1300
        }
        if (b.action) dispatch(b.action)
      })
      if (hlUntil.current && elapsed.current > hlUntil.current) {
        hlUntil.current = 0
        setHl(null)
      }
      const before = storyScript.slice(0, i).reduce((n, s) => n + s.duration, 0)
      setProgress(Math.min(1, (before + elapsed.current) / storyTotal))
      if (elapsed.current >= step.duration) {
        if (i < storyScript.length - 1) startStep(i + 1, false)
        else {
          setDone(true)
          setHl(null)
          return
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [playing, done, dispatch, startStep])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault()
        if (done) {
          startStep(0, true)
          setPlaying(true)
        } else setPlaying((p) => !p)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        startStep(Math.min(idxRef.current + 1, storyScript.length - 1), true)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        startStep(Math.max(idxRef.current - 1, 0), true)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        onExit()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [done, startStep, onExit])

  const step = storyScript[idx]
  return (
    <>
      {cursor && hl && <Highlight id={hl} />}
      {!present && (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-[90] h-[3px] bg-white/10">
          <div className="h-full bg-crimson-400" style={{ width: `${progress * 100}%` }} />
        </div>
      )}
      {captions && (
        <div className="pointer-events-none fixed inset-x-0 bottom-8 z-[90] flex justify-center px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="max-w-3xl rounded-2xl bg-navy-950/85 px-6 py-3.5 text-center text-lg font-medium text-white shadow-float ring-1 ring-white/10 backdrop-blur"
            >
              {step.caption}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {!present && (
        <div className="fixed bottom-6 left-6 z-[90] flex items-center gap-3 rounded-xl bg-black/60 px-3 py-2 text-xs text-white/70 ring-1 ring-white/10">
          <button onClick={() => (done ? (startStep(0, true), setPlaying(true)) : setPlaying((p) => !p))} className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20" aria-label={playing && !done ? 'Pause story' : 'Play story'}>
            {playing && !done ? <Pause size={14} /> : <Play size={14} />}
          </button>
          <span className="tabular-nums">
            Step {idx + 1}/{storyScript.length} · {step.screen}
          </span>
          <span className="text-white/40">{done ? 'Complete · Space to replay' : 'Space pause · ←/→ step · Esc exit'}</span>
          <button onClick={onExit} className="flex h-7 items-center gap-1 rounded-lg bg-white px-2.5 font-semibold text-navy-950 hover:bg-mist">
            <X size={13} /> Exit
          </button>
        </div>
      )}
    </>
  )
}

function Highlight({ id }: { id: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null)
  useEffect(() => {
    let raf = 0
    const loop = () => {
      const el = document.querySelector(`[data-story="${id}"]`)
      setRect(el ? el.getBoundingClientRect() : null)
      raf = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(raf)
  }, [id])
  if (!rect || rect.width === 0) return null
  const pad = 6
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, scale: 1.08 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="pointer-events-none fixed z-[95] rounded-2xl border-2 border-crimson-400 shadow-[0_0_0_6px_rgb(165_31_43/0.18)]"
      style={{ left: rect.left - pad, top: rect.top - pad, width: rect.width + pad * 2, height: rect.height + pad * 2 }}
    >
      <span className="absolute top-1/2 left-1/2 -mt-4 -ml-4 h-8 w-8">
        <span className="absolute inset-0 animate-pulse-ring rounded-full bg-crimson-400/60" />
        <span className="absolute inset-2 rounded-full border-2 border-white bg-crimson-400 shadow" />
      </span>
    </motion.div>
  )
}
