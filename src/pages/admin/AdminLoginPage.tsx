import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError('Please enter both administrative email and password.');
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : 'Authentication failed.');
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@rlklein.com');
    setPassword('RLK-Admin-2024!');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--color-navy)', color: '#fff' }}>
      <header className="admin-login-header" style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container admin-login-header__inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>
            <img className="admin-login-logo" src="/rlklein-logo.png" alt="R.L. Klein Inc. & Associates" />
          </Link>
          <Link to="/" style={{ fontSize: '13px', color: '#CBD5E1' }}>
            &larr; Return to Public Website
          </Link>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
        <div style={{ width: '100%', maxWidth: '440px', backgroundColor: '#fff', color: 'var(--color-gray-800)', borderRadius: '12px', padding: '40px', boxShadow: 'var(--shadow-xl)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-off-white)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--color-navy)' }}>
              <ShieldCheck size={26} />
            </div>
            <h1 style={{ fontSize: '24px', color: 'var(--color-navy)', marginBottom: 6 }}>Administrative Portal</h1>
            <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
              Restricted to authorized R.L. Klein recruiters &amp; administrators.
            </p>
          </div>

          {localError && (
            <div style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', padding: '12px 16px', borderRadius: '4px', fontSize: '13px', marginBottom: '20px' }}>
              {localError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="admin-email" className="form-label">Administrative Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                <input
                  type="email"
                  id="admin-email"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="name@rlklein.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 24 }}>
              <label htmlFor="admin-password" className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
                <input
                  type="password"
                  id="admin-password"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn btn--primary btn--md"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Development Helper Box */}
          <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--color-gray-200)', textAlign: 'center' }}>
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-gray-500)', display: 'block', marginBottom: 8 }}>
              Development Credentials
            </span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="btn btn--ghost btn--sm"
              style={{ fontSize: '12px', color: 'var(--color-violet)' }}
            >
              Click to autofill authorized admin login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
