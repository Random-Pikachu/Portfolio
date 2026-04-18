import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Navigation from './components/Navigation';
import SinglePage from './pages/SinglePage';
import ReactLenis from 'lenis/react';
import { Analytics } from '@vercel/analytics/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
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
        <Routes>
          <Route path="/" element={<SinglePage />} />
          <Route path="/*" element={<Navigate to="/" replace />} />
        </Routes>
        <Analytics />
      </ReactLenis>
    </BrowserRouter>
  </StrictMode>
);
