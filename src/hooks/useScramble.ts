import { useState, useEffect } from 'react';

const CHARS = '!@#$%^&*+=<>?/\\|[]{}~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789▓▒░█';

export function useScramble(text: string, delay = 0, enabled = true) {
  const [display, setDisplay] = useState(
    text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  );
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const timeout = setTimeout(() => {
      let frame = 0;
      const maxFrames = 32;

      const run = () => {
        setDisplay(
          text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (frame / maxFrames > i / text.length + 0.2) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('')
        );

        frame++;
        if (frame < maxFrames + text.length) {
          requestAnimationFrame(run);
        } else {
          setDisplay(text);
          setDone(true);
        }
      };

      requestAnimationFrame(run);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, enabled]);

  return { display, done };
}
