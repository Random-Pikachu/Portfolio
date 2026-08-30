import { useState, useEffect } from 'react';

const CHARS = '!@#$%^&*+=<>?/\\|[]{}~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789▓▒░█';

/**
 * Starts on the real text rather than random glyphs. That keeps the prerendered
 * HTML and the first client render identical (so hydration is clean), puts the
 * actual word in the markup for crawlers, and means the text is still readable
 * if JavaScript never runs. The scramble is applied after mount as decoration.
 */
export function useScramble(text: string, delay = 0, enabled = true) {
  const [display, setDisplay] = useState(text);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(text);
      setDone(true);
      return;
    }

    let raf = 0;
    setDisplay(
      text
        .split('')
        .map((c) => (c === ' ' ? ' ' : CHARS[Math.floor(Math.random() * CHARS.length)]))
        .join('')
    );

    const timeout = setTimeout(() => {
      let frame = 0;
      const maxFrames = 32;

      const run = () => {
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' ';
              if (frame / maxFrames > i / text.length + 0.2) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );

        frame++;
        if (frame < maxFrames + text.length) {
          raf = requestAnimationFrame(run);
        } else {
          setDisplay(text);
          setDone(true);
        }
      };

      raf = requestAnimationFrame(run);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, enabled]);

  return { display, done };
}
