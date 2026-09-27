import { useEffect, useRef, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Photo } from '../data/photos';
import { SITE } from '../data/site';

/** "2026-07-21 18:21:17" -> "21 JUL 2026". Empty in, empty out: the caller
    passes only a verified EXIF capture timestamp. */
function formatDate(shotAt: string) {
  if (!shotAt) return '';
  const d = new Date(shotAt.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  const month = d.toLocaleString('en-GB', { month: 'short' }).toUpperCase();
  return `${String(d.getDate()).padStart(2, '0')} ${month} ${d.getFullYear()}`;
}

function formatTime(shotAt: string) {
  if (!shotAt) return '';
  const d = new Date(shotAt.replace(' ', 'T'));
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

export default function PhotoModal({
  photos,
  index,
  onClose,
  onNavigate,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onNavigate: (next: number) => void;
}) {
  const photo = photos[index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const restoreTo = useRef<Element | null>(null);

  const go = useCallback(
    (delta: number) => onNavigate((index + delta + photos.length) % photos.length),
    [index, photos.length, onNavigate]
  );

  // Keyboard: Escape closes, arrows move, Tab is trapped inside the dialog.
  useEffect(() => {
    restoreTo.current = document.activeElement;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowRight') { go(1); return; }
      if (e.key === 'ArrowLeft') { go(-1); return; }
      if (e.key !== 'Tab') return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      (restoreTo.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose, go]);

  const date = formatDate(photo.shotAt);
  const time = formatTime(photo.shotAt);
  // Only the parts this photo actually has: 3 of 27 files carry no camera EXIF.
  const settings = [photo.focal, photo.aperture, photo.shutter, photo.iso].filter(Boolean);

  return (
    <div
      className="photo-modal"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt || `Photograph ${index + 1} of ${photos.length}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="photo-modal-inner" ref={dialogRef}>
        <button
          ref={closeRef}
          type="button"
          className="photo-modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              className="photo-modal-nav left"
              onClick={() => go(-1)}
              aria-label="Previous photo"
            >
              <ChevronLeft size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              className="photo-modal-nav right"
              onClick={() => go(1)}
              aria-label="Next photo"
            >
              <ChevronRight size={22} aria-hidden="true" />
            </button>
          </>
        )}

        {/* The print: photo above, camera plate below, always full colour. */}
        <figure className="photo-plate">
          <img
            key={photo.slug}
            src={`/photos/${photo.slug}-1600.webp`}
            width={photo.width}
            height={photo.height}
            alt={photo.alt || `Photograph ${index + 1} by ${SITE.name}`}
            decoding="async"
          />

          <figcaption className="photo-bar">
            <div className="photo-bar-left">
              {photo.device && <p className="photo-bar-device">{photo.device}</p>}
              {settings.length > 0 && (
                <p className="photo-bar-settings">{settings.join('  ·  ')}</p>
              )}
            </div>

            <div className="photo-bar-right">
              {date && (
                <p className="photo-bar-date">
                  {date}
                  {time && <span className="photo-bar-time">{time}</span>}
                </p>
              )}
              {photo.location && <p className="photo-bar-location">{photo.location}</p>}
            </div>
          </figcaption>
        </figure>

        <p className="photo-modal-count" aria-live="polite">
          {index + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}
