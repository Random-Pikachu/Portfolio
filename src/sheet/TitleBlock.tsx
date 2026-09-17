import { useEffect, useState } from 'react';
import { DRAWING_NO, PLACE, PLATES, SHEETS, SITE } from '../data/site';
import { clock, revisionDate } from './astro';
import { MoonGlyph } from './MoonGlyph';
import { useMoon } from './useMoon';
import { useSheetState } from './store';

/** Ticks once a second, client only. */
function useClock() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setT(clock(new Date(), PLACE.timeZone));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

/**
 * The encounter. On about one load in forty, decided by the minute and the
 * day so it is not random noise, the revision cell reads 025 for 900 ms and
 * then corrects itself to the moon. One line goes to the console.
 */
function useEncounter() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const d = new Date();
    if ((d.getMinutes() * 31 + d.getDate()) % 40 !== 0) return;
    const show = setTimeout(() => {
      setOn(true);
      console.log('rev 025 sighted');
    }, 400);
    const hide = setTimeout(() => setOn(false), 1300);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);
  return on;
}

export interface TitleBlockPage {
  /** e.g. "Note 003" or "Survey" */
  sheet: string;
  block: string;
  scale?: string;
}

/**
 * The title block of the drawing: who drew it, which sheet this is, the
 * revision (the real moon), where and when. Fixed bottom-right on desktop,
 * a block at the end of the page on phones. On the home page it follows the
 * active sheet and plate; sub-pages pass their own line.
 */
export function TitleBlock({ page }: { page?: TitleBlockPage }) {
  const { sheet, plate } = useSheetState();
  const moon = useMoon();
  const time = useClock();
  const encounter = useEncounter();
  const now = time ? new Date() : null;

  let line: TitleBlockPage;
  if (page) line = page;
  else {
    const s = SHEETS.find((x) => x.id === sheet) ?? SHEETS[0];
    line =
      s.id === 'projects' && plate !== null
        ? { sheet: `Detail ${plate + 1}/${PLATES.length}`, block: s.block, scale: '1:1' }
        : { sheet: `Sheet ${s.num}/${String(SHEETS.length - 1).padStart(2, '0')}`, block: s.block, scale: s.id === 'cover' ? 'NTS' : '1:1' };
  }

  return (
    <aside className="title-block" aria-label="Title block">
      <div className="tb-cell tb-name">
        <b>{SITE.name}</b>
        <span>Drawing No. {DRAWING_NO}</span>
      </div>
      <div className="tb-cell tb-sheet">
        <b>{line.sheet}</b>
        <span>{line.block}</span>
      </div>
      <div className="tb-cell tb-rev">
        <b className={encounter ? 'is-encounter' : undefined}>
          Rev{' '}
          {encounter ? <span>{DRAWING_NO}</span> : <MoonGlyph phase={moon} size={11} />}
        </b>
        <span suppressHydrationWarning>{now ? revisionDate(now, PLACE.timeZone) : '--.--.--'}</span>
      </div>
      <div className="tb-cell tb-foot">
        <span>
          {PLACE.city} {PLACE.coords}
        </span>
        <span>
          <time suppressHydrationWarning>{time ?? '--:--:--'}</time> {PLACE.zoneLabel}
        </span>
        <span>Scale {line.scale ?? '1:1'}</span>
      </div>
    </aside>
  );
}
