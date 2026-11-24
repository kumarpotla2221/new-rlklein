import { Link } from 'react-router-dom';
import { ArrowRight, Home } from 'lucide-react';

/** Shown for any URL that doesn't match a page. */
export function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '96px 20px', textAlign: 'center' }}>
      {/* React 19 moves these into <head>. noindex keeps broken URLs out of Google. */}
      <title>Page Not Found | R.L. Klein &amp; Associates</title>
      <meta name="robots" content="noindex" />

      <span className="eyebrow">Error 404</span>
      <h1 style={{ margin: '12px 0 16px' }}>Page Not Found</h1>
      <p style={{ color: 'var(--color-gray-600)', maxWidth: 520, margin: '0 auto 32px' }}>
        The page you are looking for may have been moved or no longer exists.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn--primary btn--md">
          <Home size={16} />
          <span>Back to Home</span>
        </Link>
        <Link to="/hot-jobs" className="btn btn--outline-blue btn--md">
          <span>Browse Open Jobs</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
