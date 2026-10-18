import { useState } from 'react';
import { PHOTOS } from '../data/photos';
import { SITE } from '../data/site';
import { useReveal } from '../hooks/useReveal';
import PhotoModal from './PhotoModal';

/** How many tiles load eagerly — roughly one screenful on a wide viewport. */
const EAGER_COUNT = 6;

export default function PhotoGrid() {
  const ref = useReveal<HTMLDivElement>();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="photo-grid-wrap" ref={ref}>
      <ul className="photo-grid">
        {PHOTOS.map((photo, i) => {
          const eager = i < EAGER_COUNT;
          return (
            <li
              key={photo.slug}
              className="photo-tile ph-reveal"
              style={
                {
                  '--c4': photo.spans['4'].col,
                  '--r4': photo.spans['4'].row,
                  '--x4': photo.spans['4'].x,
                  '--y4': photo.spans['4'].y,
                  '--c3': photo.spans['3'].col,
                  '--r3': photo.spans['3'].row,
                  '--x3': photo.spans['3'].x,
                  '--y3': photo.spans['3'].y,
                  '--c2': photo.spans['2'].col,
                  '--r2': photo.spans['2'].row,
                  '--x2': photo.spans['2'].x,
                  '--y2': photo.spans['2'].y,
                  '--lqip': `url("${photo.lqip}")`,
                  // Stagger, capped so photos far down the page don't wait.
                  '--d': `${Math.min(i, 5) * 60}ms`,
                } as React.CSSProperties
              }
            >
              <button
                type="button"
                className="photo-open"
                onClick={() => setOpenIndex(i)}
                aria-label={`Open ${photo.alt || `photograph ${i + 1}`} full size`}
              >
              <div className="photo-frame">
                <img
                  src={`/photos/${photo.slug}-800.webp`}
                  srcSet={`/photos/${photo.slug}-400.webp 400w, /photos/${photo.slug}-800.webp 800w`}
                  sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 25vw"
                  width={photo.width}
                  height={photo.height}
                  loading={eager ? 'eager' : 'lazy'}
                  decoding="async"
                  fetchPriority={i < 2 ? 'high' : undefined}
                  alt={photo.alt || `Photograph ${i + 1} by ${SITE.name}`}
                />
              </div>
              </button>
            </li>
          );
        })}
      </ul>

      {openIndex !== null && (
        <PhotoModal
          photos={PHOTOS}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onNavigate={setOpenIndex}
        />
      )}
    </div>
  );
}
