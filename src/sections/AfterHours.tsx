import { useRef } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { NOTE_COUNT } from '../data/content.generated';
import { PHOTOS } from '../data/photos';
import { SITE } from '../data/site';
import { lockScroll } from '../shell/scroll';

/**
 * The one easter egg, kept and polished: the handle is Random-Pikachu, and
 * Pikachu is entry No. 025 in the Pokédex. The door says only the number;
 * behind it, the logo and the entry. A native dialog, so Escape and the
 * backdrop close it and focus returns on its own.
 */
function Egg() {
  const ref = useRef<HTMLDialogElement>(null);
  const open = () => {
    ref.current?.showModal();
    lockScroll(true);
  };
  const close = () => {
    ref.current?.close();
  };
  return (
    <>
      <button type="button" className="door door--egg" onClick={open}>
        <span className="t-label door__label">No. 025</span>
        <span className="door__title">A Pokédex entry</span>
        <span className="t-small door__hook">Open it.</span>
      </button>
      <dialog
        ref={ref}
        className="egg"
        aria-labelledby="egg-title"
        onClose={() => lockScroll(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="egg__inner">
          <button type="button" className="egg__close" onClick={close} aria-label="Close">
            <X size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
          <img src="/logo.webp" width={1080} height={911} alt="Pikachu, in pixel art." className="egg__img" loading="lazy" decoding="async" />
          <p id="egg-title" className="t-label egg__title">
            Pokédex No. 025 · Pikachu
          </p>
          <p className="t-small egg__line">@{SITE.handle}</p>
        </div>
      </dialog>
    </>
  );
}

/**
 * After hours: a slim strip, not a section. Three doors for the cold
 * visitor to warm up behind before the ask: the photographs, the blog once
 * a real note exists, and the one egg.
 */
export function AfterHours() {
  return (
    <section className="after" aria-labelledby="after-title">
      <div className="frame">
        <h2 id="after-title" className="t-label after__label">
          After hours
        </h2>
        <div className="after__doors" data-reveal>
          <a href="/photography" className="door">
            <span className="t-label door__label">Photos</span>
            <span className="door__title">Photography</span>
            <span className="t-small door__hook">{PHOTOS.length} frames from a Nothing Phone (1).</span>
            <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" className="door__arrow" />
          </a>
          {NOTE_COUNT > 0 ? (
            <a href="/blog" className="door">
              <span className="t-label door__label">Blog</span>
              <span className="door__title">Notes</span>
              <span className="t-small door__hook">
                {NOTE_COUNT} {NOTE_COUNT === 1 ? 'note' : 'notes'}, in Markdown, with code.
              </span>
              <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" className="door__arrow" />
            </a>
          ) : null}
          <Egg />
        </div>
      </div>
    </section>
  );
}
