import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Briefcase, 
  PlusCircle, 
  Users, 
  LogOut, 
  ExternalLink,
  ChevronRight,
  FileText,
  Menu,
  X
} from 'lucide-react';

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`} aria-label="Admin Navigation">
        <div className="admin-sidebar__header">
          <Link to="/" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#fff' }}>
            <img className="admin-brand-logo" src="/rlklein-logo.png" alt="R.L. Klein Inc. & Associates" />
            <ExternalLink size={12} style={{ opacity: 0.6 }} />
          </Link>
          <div className="admin-sidebar__tag">Recruitment &amp; Staffing Admin</div>
        </div>

        <nav className="admin-sidebar__nav" onClick={() => setSidebarOpen(false)}>
          <NavLink 
            to="/admin/dashboard" 
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>

          <div style={{ padding: '16px 20px 6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#90A0B8', fontWeight: 600 }}>
            Job Management
          </div>

          <NavLink 
            to="/admin/jobs" 
            end
            className={({ isActive }) => `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`}
          >
            <Briefcase size={18} />
            <span>All Jobs</span>
          </NavLink>

          <NavLink 
            to="/admin/jobs/new" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`}
          >
            <PlusCircle size={18} />
            <span>Add New Job</span>
          </NavLink>

          <NavLink
            to="/admin/jobs?view=hot"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`}
          >
            <span aria-hidden="true">★</span>
            <span>Hot Jobs</span>
          </NavLink>

          <NavLink
            to="/admin/jobs?view=drafts"
            className={({ isActive }) => `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`}
          >
            <span aria-hidden="true">◷</span>
            <span>Drafts</span>
          </NavLink>

          <div style={{ padding: '16px 20px 6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#90A0B8', fontWeight: 600 }}>
            Applications
          </div>

          <NavLink 
            to="/admin/applications" 
            className={({ isActive }) => `admin-nav-item ${isActive ? 'admin-nav-item--active' : ''}`}
          >
            <Users size={18} />
            <span>Applications</span>
          </NavLink>

          <div style={{ padding: '16px 20px 6px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#90A0B8', fontWeight: 600 }}>
            Public Views
          </div>

          <Link to="/hot-jobs" target="_blank" className="admin-nav-item">
            <FileText size={18} />
            <span>Live Hot Jobs</span>
            <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
          </Link>
        </nav>

        <div className="admin-sidebar__footer">
          <div style={{ fontSize: '13px', color: '#CBD5E1', marginBottom: 8 }}>
            Logged in as: <strong style={{ color: '#fff' }}>{admin?.name || 'Administrator'}</strong>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn--outline-white btn--sm" 
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__title" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              type="button"
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label={sidebarOpen ? 'Close admin navigation' : 'Open admin navigation'}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>R.L. Klein Administrative Portal</span>
          </div>
          <div className="admin-topbar__account" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '13px', color: 'var(--color-gray-600)' }}>{admin?.email}</span>
            <span className="status-badge status-badge--published status-badge--sm">Active Admin</span>
          </div>
        </header>

        <main className="admin-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
