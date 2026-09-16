import { SITE } from '../data/site';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border-main">
      <div className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-6">
        <p className="t-mono text-text-faint">
          © {year} {SITE.handle.toLowerCase()}
        </p>
        <pre className="mono hidden text-[11px] leading-tight text-text-faint select-none sm:block" aria-hidden="true">
          {`(\\__/) (•ω•)ノ / > ⚡`}
        </pre>
        <div className="flex items-center gap-6">
          <p className="t-mono text-text-faint">[ pokedex entry #025 ]</p>
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              history.replaceState(null, '', ' ');
            }}
            className="arrow-link t-mono text-text-muted hover:text-text-base"
          >
            back to top
            <span className="arrow" aria-hidden="true">↑</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
