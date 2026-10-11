import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Info } from 'lucide-react'

type Toast = { id: number; text: string; tone: 'success' | 'info' }
const Ctx = createContext<(text: string, tone?: Toast['tone']) => void>(() => {})

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([])
  const push = useCallback((text: string, tone: Toast['tone'] = 'success') => {
    const id = Date.now() + Math.random()
    setItems((t) => [...t.slice(-2), { id, text, tone }])
    setTimeout(() => setItems((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])
  return (
    <Ctx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-[200] flex -translate-x-1/2 flex-col items-center gap-2" aria-live="polite">
        <AnimatePresence>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex items-center gap-2.5 rounded-2xl bg-navy-950/95 px-4 py-3 text-sm font-medium text-white shadow-float ring-1 ring-white/10 backdrop-blur"
            >
              {t.tone === 'success' ? <CheckCircle2 size={17} className="text-success-400" /> : <Info size={17} className="text-sky" />}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
