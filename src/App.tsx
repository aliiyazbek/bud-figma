import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { ChevronLeft, ChevronRight, PanelLeft, X } from 'lucide-react'
import { DemoProvider, useDemo } from './state/DemoContext'
import { NavProvider, type ScreenCode } from './state/NavContext'
import { screens, screenByCode, isScreenCode, type ScreenDef } from './screens/registry'
import Stage from './components/Stage'
import { PhoneFrame } from './components/mobile'
import { cx } from './components/ui'
import StoryPlayer from './story/StoryPlayer'
import { storyScript } from './story/storyScript'
import { ToastProvider } from './components/toast'
import Sidebar from './gallery/Sidebar'
import Overview from './gallery/Overview'
import ScreenPage from './gallery/ScreenPage'
import { ToolButton, type Frame } from './gallery/controls'

/** `site` is the regular scrolling website; `fullscreen` and `story` show one screen fitted to the window. */
type Mode = 'site' | 'fullscreen' | 'story'

function readParams() {
  const p = new URLSearchParams(window.location.search)
  const s = p.get('screen')
  const story = p.get('story') === '1'
  const screen = isScreenCode(s) ? s : story ? storyScript[0].screen : null
  return {
    screen,
    mode: (story ? 'story' : screen && p.get('present') === '1' ? 'fullscreen' : 'site') as Mode,
    // `?story=1&present=1` plays the story without any controls, for screen recording
    bareStory: story && p.get('present') === '1',
    frame: (p.get('frame') === 'clean' ? 'clean' : 'device') as Frame,
    captions: p.get('captions') !== '0',
    cursor: p.get('cursor') !== '0',
  }
}

const SIDEBAR_BREAKPOINT = 1024

