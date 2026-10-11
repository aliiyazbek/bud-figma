import { createContext, useContext, type ReactNode } from 'react'

export type ScreenCode =
  | 'W01' | 'W02' | 'W03' | 'W04' | 'W05' | 'W06' | 'W07'
  | 'M01' | 'M02' | 'M03' | 'M04' | 'M05' | 'M06' | 'M07' | 'M08' | 'M09' | 'M10' | 'M11'

const NavCtx = createContext<{ screen: ScreenCode; go: (s: ScreenCode) => void } | null>(null)

export function NavProvider({
  screen,
  go,
  children,
}: {
  screen: ScreenCode
  go: (s: ScreenCode) => void
  children: ReactNode
}) {
  return <NavCtx.Provider value={{ screen, go }}>{children}</NavCtx.Provider>
}

export function useNav() {
  const v = useContext(NavCtx)
  if (!v) throw new Error('useNav must be used inside NavProvider')
  return v
}
