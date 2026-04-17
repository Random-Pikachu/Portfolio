import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Navigation from './components/Navigation';
import SinglePage from './pages/SinglePage';
import ReactLenis from 'lenis/react';
import { Analytics } from '@vercel/analytics/react';

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
      <Navigation />
      <SinglePage />
      <Analytics />
    </ReactLenis>
  </StrictMode>
);