function Gallery() {
  const initial = useMemo(readParams, [])
  const { state, dispatch } = useDemo()
  const [screen, setScreen] = useState<ScreenCode | null>(initial.screen)
  const [mode, setMode] = useState<Mode>(initial.mode)
  const [bareStory, setBareStory] = useState(initial.bareStory)
  const [frame, setFrame] = useState<Frame>(initial.frame)
  const [storyKey, setStoryKey] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= SIDEBAR_BREAKPOINT + 76)

  const go = useCallback(
    (s: ScreenCode) => {
      dispatch({ type: 'closeDialog' })
      setScreen(s)
    },
    [dispatch],
  )
  const pick = (s: ScreenCode) => {
    go(s)
    if (window.innerWidth < SIDEBAR_BREAKPOINT) setSidebarOpen(false)
  }
  const showOverview = () => {
    dispatch({ type: 'closeDialog' })
    setScreen(null)
  }

  const def: ScreenDef | null = screen ? screenByCode[screen] : null
  const step = (d: number) => {
    const i = screen ? screens.findIndex((s) => s.code === screen) : d > 0 ? -1 : 0
    go(screens[(i + d + screens.length) % screens.length].code)
  }

  // keep URL in sync for direct links
  useEffect(() => {
    const u = new URL(window.location.href)
    screen ? u.searchParams.set('screen', screen) : u.searchParams.delete('screen')
    mode === 'fullscreen' || (mode === 'story' && bareStory) ? u.searchParams.set('present', '1') : u.searchParams.delete('present')
    mode === 'story' ? u.searchParams.set('story', '1') : u.searchParams.delete('story')
    frame === 'clean' ? u.searchParams.set('frame', 'clean') : u.searchParams.delete('frame')
    window.history.replaceState(null, '', u)
  }, [screen, mode, bareStory, frame])

  useEffect(() => {
    document.title = def ? `${def.code} · ${def.name} — BUD Digital Campus` : 'BUD Digital Campus — Interface gallery'
  }, [def])

  // New page starts at the top. A stable scrollbar gutter keeps the page width — and so the
  // scale of web screens — from jumping; the fitted modes don't scroll at all.
  useLayoutEffect(() => {
    if (mode === 'site') window.scrollTo(0, 0)
  }, [screen, mode])
  useEffect(() => {
    const root = document.documentElement
    root.style.overflow = mode === 'site' ? '' : 'hidden'
    root.style.setProperty('scrollbar-gutter', mode === 'site' ? 'stable' : 'auto')
  }, [mode])

  // keyboard navigation (story mode has its own controls)
  useEffect(() => {
    if (mode === 'story') return
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (state.dialog || e.altKey || e.ctrlKey || e.metaKey) return
      if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
      else if (e.key === 'Escape' && mode === 'fullscreen') setMode('site')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const startStory = () => {
    go(storyScript[0].screen)
    setBareStory(false)
    setStoryKey((k) => k + 1)
    setMode('story')
  }
  const exitStory = useCallback(() => {
    setBareStory(false)
    setMode('site')
  }, [])

  if (mode !== 'site' && def) {
    const mobile = def.kind === 'mobile'
    const w = mobile ? (frame === 'device' ? 420 : 390) : 1920
    const h = mobile ? (frame === 'device' ? 874 : 844) : 1080
    const bare = mode === 'fullscreen' || bareStory
    const Screen = def.Component
    return (
      <NavProvider screen={def.code} go={go}>
        <div className={cx('fixed inset-0 text-white', mobile ? 'bg-gradient-to-br from-navy-850 via-navy-950 to-black' : 'bg-gallery')}>
          <Stage width={w} height={h} padding={bare ? 0 : 28}>
            <AnimatePresence mode="wait">
              <motion.div
                key={def.code + frame}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={cx(!mobile && !bare && 'shadow-float')}
              >
                {mobile && frame === 'device' ? (
                  <PhoneFrame>
                    <Screen />
                  </PhoneFrame>
                ) : mobile ? (
                  <div className="overflow-hidden">
                    <Screen />
                  </div>
                ) : (
                  <Screen />
                )}
              </motion.div>
            </AnimatePresence>
          </Stage>
          {mode === 'fullscreen' && <FullscreenControls def={def} onStep={step} onExit={() => setMode('site')} />}
          {mode === 'story' && (
            <StoryPlayer
              key={storyKey}
              dispatch={dispatch}
              go={go}
              onExit={exitStory}
              captions={initial.captions}
              cursor={initial.cursor}
              present={bareStory}
            />
          )}
        </div>
      </NavProvider>
    )
  }

  return (
    <div className="min-h-full bg-gallery text-white">
      <Sidebar open={sidebarOpen} current={screen} onOverview={showOverview} onPick={pick} onStory={startStory} onReset={() => dispatch({ type: 'reset' })} />
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className={cx('transition-[padding] duration-300', sidebarOpen && 'lg:pl-[272px]')}>
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-white/[0.06] bg-gallery/85 px-4 backdrop-blur sm:px-6">
          <ToolButton label={sidebarOpen ? 'Hide menu' : 'Show menu'} onClick={() => setSidebarOpen((o) => !o)}>
            <PanelLeft size={16} />
          </ToolButton>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-[13.5px] text-white/50">
            <button onClick={showOverview} className={cx('shrink-0 hover:text-white', !def && 'font-semibold text-white')}>
              Overview
            </button>
            {def && (
              <>
                <ChevronRight size={14} className="shrink-0 text-white/30" />
                <span className="hidden shrink-0 sm:inline">{def.kind === 'web' ? 'Web portal' : 'Mobile app'}</span>
                <ChevronRight size={14} className="hidden shrink-0 text-white/30 sm:inline" />
                <span className="truncate font-semibold text-white">
                  {def.code} · {def.name}
                </span>
              </>
            )}
          </nav>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <span className="hidden rounded-md bg-warning-400/10 px-2 py-1 text-[11px] font-semibold tracking-wide text-warning-400 uppercase sm:inline">
              Demo data
            </span>
            <ToolButton label="Previous screen (←)" onClick={() => step(-1)}>
              <ChevronLeft size={16} />
            </ToolButton>
            <ToolButton label="Next screen (→)" onClick={() => step(1)}>
              <ChevronRight size={16} />
            </ToolButton>
          </div>
        </header>

        <main className="mx-auto max-w-[2200px] px-4 pt-8 pb-16 sm:px-8">
          {def ? (
            <NavProvider screen={def.code} go={go}>
              <ScreenPage def={def} frame={frame} onFrame={setFrame} onPick={go} onFullscreen={() => setMode('fullscreen')} />
            </NavProvider>
          ) : (
            <Overview onPick={go} />
          )}
        </main>
      </div>
    </div>
  )
}

/** Floating controls for the fitted full-screen view; they fade out while the mouse is idle. */
function FullscreenControls({ def, onStep, onExit }: { def: ScreenDef; onStep: (d: number) => void; onExit: () => void }) {
  const [idle, setIdle] = useState(false)
  const [hover, setHover] = useState(false)
  useEffect(() => {
    let t = setTimeout(() => setIdle(true), 2500)
    const wake = () => {
      setIdle(false)
      clearTimeout(t)
      t = setTimeout(() => setIdle(true), 2500)
    }
    window.addEventListener('mousemove', wake)
    window.addEventListener('keydown', wake)
    return () => {
      clearTimeout(t)
      window.removeEventListener('mousemove', wake)
      window.removeEventListener('keydown', wake)
    }
  }, [])
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cx(
        'fixed top-4 right-4 z-[90] flex items-center gap-1.5 rounded-xl bg-black/60 p-1.5 ring-1 ring-white/10 backdrop-blur transition-opacity duration-300',
        idle && !hover && 'pointer-events-none opacity-0',
      )}
    >
      <ToolButton label="Previous screen (←)" onClick={() => onStep(-1)}>
        <ChevronLeft size={16} />
      </ToolButton>
      <span className="px-2 text-sm whitespace-nowrap">
        <span className="font-semibold text-sky">{def.code}</span> {def.name}
      </span>
      <ToolButton label="Next screen (→)" onClick={() => onStep(1)}>
        <ChevronRight size={16} />
      </ToolButton>
      <button onClick={onExit} className="flex h-9 items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-navy-950 hover:bg-mist">
        <X size={15} /> Exit <span className="text-[11px] font-medium text-navy-950/50">Esc</span>
      </button>
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <DemoProvider>
        <ToastProvider>
          <Gallery />
        </ToastProvider>
      </DemoProvider>
    </MotionConfig>
  )
}
