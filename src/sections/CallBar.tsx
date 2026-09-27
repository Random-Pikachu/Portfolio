import { useEffect, useState } from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { SITE } from '../data/site';

/**
 * The call on a phone, pinned to the foot of the screen once the hero's own
 * call has scrolled away, so it is never more than a thumb away. It steps
 * aside while contact or the footer is on screen, where the call and the
 * mail already are. Phones only; it slides by transform.
 */
export function CallBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const cta = document.querySelector('[data-hero-cta]');
    if (!cta || typeof IntersectionObserver === 'undefined') return;
    let ctaGone = false;
    const covering = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === cta) ctaGone = !e.isIntersecting;
        else if (e.isIntersecting) covering.add(e.target);
        else covering.delete(e.target);
      }
      setShow(ctaGone && covering.size === 0);
    });
    io.observe(cta);
    document.querySelectorAll('[data-callbar-hide]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="callbar" data-show={show ? '' : undefined} inert={!show}>
      <a href={SITE.calendar} target="_blank" rel="noopener" className="btn btn--ember callbar__call" data-umami-event="book-call-bar">
        Book a 15-minute call
        <ArrowUpRight size={17} strokeWidth={1.75} aria-hidden="true" />
      </a>
      <a href={`mailto:${SITE.email}`} className="callbar__mail" aria-label={`Email ${SITE.name}`} data-umami-event="email-bar">
        <Mail size={20} strokeWidth={1.5} aria-hidden="true" />
      </a>
    </div>
  );
}
