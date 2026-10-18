import { useRef } from 'react';
import type { Theme } from '../lib/sunset';

/**
 * A horizon rule with a sun on it, not an icon button. The dot sits high-left
 * in daylight and low-right at dusk, and travels a shallow arc between them.
 */
export default function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      className="toggle"
      aria-pressed={theme === 'dusk'}
      aria-label={theme === 'dusk' ? 'Switch to daylight' : 'Switch to dusk'}
      onClick={() => {
        // Anticipation: the dot pulls back before it travels. Restarting the
        // animation needs a reflow between removing and re-adding the class.
        const el = ref.current;
        if (el) {
          el.classList.remove('anticipate');
          void el.offsetWidth;
          el.classList.add('anticipate');
        }
        onToggle();
      }}
    >
      <span className="toggle-rule" />
      <span className="toggle-dot" />
    </button>
  );
}
