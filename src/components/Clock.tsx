import { useEffect, useRef } from 'react';

/**
 * Local time where Sangam is. Written through a ref on an interval rather than
 * through state, so the tick never re-renders the page, and rendered empty on
 * the server so the prerendered HTML can never disagree with hydration.
 */
export default function Clock() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata',
    });
    const paint = () => {
      if (ref.current) ref.current.textContent = `Gwalior ${fmt.format(new Date())} IST`;
    };
    paint();
    const id = setInterval(paint, 20_000);
    return () => clearInterval(id);
  }, []);

  return <span className="nav-clock" ref={ref} suppressHydrationWarning />;
}
