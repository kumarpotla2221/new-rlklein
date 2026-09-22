import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import type { Job, JobStatus, JobVisibility, EmploymentType, ShiftType, CompensationType } from '../../types';
import { PROFESSIONS, STATES, WORK_SETTINGS, SPECIALTIES, SHIFT_PATTERNS, CONTRACT_TYPES, PAY_FREQUENCIES, STATE_ABBREVIATIONS } from '../../data/jobs';
import { ArrowLeft, Save, Send, Eye } from 'lucide-react';
import { JobDetailsModal } from '../../components/jobs/JobDetailsModal';

export function AdminJobEditorPage() {
  const { jobId } = useParams<{ jobId?: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(jobId);

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [form, setForm] = useState({
    // 1. Job Information
    title: '',
    employmentType: 'Full-Time' as EmploymentType,
    profession: 'Registered Nurse',
    specialty: '',
    customJobId: '',
    // 2. Location & Setting
    state: 'California',
    city: '',
    workSetting: 'Correctional Healthcare',
    facility: '',
    country: 'United States',
    // 3. Shift Details
    shift: 'Day' as ShiftType,
    shiftsPerWeek: '' as number | '',
    hoursPerWeek: 40,
    shiftPattern: '',
    // 4. Job Order Details
    startDate: '',
    endDate: '',
    assignmentDuration: 'Ongoing',
    contractType: '',
    extensionAvailable: false,
    assignmentTerm: '',
    // 5. Compensation
    compensationType: 'hourly' as CompensationType,
    compensationMin: 0,
    compensationMax: 0,
    payFrequency: '',
    showCompensation: false,
    // 6. Job Description
    overview: '',
    // 7. Responsibilities
    responsibilitiesText: '',
    // 8. Qualifications & Credentials
    qualificationsText: '',
    preferredQualificationsText: '',
    requiredCredentialsText: '',
    // 9. Benefits
    benefitsText: '',
    // 10. Staffing Agency Details
    agencyName: '',
    agencyLocation: '',
    agencyExperience: '',
    agencySupport: '',
    agencyCertifications: '',
    // 11. Client Details
    facilityType: '',
    // 12. Job Board Disclaimer
    jobBoardDisclaimer: '',
    // 13. Publishing & Feature Flags
    status: 'published' as JobStatus,
    featured: false,
    visibility: 'public' as JobVisibility,
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
            employmentType: found.employmentType,
            profession: found.profession,
            specialty: found.specialty || '',
            customJobId: found.id,
            state: found.state,
            city: found.city || '',
            workSetting: found.workSetting,
            facility: found.facility || '',
            country: found.country || 'United States',
            shift: found.shift,
            shiftsPerWeek: found.shiftsPerWeek ?? '',
            hoursPerWeek: found.hoursPerWeek || 40,
            shiftPattern: found.shiftPattern || '',
            startDate: found.startDate || '',
            endDate: found.endDate || '',
            assignmentDuration: found.assignmentDuration || 'Ongoing',
            contractType: found.contractType || '',
            extensionAvailable: Boolean(found.extensionAvailable),
            assignmentTerm: found.assignmentTerm || '',
            compensationType: found.compensationType || 'hourly',
            compensationMin: found.compensationMin || 0,
            compensationMax: found.compensationMax || 0,
            payFrequency: found.payFrequency || '',
            showCompensation: Boolean(found.showCompensation),
            overview: found.overview,
            responsibilitiesText: (found.responsibilities || []).join('\n'),
            qualificationsText: (found.qualifications || []).join('\n'),
            preferredQualificationsText: (found.preferredQualifications || []).join('\n'),
            requiredCredentialsText: (found.requiredCredentials || []).join('\n'),
            benefitsText: (found.benefits || []).join('\n'),
            agencyName: found.agencyName || '',
            agencyLocation: found.agencyLocation || '',
            agencyExperience: found.agencyExperience || '',
            agencySupport: found.agencySupport || '',
            agencyCertifications: found.agencyCertifications || '',
            facilityType: found.facilityType || '',
            jobBoardDisclaimer: found.jobBoardDisclaimer || '',
            status: found.status,
            featured: Boolean(found.featured),
            visibility: found.visibility || 'public',
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
      setForm((prev) => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const parseLines = (text: string) => text.split('\n').map((l) => l.trim()).filter(Boolean);

  const buildPayload = (overrideStatus?: JobStatus) => {
    const status = overrideStatus || form.status;
    return {
      title: form.title,
      profession: form.profession,
      specialty: form.specialty,
      state: form.state,
      city: form.city || 'Multiple Locations',
      country: form.country,
      facility: form.facility,
      facilityType: form.facilityType,
      workSetting: form.workSetting,
      employmentType: form.employmentType,
      shift: form.shift,
      shiftsPerWeek: form.shiftsPerWeek === '' ? undefined : form.shiftsPerWeek,
      shiftPattern: form.shiftPattern,
      hoursPerWeek: form.hoursPerWeek,
      startDate: form.startDate,
      endDate: form.endDate,
      assignmentDuration: form.assignmentDuration,
      assignmentTerm: form.assignmentTerm,
      contractType: form.contractType,
      extensionAvailable: form.extensionAvailable,
      compensationType: form.compensationType,
      compensationMin: form.compensationMin > 0 ? form.compensationMin : undefined,
      compensationMax: form.compensationMax > 0 ? form.compensationMax : undefined,
      payFrequency: form.payFrequency,
      showCompensation: form.showCompensation,
      overview: form.overview,
      responsibilities: parseLines(form.responsibilitiesText),
      qualifications: parseLines(form.qualificationsText),
      preferredQualifications: parseLines(form.preferredQualificationsText),
      requiredCredentials: parseLines(form.requiredCredentialsText),
      benefits: parseLines(form.benefitsText),
      agencyName: form.agencyName,
      agencyLocation: form.agencyLocation,
      agencyExperience: form.agencyExperience,
      agencySupport: form.agencySupport,
      agencyCertifications: form.agencyCertifications,
      jobBoardDisclaimer: form.jobBoardDisclaimer,
      status,
      featured: status === 'published' ? form.featured : form.featured,
      visibility: form.visibility,
    };
  };

  const previewJob: Job = {
    id: form.customJobId.trim() || 'PREVIEW',
    slug: 'preview',
    postedDate: new Date().toISOString().split('T')[0],
    applicationCount: 0,
    ...buildPayload(),
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

    const payload = buildPayload(overrideStatus);

    try {
      if (isEditing && jobId) {
        await jobService.updateJob(jobId, payload);
      } else {
        await jobService.createJob({ ...payload, id: form.customJobId.trim() || undefined });
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
            Jobs published here automatically appear in public search and candidate application flows, including Find Your Next Role.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
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
            onClick={() => setPreviewOpen(true)}
            disabled={!form.title.trim()}
            className="btn btn--ghost btn--sm"
          >
            <Eye size={15} />
            <span>Preview Job</span>
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
              <label htmlFor="employmentType" className="form-label">Job Type</label>
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
          </div>

          <div className="form-row">
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
            <div className="form-group">
              <label htmlFor="customJobId" className="form-label">Job ID (Optional)</label>
              <input
                type="text"
                id="customJobId"
                name="customJobId"
                placeholder="Auto-generated if left blank"
                className="form-input"
                value={form.customJobId}
                onChange={handleChange}
                disabled={isEditing}
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

          <div className="form-group">
            <label htmlFor="country" className="form-label">Country</label>
            <input
              type="text"
              id="country"
              name="country"
              className="form-input"
              value={form.country}
              onChange={handleChange}
              style={{ maxWidth: 320 }}
            />
          </div>
        </div>

        {/* 3. SHIFT DETAILS */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            3. Shift Details
          </h3>
          <div className="form-row">
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
            <div className="form-group">
              <label htmlFor="shiftsPerWeek" className="form-label">Shifts Per Week</label>
              <input
                type="number"
                id="shiftsPerWeek"
                name="shiftsPerWeek"
                placeholder="e.g. 4"
                className="form-input"
                value={form.shiftsPerWeek}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hoursPerWeek" className="form-label">Scheduled Hours / Week</label>
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
              <label htmlFor="shiftPattern" className="form-label">Shift Type</label>
              <select
                id="shiftPattern"
                name="shiftPattern"
                className="form-select"
                value={form.shiftPattern}
                onChange={handleChange}
              >
                <option value="">Not specified</option>
                {SHIFT_PATTERNS.map((sp) => (
                  <option key={sp} value={sp}>{sp}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 4. JOB ORDER DETAILS */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            4. Job Order Details
          </h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-input"
                value={form.startDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="endDate" className="form-label">End Date (Optional)</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-input"
                value={form.endDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="assignmentDuration" className="form-label">Duration</label>
              <input
                type="text"
                id="assignmentDuration"
                name="assignmentDuration"
                placeholder="e.g. 13 Week(s), Ongoing"
                className="form-input"
                value={form.assignmentDuration}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="contractType" className="form-label">Contract Type</label>
              <select
                id="contractType"
                name="contractType"
                className="form-select"
                value={form.contractType}
                onChange={handleChange}
              >
                <option value="">Not specified</option>
                {CONTRACT_TYPES.map((ct) => (
                  <option key={ct} value={ct}>{ct}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: 28 }}>
              <label className="form-checkbox-label">
                <input
                  type="checkbox"
                  name="extensionAvailable"
                  className="form-checkbox"
                  checked={form.extensionAvailable}
                  onChange={handleChange}
                />
                <span>Extension Available</span>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="assignmentTerm" className="form-label">Assignment Term (Optional override)</label>
              <input
                type="text"
                id="assignmentTerm"
                name="assignmentTerm"
                placeholder="e.g. 13-week contract with potential for extension"
                className="form-input"
                value={form.assignmentTerm}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* 5. COMPENSATION */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            5. Compensation (Only publish if approved)
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

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="compensationType" className="form-label">Pay Unit</label>
              <select
                id="compensationType"
                name="compensationType"
                className="form-select"
                value={form.compensationType}
                onChange={handleChange}
              >
                <option value="hourly">Hourly</option>
                <option value="weekly">Weekly</option>
                <option value="salary">Salary</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="payFrequency" className="form-label">Pay Frequency</label>
              <select
                id="payFrequency"
                name="payFrequency"
                className="form-select"
                value={form.payFrequency}
                onChange={handleChange}
              >
                <option value="">Not specified</option>
                {PAY_FREQUENCIES.map((pf) => (
                  <option key={pf} value={pf}>{pf}</option>
                ))}
              </select>
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

        {/* 6. JOB DESCRIPTION */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            6. Job Description
          </h3>
          <div style={{ backgroundColor: 'var(--color-off-white)', border: '1px solid var(--color-gray-200)', borderRadius: 6, padding: '14px 16px', marginBottom: 16, fontSize: '13px', color: 'var(--color-gray-600)', lineHeight: 1.7 }}>
            <div><strong style={{ color: 'var(--color-navy)' }}>Job Title:</strong> {form.title || '—'}</div>
            <div><strong style={{ color: 'var(--color-navy)' }}>Location:</strong> {form.city || '—'}{form.city ? ', ' : ''}{STATE_ABBREVIATIONS[form.state] || form.state}</div>
            <div><strong style={{ color: 'var(--color-navy)' }}>Schedule:</strong> {form.shift} Shift{form.hoursPerWeek ? ` (${form.hoursPerWeek} hrs/week)` : ''}</div>
            <div><strong style={{ color: 'var(--color-navy)' }}>Term:</strong> {form.assignmentTerm || form.assignmentDuration || 'Ongoing'}</div>
            {form.showCompensation && form.compensationMin > 0 && form.compensationMax > 0 && (
              <div><strong style={{ color: 'var(--color-navy)' }}>Pay Rate:</strong> ${form.compensationMin} – ${form.compensationMax} / {form.compensationType}</div>
            )}
            <div style={{ marginTop: 6, fontStyle: 'italic' }}>These lines are generated automatically from the fields above and shown to candidates in the job details popup.</div>
          </div>
          <div className="form-group">
            <label htmlFor="overview" className="form-label form-label--required">Description</label>
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
        </div>

        {/* 7. RESPONSIBILITIES */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            7. Responsibilities
          </h3>
          <div className="form-group">
            <label htmlFor="responsibilitiesText" className="form-label">Add Responsibility (one per line)</label>
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

        {/* 8. QUALIFICATIONS & CREDENTIALS */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            8. Qualifications &amp; Credentials
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

        {/* 9. BENEFITS */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            9. Benefits
          </h3>
          <div className="form-group">
            <label htmlFor="benefitsText" className="form-label">Add Benefit (one per line)</label>
            <textarea
              id="benefitsText"
              name="benefitsText"
              rows={4}
              placeholder="Weekly pay&#10;Medical / Dental / Vision insurance&#10;401(k) retirement plan"
              className="form-textarea"
              value={form.benefitsText}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 10. STAFFING AGENCY DETAILS */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            10. Staffing Agency Details
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginBottom: 16 }}>
            Optional — leave blank to use R.L. Klein &amp; Associates' standard agency details on the job posting.
          </p>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="agencyName" className="form-label">Agency Name</label>
              <input type="text" id="agencyName" name="agencyName" placeholder="R.L. Klein & Associates" className="form-input" value={form.agencyName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label htmlFor="agencyLocation" className="form-label">Agency Location</label>
              <input type="text" id="agencyLocation" name="agencyLocation" placeholder="Rolling Hills Estates, California" className="form-input" value={form.agencyLocation} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="agencyExperience" className="form-label">Experience</label>
            <input type="text" id="agencyExperience" name="agencyExperience" placeholder="Over 40 years of specialized healthcare staffing experience" className="form-input" value={form.agencyExperience} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="agencySupport" className="form-label">Support</label>
            <input type="text" id="agencySupport" name="agencySupport" placeholder="Dedicated recruiter support, direct payroll coordination..." className="form-input" value={form.agencySupport} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="agencyCertifications" className="form-label">Certifications / Affiliations</label>
            <input type="text" id="agencyCertifications" name="agencyCertifications" placeholder="Certified SBE / MBE / LSBE / NMSDC business enterprise" className="form-input" value={form.agencyCertifications} onChange={handleChange} />
          </div>
        </div>

        {/* 11. CLIENT DETAILS */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            11. Client Details
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-gray-500)', marginBottom: 16 }}>
            City, state, and client / facility name are captured in Section 2 (Location &amp; Setting).
          </p>
          <div className="form-group">
            <label htmlFor="facilityType" className="form-label">Facility Type</label>
            <input
              type="text"
              id="facilityType"
              name="facilityType"
              placeholder="e.g. Level II Trauma Center, State Correctional Institution"
              className="form-input"
              value={form.facilityType}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 12. JOB BOARD DISCLAIMER */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
            12. Job Board Disclaimer
          </h3>
          <div className="form-group">
            <label htmlFor="jobBoardDisclaimer" className="form-label">Disclaimer (Optional override)</label>
            <textarea
              id="jobBoardDisclaimer"
              name="jobBoardDisclaimer"
              rows={3}
              placeholder="Job listings on this board are posted by R.L. Klein & Associates and are subject to change or removal at any time without notice. Please call us at 562-427-5577 or visit www.rlklein.com for more information."
              className="form-textarea"
              value={form.jobBoardDisclaimer}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 13. PUBLISHING & FEATURE FLAGS */}
        <div style={{ marginBottom: 32, backgroundColor: 'var(--color-off-white)', padding: 20, borderRadius: 8 }}>
          <h3 style={{ fontSize: '18px', color: 'var(--color-navy)', marginBottom: 16 }}>
            13. Publishing &amp; Feature Flags
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
                <option value="published">Published (Visible on job boards)</option>
                <option value="draft">Draft (Hidden from public)</option>
                <option value="paused">Paused (Temporarily hidden)</option>
                <option value="expired">Expired</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="visibility" className="form-label">Job Visibility</label>
              <select
                id="visibility"
                name="visibility"
                className="form-select"
                value={form.visibility}
                onChange={handleChange}
              >
                <option value="public">Public (Listed on job boards)</option>
                <option value="unlisted">Unlisted (Reachable by direct link only)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center' }}>
            <label className="form-checkbox-label">
              <input
                type="checkbox"
                name="featured"
                className="form-checkbox"
                checked={form.featured}
                onChange={handleChange}
              />
              <span><strong>Publish to Find Your Next Role</strong> (Featured opportunity)</span>
            </label>
          </div>
        </div>

        {/* Bottom Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 16, borderTop: '1px solid var(--color-gray-200)' }}>
          <Link to="/admin/jobs" className="btn btn--ghost btn--md">
            Cancel
          </Link>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={submitting}
            className="btn btn--secondary btn--md"
          >
            <Save size={16} />
            <span>Save as Draft</span>
          </button>
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

      {previewOpen && (
        <JobDetailsModal job={previewJob} onClose={() => setPreviewOpen(false)} readOnly />
      )}
    </div>
  );
}
