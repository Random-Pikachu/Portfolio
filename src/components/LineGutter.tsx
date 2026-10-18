import { useEffect, useRef, useState } from 'react';

/**
 * Line numbers down the left edge of the document.
 *
 * CSS cannot count rendered lines, so this measures the document and emits
 * one number per line-height. Because the gutter uses exactly the prose
 * line-height, the numbers land on the lines without being tied to any
 * particular block — which is also how pleading paper works: it numbers the
 * page, not the sentences.
 *
 * Renders nothing on the server and nothing until measured, so the
 * prerendered HTML stays clean and a crawler never sees a column of digits.
 */
export default function LineGutter({ targetId }: { targetId: string }) {
  const [lines, setLines] = useState(0);
  const [lh, setLh] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    const measure = () => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        /*
          Probe an ordinary body paragraph. Probing whatever came first picked
          up the abstract, which is set larger, so every gutter number was
          spaced to a 35px line while the prose ran on 29px and the two drifted
          apart down the page.
        */
        const probe =
          el.querySelector<HTMLElement>('section:not(.abstract) > p:not(.lead):not(.refs)') ??
          el.querySelector<HTMLElement>('[data-line-probe]') ??
          el;
        const step = parseFloat(getComputedStyle(probe).lineHeight);
        if (!Number.isFinite(step) || step <= 0) return;
        setLh(step);
        setLines(Math.max(1, Math.floor(el.scrollHeight / step)));
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Webfonts land after first layout and change every line height with them.
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [targetId]);

  if (!lines || !lh) return null;

  return (
    <div className="gutter" aria-hidden="true" style={{ lineHeight: `${lh}px` }}>
      {Array.from({ length: lines }, (_, i) => (
        <a key={i} href={`#L${i + 1}`} id={`L${i + 1}`} className="gutter-n" tabIndex={-1}>
          {i + 1}
        </a>
      ))}
    </div>
  );
}
