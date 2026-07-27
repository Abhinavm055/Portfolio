import { useEffect, useRef } from 'react'
import { useLenis } from './SmoothScroll'

const SECTIONS = ['home', 'about', 'projects', 'open-to-work', 'technologies', 'contact']
const TOTAL_PROJECTS = 3

// power4.inOut easing for section scrolling
const power4InOut = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2

export default function SceneSnapController() {
  const lenis            = useLenis()
  const isLockedRef      = useRef(false)
  const projectIdxRef    = useRef(0)
  const touchStartXRef   = useRef(0)
  const touchStartYRef   = useRef(0)

  useEffect(() => {
    if (!lenis) return

    const getCurrentSectionIndex = () => {
      const vh = window.innerHeight || 1
      const sy = window.scrollY
      const rawIdx = Math.round(sy / vh)
      return Math.max(0, Math.min(SECTIONS.length - 1, rawIdx))
    }

    const dispatchProjectEvent = (idx: number, direction: 'next' | 'prev') => {
      projectIdxRef.current = idx
      window.dispatchEvent(
        new CustomEvent('portfolio:set-project', {
          detail: { index: idx, direction },
        })
      )
    }

    const snapToSection = (targetIdx: number) => {
      if (targetIdx < 0 || targetIdx >= SECTIONS.length) return
      isLockedRef.current = true

      // Handle project state initialization when entering #projects
      if (SECTIONS[targetIdx] === 'projects') {
        const currentSec = getCurrentSectionIndex()
        if (currentSec < targetIdx) {
          // Entering from above (About -> Projects): start on first project
          dispatchProjectEvent(0, 'next')
        } else if (currentSec > targetIdx) {
          // Entering from below (OpenToWork -> Projects): start on last project
          dispatchProjectEvent(TOTAL_PROJECTS - 1, 'prev')
        }
      }

      lenis.scrollTo(`#${SECTIONS[targetIdx]}`, {
        duration: 0.8,
        easing: power4InOut,
        onComplete: () => {
          setTimeout(() => {
            isLockedRef.current = false
          }, 100)
        },
      })
    }

    /* ── Listen for direct chevron/swipe project navigation from Projects component ── */
    const handleSyncProject = (e: Event) => {
      const customEvt = e as CustomEvent<{ index: number }>
      if (typeof customEvt.detail?.index === 'number') {
        projectIdxRef.current = customEvt.detail.index
      }
    }
    window.addEventListener('portfolio:sync-project', handleSyncProject)

    /* ── Wheel Navigation Handler ── */
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (isLockedRef.current) return
      if (Math.abs(e.deltaY) < 2) return

      const currSec = getCurrentSectionIndex()

      // When inside #projects section: convert scroll into project storytelling steps
      if (SECTIONS[currSec] === 'projects') {
        const pIdx = projectIdxRef.current

        if (e.deltaY > 0) {
          // Scroll Down
          if (pIdx < TOTAL_PROJECTS - 1) {
            isLockedRef.current = true
            dispatchProjectEvent(pIdx + 1, 'next')
            setTimeout(() => { isLockedRef.current = false }, 650)
            return
          } else {
            // Reached last project -> snap down to #open-to-work
            snapToSection(currSec + 1)
            return
          }
        } else {
          // Scroll Up
          if (pIdx > 0) {
            isLockedRef.current = true
            dispatchProjectEvent(pIdx - 1, 'prev')
            setTimeout(() => { isLockedRef.current = false }, 650)
            return
          } else {
            // Reached first project -> snap up to #about
            snapToSection(currSec - 1)
            return
          }
        }
      }

      // Normal section snapping for non-project sections
      if (e.deltaY > 0) {
        if (currSec < SECTIONS.length - 1) snapToSection(currSec + 1)
      } else {
        if (currSec > 0) snapToSection(currSec - 1)
      }
    }

    /* ── Touch Gesture Handler ── */
    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX
      touchStartYRef.current = e.touches[0].clientY
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (isLockedRef.current) return

      const deltaX = touchStartXRef.current - e.changedTouches[0].clientX
      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY

      const currSec = getCurrentSectionIndex()

      // In #projects: check for horizontal & vertical swipe gestures
      if (SECTIONS[currSec] === 'projects') {
        const pIdx = projectIdxRef.current

        // Horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 35) {
          if (deltaX > 0 && pIdx < TOTAL_PROJECTS - 1) {
            isLockedRef.current = true
            dispatchProjectEvent(pIdx + 1, 'next')
            setTimeout(() => { isLockedRef.current = false }, 650)
          } else if (deltaX < 0 && pIdx > 0) {
            isLockedRef.current = true
            dispatchProjectEvent(pIdx - 1, 'prev')
            setTimeout(() => { isLockedRef.current = false }, 650)
          }
          return
        }

        // Vertical swipe
        if (Math.abs(deltaY) > 30) {
          if (deltaY > 0) {
            if (pIdx < TOTAL_PROJECTS - 1) {
              isLockedRef.current = true
              dispatchProjectEvent(pIdx + 1, 'next')
              setTimeout(() => { isLockedRef.current = false }, 650)
            } else {
              snapToSection(currSec + 1)
            }
          } else {
            if (pIdx > 0) {
              isLockedRef.current = true
              dispatchProjectEvent(pIdx - 1, 'prev')
              setTimeout(() => { isLockedRef.current = false }, 650)
            } else {
              snapToSection(currSec - 1)
            }
          }
          return
        }
      }

      // Normal vertical section swipe
      if (Math.abs(deltaY) > 25) {
        if (deltaY > 0) {
          if (currSec < SECTIONS.length - 1) snapToSection(currSec + 1)
        } else {
          if (currSec > 0) snapToSection(currSec - 1)
        }
      }
    }

    /* ── Keyboard Arrow Navigation Handler ── */
    const handleKeyDown = (e: KeyboardEvent) => {
      const currSec = getCurrentSectionIndex()
      const isProjects = SECTIONS[currSec] === 'projects'
      const pIdx = projectIdxRef.current

      if (['ArrowDown', 'PageDown', 'ArrowRight'].includes(e.key)) {
        e.preventDefault()
        if (isLockedRef.current) return

        if (isProjects) {
          if (pIdx < TOTAL_PROJECTS - 1) {
            isLockedRef.current = true
            dispatchProjectEvent(pIdx + 1, 'next')
            setTimeout(() => { isLockedRef.current = false }, 650)
          } else {
            snapToSection(currSec + 1)
          }
        } else {
          if (currSec < SECTIONS.length - 1) snapToSection(currSec + 1)
        }
      } else if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key)) {
        e.preventDefault()
        if (isLockedRef.current) return

        if (isProjects) {
          if (pIdx > 0) {
            isLockedRef.current = true
            dispatchProjectEvent(pIdx - 1, 'prev')
            setTimeout(() => { isLockedRef.current = false }, 650)
          } else {
            snapToSection(currSec - 1)
          }
        } else {
          if (currSec > 0) snapToSection(currSec - 1)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('portfolio:sync-project', handleSyncProject)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lenis])

  return null
}
