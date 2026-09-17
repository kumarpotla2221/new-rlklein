import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import type { Job, JobStatus, EmploymentType, ShiftType, CompensationType } from '../../types';
import { PROFESSIONS, STATES, WORK_SETTINGS, SPECIALTIES } from '../../data/jobs';
import { ArrowLeft, Save, Send } from 'lucide-react';

export function AdminJobEditorPage() {
  const { jobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(jobId);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    profession: 'Registered Nurse',
    specialty: '',
    state: 'California',
    city: '',
    facility: '',
    workSetting: 'Correctional Healthcare',
    employmentType: 'Full-Time' as EmploymentType,
    shift: 'Day' as ShiftType,
    hoursPerWeek: 40,
    startDate: '',
    assignmentDuration: 'Ongoing',
    compensationType: 'hourly' as CompensationType,
    compensationMin: 0,
    compensationMax: 0,
    showCompensation: false,
    overview: '',
    responsibilitiesText: '',
    qualificationsText: '',
    preferredQualificationsText: '',
    requiredCredentialsText: '',
    status: 'published' as JobStatus,
    featured: false,
  });

  useEffect(() => {
    async function loadJob() {
      if (!jobId) return;
      setLoading(true);
      try {
        const found = await jobService.getJobById(jobId);
        if (found) {
          setForm({
            title: found.title,
            profession: found.profession,
            specialty: found.specialty || '',
            state: found.state,
            city: found.city || '',
            facility: found.facility || '',
            workSetting: found.workSetting,
            employmentType: found.employmentType,
            shift: found.shift,
            hoursPerWeek: found.hoursPerWeek || 40,
            startDate: found.startDate || '',
            assignmentDuration: found.assignmentDuration || 'Ongoing',
            compensationType: found.compensationType || 'hourly',
            compensationMin: found.compensationMin || 0,
            compensationMax: found.compensationMax || 0,
            showCompensation: Boolean(found.showCompensation),
            overview: found.overview,
            responsibilitiesText: (found.responsibilities || []).join('\n'),
            qualificationsText: (found.qualifications || []).join('\n'),
            preferredQualificationsText: (found.preferredQualifications || []).join('\n'),
            requiredCredentialsText: (found.requiredCredentials || []).join('\n'),
            status: found.status,
            featured: Boolean(found.featured),
          });
        } else {
          setErrorMessage('Job not found.');
        }
      } catch (err) {
        console.error('Error loading job', err);
        setErrorMessage('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setForm((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async (overrideStatus?: JobStatus) => {
    if (!form.title.trim()) {
      alert('Please enter a Job Title.');
      return;
    }
    if (!form.overview.trim()) {
      alert('Please provide a Position Overview / Description.');
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    const parseLines = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean);
    const status = overrideStatus || form.status;

    const payload = {
      title: form.title,
      profession: form.profession,
      specialty: form.specialty,
      state: form.state,
      city: form.city || 'Multiple Locations',
      facility: form.facility,
      workSetting: form.workSetting,
      employmentType: form.employmentType,
      shift: form.shift,
      hoursPerWeek: form.hoursPerWeek,
      startDate: form.startDate,
      assignmentDuration: form.assignmentDuration,
      compensationType: form.compensationType,
      compensationMin: form.compensationMin > 0 ? form.compensationMin : undefined,
      compensationMax: form.compensationMax > 0 ? form.compensationMax : undefined,
      showCompensation: form.showCompensation,
      overview: form.overview,
      responsibilities: parseLines(form.responsibilitiesText),
      qualifications: parseLines(form.qualificationsText),
      preferredQualifications: parseLines(form.preferredQualificationsText),
      requiredCredentials: parseLines(form.requiredCredentialsText),
      status,
      featured: status === 'published' ? true : form.featured,
    };

    try {
      if (isEditing && jobId) {
        await jobService.updateJob(jobId, payload);
      } else {
        await jobService.createJob(payload);
      }
      navigate('/admin/jobs');
    } catch (err) {
      console.error('Save error', err);
      setErrorMessage('Failed to save job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: 'center' }}>Loading position data...</div>;
  }

  return (
    <div className="admin-job-editor" style={{ maxWidth: 960 }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/admin/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '13px', color: 'var(--color-navy)' }}>
          <ArrowLeft size={14} />
          <span>Back to All Jobs</span>
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '26px', color: 'var(--color-navy)', marginBottom: 4 }}>
            {isEditing ? 'Edit Job Posting' : 'Add New Job Posting'}
          </h1>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-500)' }}>
            Jobs published here automatically appear in public search and candidate application flows.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={submitting}
            className="btn btn--secondary btn--sm"
          >
            <Save size={15} />
            <span>Save as Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={submitting}
            className="btn btn--primary btn--sm"
          >
            <Send size={15} />
            <span>{isEditing ? 'Update & Publish' : 'Publish Job'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', padding: '12px 16px', borderRadius: 4, marginBottom: 20 }}>
          {errorMessage}
        </div>
      )}

      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="admin-card" style={{ padding: 36 }}>
        {/* 1. JOB INFORMATION */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            1. Job Information
          </h3>
          <div className="form-group">
            <label htmlFor="title" className="form-label form-label--required">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="e.g. Registered Nurse — Correctional Healthcare"
              className="form-input"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profession" className="form-label form-label--required">Profession</label>
              <select
                id="profession"
                name="profession"
                className="form-select"
                value={form.profession}
                onChange={handleChange}
              >
                {PROFESSIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="specialty" className="form-label">Specialty</label>
              <input
                type="text"
                id="specialty"
                name="specialty"
                placeholder="e.g. Primary Care, Psychiatry"
                className="form-input"
                value={form.specialty}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* 2. LOCATION & SETTING */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            2. Location &amp; Setting
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="state" className="form-label form-label--required">State</label>
              <select
                id="state"
                name="state"
                className="form-select"
                value={form.state}
                onChange={handleChange}
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="city" className="form-label">City / Region</label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="e.g. Multiple Locations, Sacramento"
                className="form-input"
                value={form.city}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="workSetting" className="form-label">Work Setting</label>
              <select
                id="workSetting"
                name="workSetting"
                className="form-select"
                value={form.workSetting}
                onChange={handleChange}
              >
                {WORK_SETTINGS.map((ws) => (
                  <option key={ws} value={ws}>{ws}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="facility" className="form-label">Facility / Organization (Optional)</label>
              <input
                type="text"
                id="facility"
                name="facility"
                placeholder="e.g. California Dept of Corrections"
                className="form-input"
                value={form.facility}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* 3. ASSIGNMENT SCHEDULE */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            3. Assignment &amp; Schedule
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="employmentType" className="form-label">Employment Type</label>
              <select
                id="employmentType"
                name="employmentType"
                className="form-select"
                value={form.employmentType}
                onChange={handleChange}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Per Diem">Per Diem</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="shift" className="form-label">Shift</label>
              <select
                id="shift"
                name="shift"
                className="form-select"
                value={form.shift}
                onChange={handleChange}
              >
                <option value="Day">Day Shift</option>
                <option value="Evening">Evening Shift</option>
                <option value="Night">Night Shift</option>
                <option value="Rotating">Rotating Shift</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hoursPerWeek" className="form-label">Hours Per Week</label>
              <input
                type="number"
                id="hoursPerWeek"
                name="hoursPerWeek"
                className="form-input"
                value={form.hoursPerWeek}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">Anticipated Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-input"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* 4. COMPENSATION */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            4. Compensation (Only publish if approved)
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="compensationMin" className="form-label">Min Rate ($)</label>
              <input
                type="number"
                id="compensationMin"
                name="compensationMin"
                placeholder="45"
                className="form-input"
                value={form.compensationMin || ''}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="compensationMax" className="form-label">Max Rate ($)</label>
              <input
                type="number"
                id="compensationMax"
                name="compensationMax"
                placeholder="65"
                className="form-input"
                value={form.compensationMax || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={{ marginTop: 8 }}>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="showCompensation"
                className="form-checkbox"
                checked={form.showCompensation}
                onChange={handleChange}
              />
              <span>Display compensation publicly on job cards and position details</span>
            </label>
          </div>
        </div>

        {/* 5. DESCRIPTION & RESPONSIBILITIES */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            5. Position Overview &amp; Responsibilities
          </h3>
          <div className="form-group">
            <label htmlFor="overview" className="form-label form-label--required">Position Overview</label>
            <textarea
              id="overview"
              name="overview"
              rows={4}
              placeholder="Comprehensive summary of the role, patient population, and facility context..."
              className="form-textarea"
              value={form.overview}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="responsibilitiesText" className="form-label">Responsibilities (one per line)</label>
            <textarea
              id="responsibilitiesText"
              name="responsibilitiesText"
              rows={5}
              placeholder="Direct patient care assessment&#10;Medication administration&#10;Collaboration with interdisciplinary team"
              className="form-textarea"
              value={form.responsibilitiesText}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 6. QUALIFICATIONS & CREDENTIALS */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            6. Qualifications &amp; Required Credentials
          </h3>
          <div className="form-group">
            <label htmlFor="qualificationsText" className="form-label">Required Qualifications (one per line)</label>
            <textarea
              id="qualificationsText"
              name="qualificationsText"
              rows={4}
              placeholder="Current unrestricted state license&#10;Minimum 2 years experience"
              className="form-textarea"
              value={form.qualificationsText}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="requiredCredentialsText" className="form-label">Required Credentials (one per line)</label>
            <textarea
              id="requiredCredentialsText"
              name="requiredCredentialsText"
              rows={3}
              placeholder="Current California RN License&#10;BLS/CPR Certification&#10;Valid government photo ID"
              className="form-textarea"
              value={form.requiredCredentialsText}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 7. PUBLISHING SETTINGS */}
        <div style={{ marginBottom: 32, backgroundColor: 'var(--color-off-white)', padding: 20, borderRadius: 8 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', marginBottom: 16 }}>
            7. Publishing &amp; Feature Flags
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status" className="form-label">Job Status</label>
              <select
                id="status"
                name="status"
                className="form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="published">Published (Visible on /hot-jobs)</option>
                <option value="draft">Draft (Hidden from public)</option>
                <option value="paused">Paused (Temporarily hidden)</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  name="featured"
                  className="form-checkbox"
                  checked={form.featured}
                  onChange={handleChange}
                />
                <span><strong>Featured Opportunity</strong> (Eligible for Homepage Hot Jobs)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid var(--color-gray-200)' }}>
          <Link to="/admin/jobs" className="btn btn--ghost btn--md">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="btn btn--primary btn--md"
          >
            <Send size={16} />
            <span>{isEditing ? 'Save Changes' : 'Publish Job'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
