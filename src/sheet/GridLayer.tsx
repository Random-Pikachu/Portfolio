/**
 * The sheet's rule lines. Ten faint columns on desktop, four on phones,
 * drawn once on a fixed layer that sits under everything and never moves.
 * The crosshairs where a sheet's rule meets a column belong to SheetRule.
 */
export function GridLayer() {
  return (
    <div className="grid-layer" aria-hidden="true">
      <div className="grid-layer__sheet">
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} />
        ))}
      </div>
    </div>
  );
}
