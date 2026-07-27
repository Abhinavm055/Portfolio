import { useState } from 'react'
import './index.css'
import SmoothScroll from './components/SmoothScroll'
import ParallaxEngine from './components/ParallaxEngine'
import CinematicBG from './components/CinematicBG'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import OpenToWork from './components/OpenToWork'
import Technologies from './components/Technologies'
import Contact from './components/Contact'
import IntroScreen from './components/IntroScreen'

import SceneSnapController from './components/SceneSnapController'

export default function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false)

  return (
    <SmoothScroll>
      <ParallaxEngine>
        {/* Fixed 7-layer cinematic background */}
        <CinematicBG />

        {/* Custom cursor */}
        <Cursor />

        {/* Controlled scene snap controller */}
        {isIntroComplete && <SceneSnapController />}

        {/* Intro Screen Overlay (renders ON TOP of Hero until curtain finishes sliding up) */}
        {!isIntroComplete && (
          <IntroScreen onComplete={() => setIsIntroComplete(true)} />
        )}

        {/* Navigation & Portfolio content — ALWAYS mounted underneath from initial load */}
        <Navbar />
        <main>
          <Hero isIntroComplete={isIntroComplete} />
          <About />
          <Projects />
          <OpenToWork />
          <Technologies />
          <Contact />
        </main>
      </ParallaxEngine>
    </SmoothScroll>
  )
}
