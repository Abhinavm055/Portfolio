/**
 * ParallaxEngine — Global mouse tracking context.
 * Provides normalized mouse position (-1 to 1) and raw pixel coords
 * via a MutableRef so consumers read the latest value in animation loops
 * without triggering React re-renders.
 */
import { createContext, useContext, useEffect, useRef } from 'react'

export interface ParallaxState {
  /** Normalized -1…1 relative to viewport centre */
  mouse: { x: number; y: number }
  /** Raw pixel position */
  rawMouse: { x: number; y: number }
}

const DEFAULT_STATE: ParallaxState = {
  mouse: { x: 0, y: 0 },
  rawMouse: { x: 0, y: 0 },
}

export const ParallaxContext = createContext<React.MutableRefObject<ParallaxState>>({
  current: { ...DEFAULT_STATE },
})

/** Read the live parallax state ref inside animation loops. */
export function useParallaxState() {
  return useContext(ParallaxContext)
}

export default function ParallaxEngine({ children }: { children: React.ReactNode }) {
  const stateRef = useRef<ParallaxState>({ ...DEFAULT_STATE })

  useEffect(() => {
    let vw = window.innerWidth
    let vh = window.innerHeight

    const handleResize = () => {
      vw = window.innerWidth
      vh = window.innerHeight
    }

    const onMove = (e: MouseEvent) => {
      stateRef.current.mouse = {
        x: (e.clientX / (vw || 1)) * 2 - 1,
        y: (e.clientY / (vh || 1)) * 2 - 1,
      }
      stateRef.current.rawMouse = { x: e.clientX, y: e.clientY }
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('mousemove', onMove, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <ParallaxContext.Provider value={stateRef}>
      {children}
    </ParallaxContext.Provider>
  )
}
