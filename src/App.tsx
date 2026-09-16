import { useState } from 'react'
import './index.css'
import 'devicon/devicon.min.css'
import SmoothScroll from './components/SmoothScroll'
import ParallaxEngine from './components/ParallaxEngine'
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
          {/* Hero is position:fixed — this spacer reserves its viewport slot in the scroll flow */}
          <Hero isIntroComplete={isIntroComplete} />
          <div style={{ height: '100vh' }} aria-hidden="true" />
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
