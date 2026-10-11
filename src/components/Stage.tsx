import { useLayoutEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Renders fixed-size content (e.g. 1920×1080) scaled to its container, preserving aspect ratio.
 * `contain` fits the whole frame inside the container; `width` fills the container's width and
 * takes whatever height that needs, so the page scrolls like a regular website.
 */
export default function Stage({
  width,
  height,
  padding = 32,
  fit = 'contain',
  children,
}: {
  width: number
  height: number
  padding?: number
  fit?: 'contain' | 'width'
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(0.5)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const sw = (el.clientWidth - padding * 2) / width
      const s = fit === 'width' ? sw : Math.min(sw, (el.clientHeight - padding * 2) / height)
      setScale(Math.max(0.1, s))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, height, padding, fit])
  const frame = (
    <div style={{ width: width * scale, height: height * scale }} className="relative shrink-0">
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }} className="absolute top-0 left-0">
        {children}
      </div>
    </div>
  )
  if (fit === 'width')
    return (
      <div ref={ref} style={{ padding }} className="w-full">
        {frame}
      </div>
    )
  return (
    <div ref={ref} className="relative flex h-full w-full items-center justify-center overflow-hidden">
      {frame}
    </div>
  )
}
