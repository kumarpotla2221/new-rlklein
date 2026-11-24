/** Shown while a page's code is downloading. Keeps the space so the footer doesn't jump. */
export function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <span className="page-loader__spinner" aria-hidden="true" />
      <span className="sr-only">Loading…</span>
    </div>
  );
}
