import { useEffect, useState } from 'react';
import { moonPhase, type MoonPhase } from './astro';

/** The phase right now, computed on the client and refreshed every hour. Null on the server. */
export function useMoon(): MoonPhase | null {
  const [phase, setPhase] = useState<MoonPhase | null>(null);
  useEffect(() => {
    const tick = () => setPhase(moonPhase(new Date()));
    tick();
    const id = setInterval(tick, 60 * 60 * 1000);
    return () => clearInterval(id);
  }, []);
  return phase;
}
