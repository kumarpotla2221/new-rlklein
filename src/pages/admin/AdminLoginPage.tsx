import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye } from 'lucide-react';

const REMEMBER_KEY = 'rlk_admin_remembered_email';
const ASSET = `${import.meta.env.BASE_URL}admin-login/`;

const FEATURES = [
  { icon: 'users.svg', title: 'Healthcare-Focused Staffing', text: 'Specialized in clinical & administrative placements' },
  { icon: 'shield.svg', title: 'HIPAA-Compliant & Secure', text: 'End-to-end encrypted data protection' },
  { icon: 'trending-up.svg', title: 'Real-Time Pipeline Management', text: 'Track placements from sourcing to onboarding' },
];

function readRememberedEmail() {
  try {
    return localStorage.getItem(REMEMBER_KEY) ?? '';
  } catch {
    return '';
  }
}

export function AdminLoginPage() {
  const [email, setEmail] = useState(readRememberedEmail);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(() => readRememberedEmail() !== '');
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
      try {
        if (remember) localStorage.setItem(REMEMBER_KEY, email);
        else localStorage.removeItem(REMEMBER_KEY);
      } catch {
        // Storage unavailable; remembering the email is a convenience only.
      }
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
    <div className="admin-login">
      <aside className="admin-login__brand">
        <img className="admin-login__circle admin-login__circle--1" src={`${ASSET}bg-circle-1.svg`} alt="" aria-hidden="true" />
        <img className="admin-login__circle admin-login__circle--2" src={`${ASSET}bg-circle-2.svg`} alt="" aria-hidden="true" />
        <img className="admin-login__circle admin-login__circle--3" src={`${ASSET}bg-circle-3.svg`} alt="" aria-hidden="true" />

        <div className="admin-login__brand-logo-area">
          <Link to="/" className="admin-login__brand-logo">
            <img src={`${ASSET}logo.png`} alt="R.L. Klein Inc. & Associates" />
          </Link>
          <img className="admin-login__brand-divider" src={`${ASSET}brand-divider.svg`} alt="" aria-hidden="true" />
        </div>

        <div className="admin-login__brand-content">
          <div className="admin-login__tagline">
            <p className="admin-login__tagline-main">Connecting Compassion with Capability</p>
            <p className="admin-login__tagline-sub">
              The trusted healthcare staffing portal for clinicians, administrators, and HR professionals nationwide.
            </p>
          </div>

          <ul className="admin-login__features">
            {FEATURES.map((f) => (
              <li key={f.title} className="admin-login__feature">
                <span className="admin-login__feature-dot">
                  <img src={`${ASSET}${f.icon}`} alt="" aria-hidden="true" />
                </span>
                <span className="admin-login__feature-text">
                  <strong>{f.title}</strong>
                  <span>{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="admin-login__brand-footer">
          &copy; {new Date().getFullYear()} R.L. Klein Inc. &amp; Associates. All rights reserved.
        </p>
      </aside>

      <main className="admin-login__form-panel">
        <div className="admin-login__form-inner">
          <div className="admin-login__form-head">
            <Link to="/" className="admin-login__form-logo">
              <img src={`${ASSET}logo.png`} alt="R.L. Klein Inc. & Associates" />
            </Link>
            <div>
              <h1 className="admin-login__title">Welcome Back</h1>
              <p className="admin-login__subtitle">Sign in to your staffing portal</p>
            </div>
          </div>

          {localError && <div className="admin-login__error" role="alert">{localError}</div>}

          <form className="admin-login__form" onSubmit={handleSubmit} noValidate>
            <div className="admin-login__fields">
              <div className="admin-login__field">
                <label htmlFor="admin-email" className="admin-login__label">Email Address</label>
                <div className="admin-login__input">
                  <img src={`${ASSET}mail.svg`} alt="" aria-hidden="true" />
                  <input
                    id="admin-email"
                    type="email"
                    placeholder="name@organization.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="admin-login__field">
                <div className="admin-login__label-row">
                  <label htmlFor="admin-password" className="admin-login__label">Password</label>
                  <a
                    href="mailto:operations@rlklein.com?subject=Admin%20Portal%20Password%20Reset"
                    className="admin-login__forgot"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="admin-login__input">
                  <img src={`${ASSET}lock.svg`} alt="" aria-hidden="true" />
                  <input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="admin-login__toggle"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <Eye size={16} strokeWidth={2} />
                    ) : (
                      <img src={`${ASSET}eye-off.svg`} alt="" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <label className="admin-login__remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                <span className="admin-login__checkbox" aria-hidden="true">
                  <img src={`${ASSET}check.svg`} alt="" />
                </span>
                Keep me signed in for 30 days
              </label>
            </div>

            <button type="submit" disabled={isLoading} className="admin-login__submit">
              {isLoading ? 'Signing in...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="admin-login__signup">
            <div className="admin-login__divider">
              <img src={`${ASSET}divider-line.svg`} alt="" aria-hidden="true" />
              <span>New to the platform?</span>
              <img src={`${ASSET}divider-line.svg`} alt="" aria-hidden="true" />
            </div>
            <p className="admin-login__signup-text">
              Request access or{' '}
              <a href="mailto:operations@rlklein.com?subject=Admin%20Portal%20Access%20Request">create an account</a>
            </p>
          </div>

          {import.meta.env.DEV && (
            <button type="button" onClick={handleFillDemo} className="admin-login__demo">
              Development: autofill admin credentials
            </button>
          )}
        </div>

        <footer className="admin-login__meta">
          <p className="admin-login__meta-badges">
            <img src={`${ASSET}shield-footer.svg`} alt="" aria-hidden="true" />
            HIPAA-compliant • 256-bit SSL encrypted • SOC 2 Type II certified
          </p>
          <nav className="admin-login__legal" aria-label="Legal">
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/about/safety-compliance">HIPAA Notice</Link>
          </nav>
        </footer>
      </main>
    </div>
  );
}
