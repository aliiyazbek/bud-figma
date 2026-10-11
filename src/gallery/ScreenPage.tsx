import { ChevronLeft, ChevronRight, Maximize2, Monitor, Smartphone } from 'lucide-react'
import { motion } from 'motion/react'
import { screens, type ScreenDef } from '../screens/registry'
import type { ScreenCode } from '../state/NavContext'
import Stage from '../components/Stage'
import { PhoneFrame } from '../components/mobile'
import { RequirementsSection } from './Requirements'
import { FrameToggle, type Frame } from './controls'

/** One screen as a regular, scrolling page: title, the screen itself, then its requirements. */
export default function ScreenPage({
  def,
  frame,
  onFrame,
  onPick,
  onFullscreen,
}: {
  def: ScreenDef
  frame: Frame
  onFrame: (f: Frame) => void
  onPick: (code: ScreenCode) => void
  onFullscreen: () => void
}) {
  const i = screens.findIndex((s) => s.code === def.code)
  const prev = screens[(i - 1 + screens.length) % screens.length]
  const next = screens[(i + 1) % screens.length]
  const mobile = def.kind === 'mobile'
  const Screen = def.Component

  return (
    <motion.article key={def.code} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-white/40 uppercase">
            {mobile ? <Smartphone size={13} /> : <Monitor size={13} />}
            {mobile ? 'Mobile app · 390×844' : 'Web portal · 1920×1080'} · {def.audience} · Screen {String(i + 1).padStart(2, '0')} / {screens.length}
          </div>
          <h1 className="mt-2 flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-[34px] font-bold tracking-tight tabular-nums">{def.code}</span>
            <span className="font-display text-[24px] font-semibold text-white/90">{def.name}</span>
          </h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-white/60">{def.purpose}</p>
        </div>
        <div className="flex items-center gap-2">
          {mobile && <FrameToggle frame={frame} onChange={onFrame} />}
          <button
            onClick={onFullscreen}
            className="flex h-9 items-center gap-2 rounded-lg bg-white/[0.06] px-3 text-sm font-medium text-white/80 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
          >
            <Maximize2 size={14} /> Full screen
          </button>
        </div>
      </header>

      {mobile ? (
        <div className="mt-8 flex flex-wrap items-start gap-10">
          <div className="mx-auto shrink-0 sm:mx-0">
            {frame === 'device' ? (
              <PhoneFrame>
                <Screen />
              </PhoneFrame>
            ) : (
              <div className="overflow-hidden rounded-3xl shadow-float">
                <Screen />
              </div>
            )}
          </div>
          <RequirementsSection reqs={def.reqs} columns="2xl:grid-cols-2" className="min-w-[320px] flex-1" />
        </div>
      ) : (
        <>
          <div className="mt-8 overflow-hidden rounded-xl shadow-float ring-1 ring-white/10">
            <Stage width={1920} height={1080} padding={0} fit="width">
              <Screen />
            </Stage>
          </div>
          <RequirementsSection reqs={def.reqs} columns="lg:grid-cols-2 2xl:grid-cols-3" className="mt-10" />
        </>
      )}

      <nav aria-label="Previous and next screen" className="mt-12 grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-6">
        <button onClick={() => onPick(prev.code)} className="rounded-2xl p-4 text-left ring-1 ring-white/10 hover:bg-white/[0.04]">
          <span className="flex items-center gap-1 text-xs text-white/40">
            <ChevronLeft size={14} /> Previous
          </span>
          <span className="mt-1 block font-semibold">
            <span className="text-sky">{prev.code}</span> {prev.name}
          </span>
        </button>
        <button onClick={() => onPick(next.code)} className="rounded-2xl p-4 text-right ring-1 ring-white/10 hover:bg-white/[0.04]">
          <span className="flex items-center justify-end gap-1 text-xs text-white/40">
            Next <ChevronRight size={14} />
          </span>
          <span className="mt-1 block font-semibold">
            <span className="text-sky">{next.code}</span> {next.name}
          </span>
        </button>
      </nav>
    </motion.article>
  )
}
