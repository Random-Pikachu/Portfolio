import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.tsx'
import RootLayout from './components/RootLayout.tsx';
import Footer from './components/Footer.tsx'
import ReactLenis from 'lenis/react'
// import CustomCursor from './components/CustomCursor';

import { Analytics } from "@vercel/analytics/react"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
      }}
    >
      {/* <div className="hidden md:block">
        <CustomCursor />
      </div> */}

      <RootLayout>
        <Home />
        <Footer />
      </RootLayout>
      <Analytics />
    </ReactLenis>
  </StrictMode>,
)
