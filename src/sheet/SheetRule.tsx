/**
 * A horizontal rule across the sheet with a crosshair at every column line,
 * the registration marks of a drawing. One sits at each sheet boundary.
 */
export function SheetRule({ className = '' }: { className?: string }) {
  return (
    <div className={`sheet-rule ${className}`} aria-hidden="true">
      {Array.from({ length: 10 }, (_, i) => (
        <i key={i} />
      ))}
    </div>
  );
}
