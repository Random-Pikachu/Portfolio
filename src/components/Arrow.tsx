/** The one piece of ornament on the site: a plain geometric arrow, pointing on. */
export default function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 160 260" fill="none" aria-hidden="true">
      <path
        d="M80 8 V236 M14 172 L80 240 L146 172"
        stroke="currentColor" strokeWidth="18" strokeLinecap="butt" strokeLinejoin="miter"
      />
    </svg>
  );
}
