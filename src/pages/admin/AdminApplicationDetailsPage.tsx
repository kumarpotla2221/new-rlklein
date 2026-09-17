import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import type { Application, ApplicationStatus } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Download, 
  ShieldCheck, 
  Save, 
  Clock 
} from 'lucide-react';

const ALL_STATUSES: ApplicationStatus[] = [
  'new',
  'under-review',
  'credentialing',
  'shortlisted',
  'interview',
  'hired',
  'rejected',
];

export function AdminApplicationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<ApplicationStatus>('new');
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    async function loadApp() {
      if (!id) return;
      setLoading(true);
      try {
        const found = await applicationService.getApplicationById(id);
        if (found) {
          setApp(found);
          setStatus(found.status);
        }
      } catch (err) {
        console.error('Error fetching application', err);
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, [id]);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!id) return;
    setStatus(newStatus);
    try {
      await applicationService.updateApplicationStatus(id, newStatus);
      setFeedbackMsg(`Application status updated to "${newStatus}".`);
      setTimeout(() => setFeedbackMsg(null), 3000);
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleAddNote = async () => {
    if (!id || !newNote.trim()) return;
    setSavingNote(true);
    try {
      const updated = await applicationService.addAdminNote(id, newNote.trim());
      if (updated) {
        setApp(updated);
        setNewNote('');
        setFeedbackMsg('Internal note recorded.');
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    } catch (err) {
      console.error('Failed to save note', err);
    } finally {
      setSavingNote(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading application details...</div>;
  }

  if (!app) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Application Not Found</h2>
        <Link to="/admin/applications" className="btn btn--primary btn--sm" style={{ marginTop: 16 }}>
          Return to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-app-details" style={{ maxWidth: 1000 }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/admin/applications" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '13px', color: 'var(--color-navy)' }}>
          <ArrowLeft size={14} />
          <span>Back to Applications</span>
        </Link>
      </div>

      {feedbackMsg && (
        <div style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', padding: '12px 16px', borderRadius: 4, marginBottom: 20, fontSize: '14px' }}>
          {feedbackMsg}
        </div>
      )}

      {/* Header Banner */}
      <div className="admin-card" style={{ padding: '24px 32px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <h1 style={{ fontSize: '24px', color: 'var(--color-navy)' }}>
              {app.firstName} {app.lastName}
            </h1>
            <StatusBadge status={status} />
          </div>
          <div style={{ fontSize: '13px', color: 'var(--color-gray-500)', fontFamily: 'monospace' }}>
            Reference: {app.referenceNumber} &middot; Applied on {new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        {/* Status Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <label htmlFor="status-select" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-gray-700)' }}>
            Workflow Status:
          </label>
          <select
            id="status-select"
            className="job-select"
            style={{ width: 'auto', minWidth: 160 }}
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
          >
            {ALL_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st.replace('-', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 24, alignItems: 'flex-start' }}>
        {/* Left Column: Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Position Applied For */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', marginBottom: 12, borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 8 }}>
              Position Applied For
            </h3>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-navy)' }}>
              {app.jobTitle}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginTop: 4 }}>
              Job ID: {app.jobId}
            </div>
          </div>

          {/* Contact Information */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', marginBottom: 16, borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 8 }}>
              Contact Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '14px' }}>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>Email</span>
                <a href={`mailto:${app.email}`} style={{ color: 'var(--color-violet)', fontWeight: 500 }}>
                  {app.email}
                </a>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>Phone</span>
                <a href={`tel:${app.phone}`} style={{ color: 'var(--color-gray-800)', fontWeight: 500 }}>
                  {app.phone}
                </a>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>City, State</span>
                <span style={{ color: 'var(--color-gray-800)' }}>
                  {app.city ? `${app.city}, ` : ''}{app.state || 'Not specified'}
                </span>
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', marginBottom: 16, borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 8 }}>
              Professional Information &amp; Licensure
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '14px' }}>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>Primary Profession</span>
                <strong>{app.profession}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>Specialty</span>
                <span>{app.specialty || 'General'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>Years Experience</span>
                <span>{app.yearsExperience ? `${app.yearsExperience} years` : 'Not specified'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>License Number &amp; State</span>
                <span>{app.licenseNumber || 'Not entered'} ({app.licenseState || '—'})</span>
              </div>
            </div>
          </div>

          {/* Opportunity Preferences */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', marginBottom: 16, borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 8 }}>
              Opportunity Preferences
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: '14px' }}>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>Assignment Type</span>
                <span>{app.assignmentType || 'Flexible'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>Preferred Shift</span>
                <span>{app.preferredShift || 'Flexible'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>Preferred Location</span>
                <span>{app.preferredLocation || 'Any'}</span>
              </div>
              <div>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px' }}>Available Start Date</span>
                <span>{app.availableStartDate || 'Immediate'}</span>
              </div>
            </div>

            {app.message && (
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--color-gray-100)' }}>
                <span style={{ color: 'var(--color-gray-500)', display: 'block', fontSize: '12px', marginBottom: 4 }}>
                  Applicant Message / Notes
                </span>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--color-gray-700)', backgroundColor: 'var(--color-off-white)', padding: 12, borderRadius: 6 }}>
                  {app.message}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Documents & Internal Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Documents */}
          <div className="admin-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: '16px', color: 'var(--color-navy)', marginBottom: 16, borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 8 }}>
              Documents
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: 'var(--color-off-white)', borderRadius: 6, border: '1px solid var(--color-gray-200)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FileText size={22} style={{ color: 'var(--color-violet)' }} />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-navy)' }}>
                    {app.resumeFileName || 'Resume Document'}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-gray-500)' }}>Uploaded with submission</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert(`Simulated download for: ${app.resumeFileName || 'resume.pdf'}`)}
                className="btn btn--ghost btn--sm"
                title="Download Resume"
              >
                <Download size={16} />
              </button>
            </div>
          </div>

          {/* Internal Notes (Admin Only) */}
          <div className="admin-card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <ShieldCheck size={18} style={{ color: 'var(--color-violet)' }} />
              <h3 style={{ fontSize: '16px', color: 'var(--color-navy)' }}>Internal Recruiter Notes</h3>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-gray-500)', marginBottom: 16 }}>
              These internal notes are confidential and NEVER visible to the applicant.
            </p>

            {/* Existing Notes */}
            {app.adminNotes ? (
              <div style={{ whiteSpace: 'pre-wrap', fontSize: '13px', lineHeight: 1.6, color: 'var(--color-gray-700)', backgroundColor: 'var(--color-off-white)', padding: 12, borderRadius: 6, marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
                {app.adminNotes}
              </div>
            ) : (
              <div style={{ fontSize: '13px', color: 'var(--color-gray-400)', fontStyle: 'italic', marginBottom: 16 }}>
                No internal notes recorded yet.
              </div>
            )}

            {/* Add Note */}
            <div className="form-group">
              <label htmlFor="new-note" className="sr-only">Add Internal Note</label>
              <textarea
                id="new-note"
                rows={3}
                placeholder="Add screening observation, interview feedback, or credential verification notes..."
                className="form-textarea"
                style={{ fontSize: '13px' }}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>
            <button
              type="button"
              disabled={savingNote || !newNote.trim()}
              onClick={handleAddNote}
              className="btn btn--primary btn--sm"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Save size={14} />
              <span>{savingNote ? 'Saving Note...' : 'Record Note'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
