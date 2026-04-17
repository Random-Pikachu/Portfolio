import { useState, useEffect, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { Menu, X, CalendarDays, Sun, Moon } from 'lucide-react';

const NAV_SECTIONS = ['about', 'experience', 'projects', 'contact'] as const;

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) ||
        (localStorage.getItem('theme') === 'dark');
    }
    return true;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = (e: React.MouseEvent) => {
    const isDarkTarget = !isDark;
    const x = e.clientX;
    const y = e.clientY;

    if (!document.startViewTransition) {
      setIsDark(isDarkTarget);
      return;
    }

    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setIsDark(isDarkTarget);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      document.documentElement.animate(
        {
          clipPath: isDarkTarget ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 600,
          easing: 'cubic-bezier(0.87, 0, 0.13, 1)',
          pseudoElement: isDarkTarget ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      );
    });
  };

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  // Scroll-based active section detection
  const updateActive = useCallback(() => {
    const offset = 120; // navbar height + some buffer
    let current = '';

    for (const id of NAV_SECTIONS) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= offset) {
          current = id;
        }
      }
    }
    setActive(current);
  }, []);

  useEffect(() => {
    updateActive();
    window.addEventListener('scroll', updateActive, { passive: true });
    return () => window.removeEventListener('scroll', updateActive);
  }, [updateActive]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setOpen(false);
  };

  const linkClass = (id: string) =>
    `mono text-sm tracking-[0.08em] transition-colors duration-200 ${active === id ? 'text-accent' : 'text-text-faint hover:text-accent'
    }`;

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 h-[64px] flex items-center justify-between px-6 border-b border-border-main bg-bg-base/80 backdrop-blur-md">
        <button
          onClick={() => scrollTo('hero')}
          className="mono text-sm text-text-light tracking-[0.1em] hover:text-text-muted transition-colors"
        >
          random-pikachu
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_SECTIONS.map((id) => (
            <button key={id} onClick={() => scrollTo(id)} className={linkClass(id)}>
              {id}
            </button>
          ))}
          <div className="w-px h-3 bg-border-inner" />
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-sm text-text-faint hover:text-accent transition-colors"
          >
            resume ↗
          </a>
          <a
            href="https://www.cal.com/random-pikachu/15min"
            target="_blank"
            rel="noopener noreferrer"
            className="mono text-sm text-text-faint hover:text-accent transition-colors flex items-center gap-1"
          >
            <CalendarDays className="w-4 h-4" />
            schedule ↗
          </a>
          <div className="w-px h-3 bg-border-inner" />
          <button onClick={toggleTheme} className="text-text-faint hover:text-accent p-1 transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-4">
          <button onClick={toggleTheme} className="text-text-faint hover:text-accent p-1 transition-colors">
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="text-text-faint hover:text-accent p-1 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-bg-base flex flex-col items-center justify-center gap-8 md:hidden transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {NAV_SECTIONS.map((id) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className={`mono text-xl transition-colors ${active === id ? 'text-accent' : 'text-text-faint hover:text-accent'
              }`}
          >
            {id}
          </button>
        ))}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mono text-xl text-text-faint hover:text-accent transition-colors"
        >
          resume ↗
        </a>
        <a
          href="https://www.cal.com/random-pikachu/15min"
          target="_blank"
          rel="noopener noreferrer"
          className="mono text-xl text-text-faint hover:text-accent transition-colors"
        >
          schedule ↗
        </a>
      </div>
    </>
  );
}
