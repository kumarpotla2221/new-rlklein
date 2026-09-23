import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { User, KeyRound } from 'lucide-react';

const REMEMBER_KEY = 'rlk_admin_remembered_email';

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
      <div className="admin-login__card">
        <svg className="admin-login__panel" viewBox="0 0 750 435" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 0 H385 C 420 90, 440 170, 445 250 C 450 330, 470 400, 490 435 H0 Z" />
        </svg>

        <svg className="admin-login__decor" viewBox="0 0 360 435" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <defs>
            <linearGradient id="admin-login-orb" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1E2170" />
              <stop offset="100%" stopColor="#3A43B8" />
            </linearGradient>
            <linearGradient id="admin-login-moon" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2A2E8E" />
              <stop offset="100%" stopColor="#1B1E66" />
            </linearGradient>
          </defs>
          <circle cx="170" cy="96" r="32" fill="url(#admin-login-orb)" />
          <path d="M262 113 a 92 92 0 0 1 0 184 C 226 255, 228 155, 262 113 Z" fill="url(#admin-login-moon)" />
          <g fill="none" stroke="#4E62D8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M48 48 C 56 26, 70 26, 76 40 S 96 54, 104 32" strokeWidth="5" />
            <circle cx="185" cy="24" r="18" />
            <path d="M285 88 l -8 16 h 16 Z" />
            <circle cx="82" cy="187" r="7" />
            <path d="M132 158 v 30 M117 173 h 30" />
            <circle cx="262" cy="205" r="92" />
            <circle cx="292" cy="160" r="8" />
            <path d="M334 318 v 24 M322 330 h 24" />
            <path d="M162 322 c 10 -6, 12 4, 4 8 s -6 12, 6 8" />
            <circle cx="296" cy="352" r="7" />
            <path d="M160 390 l 16 8 l -14 10 Z" />
            <path d="M305 385 v 22 M294 396 h 22" />
          </g>
        </svg>

        <main className="admin-login__form-side">
          <h1 className="sr-only">Admin Sign In</h1>
          <Link to="/" className="admin-login__logo-link">
            <img className="admin-login__logo" src={`${import.meta.env.BASE_URL}rlklein-logo.png`} alt="R.L. Klein Inc. & Associates" />
          </Link>

          {localError && <div className="admin-login__error" role="alert">{localError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <label className="admin-login__field">
              <User size={16} className="admin-login__icon" />
              <span className="sr-only">Email</span>
              <input
                type="email"
                placeholder="admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </label>

            <label className="admin-login__field">
              <KeyRound size={16} className="admin-login__icon" />
              <span className="sr-only">Password</span>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </label>

            <button type="submit" disabled={isLoading} className="admin-login__submit">
              {isLoading ? 'Signing in...' : 'Login'}
            </button>

            <div className="admin-login__row">
              <label className="admin-login__remember">
                <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                Remember
              </label>
              <Link to="/" className="admin-login__link">Public Website</Link>
            </div>

            <a
              href="mailto:operations@rlklein.com?subject=Admin%20Portal%20Password%20Reset"
              className="admin-login__forgot"
            >
              Forgot Password?
            </a>
          </form>

          {import.meta.env.DEV && (
            <button type="button" onClick={handleFillDemo} className="admin-login__demo">
              Development: autofill admin credentials
            </button>
          )}

          <p className="admin-login__copyright">
            Copyright &copy;{new Date().getFullYear()} R.L. Klein &amp; Associates Inc. All rights reserved
          </p>
        </main>
      </div>
    </div>
  );
}
