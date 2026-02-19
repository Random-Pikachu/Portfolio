import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.tsx'
import Experience from './pages/Experience.tsx'
import Projects from './pages/Projects.tsx'
import NotFound from './pages/NotFound.tsx'
import RootLayout from './components/RootLayout.tsx';
import Footer from './components/Footer.tsx'
import ReactLenis from 'lenis/react'
// import CustomCursor from './components/CustomCursor';

import { Analytics } from "@vercel/analytics/react"
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'experience', element: <Experience /> },
      { path: 'projects', element: <Projects /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);



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

      <RouterProvider router={router} />
      <Footer />
      <Analytics />
    </ReactLenis>
  </StrictMode>,
)
