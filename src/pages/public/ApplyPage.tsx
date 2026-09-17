import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import type { Job, Application } from '../../types';
import { Breadcrumbs } from '../../components/ui/Typography';
import { PROFESSIONS, STATES } from '../../data/jobs';
import { CheckCircle, UploadCloud, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export function ApplyPage() {
  const { jobId } = useParams<{ jobId?: string }>();
  const [associatedJob, setAssociatedJob] = useState<Job | null>(null);
  const [loadingJob, setLoadingJob] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState<Application | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    profession: '',
    yearsExperience: '',
    licenseNumber: '',
    licenseState: '',
    specialty: '',
    assignmentType: 'Full-Time',
    preferredLocation: '',
    preferredShift: 'Day',
    availableStartDate: '',
    message: '',
    consent: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadJob() {
      if (!jobId) return;
      setLoadingJob(true);
      try {
        const found = await jobService.getJobById(jobId);
        if (found) {
          setAssociatedJob(found);
          setFormData((prev) => ({
            ...prev,
            profession: prev.profession || found.profession,
            specialty: prev.specialty || found.specialty,
            assignmentType: found.employmentType || 'Full-Time',
          }));
        }
      } catch (err) {
        console.error('Error finding job for application', err);
      } finally {
        setLoadingJob(false);
      }
    }
    loadJob();
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx)$/i)) {
        setErrors((prev) => ({ ...prev, resume: 'Please upload a PDF, DOC, or DOCX file.' }));
        return;
      }
      setResumeFile(file);
      setErrors((prev) => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'A valid email address is required.';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!formData.profession.trim()) newErrors.profession = 'Please select or enter your profession.';
    if (!resumeFile) newErrors.resume = 'Please attach your resume (PDF, DOC, DOCX).';
    if (!formData.consent) newErrors.consent = 'You must agree to the privacy and submission terms.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    const selectedResume = resumeFile;
    setSubmitting(true);
    try {
      const created = await applicationService.submitApplication({
        jobId: associatedJob ? associatedJob.id : 'GENERAL-APP',
        jobTitle: associatedJob ? associatedJob.title : 'General Healthcare Professional Application',
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        profession: formData.profession,
        yearsExperience: formData.yearsExperience ? parseInt(formData.yearsExperience, 10) : undefined,
        licenseNumber: formData.licenseNumber,
        licenseState: formData.licenseState,
        specialty: formData.specialty,
        assignmentType: formData.assignmentType,
        preferredLocation: formData.preferredLocation,
        preferredShift: formData.preferredShift,
        availableStartDate: formData.availableStartDate,
        resumeFileName: selectedResume!.name,
        message: formData.message,
      });

      setSubmittedApplication(created);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Submission failed', err);
      setErrors({ form: 'Application submission failed. Please check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // 27 — CONFIRMATION VIEW
  if (submittedApplication) {
    return (
      <div className="application-confirmation-page">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Application Received' }]} />
        <div className="container section">
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', backgroundColor: '#fff', padding: '60px 40px', borderRadius: 12, border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
            <CheckCircle size={64} style={{ color: 'var(--color-success)', margin: '0 auto 24px' }} />
            <span className="eyebrow" style={{ color: 'var(--color-success)' }}>Submission Successful</span>
            <h1 style={{ fontSize: '36px', color: 'var(--color-navy)', marginTop: 8, marginBottom: 16 }}>
              Application Received
            </h1>
            <p style={{ fontSize: '18px', lineHeight: 1.6, color: 'var(--color-gray-700)', marginBottom: 24 }}>
              Thank you for your interest in R.L. Klein &amp; Associates. Your application has been successfully submitted to our recruitment team.
            </p>

            <div style={{ backgroundColor: 'var(--color-off-white)', padding: '20px 24px', borderRadius: 8, display: 'inline-block', marginBottom: 32, border: '1px dashed var(--color-gray-300)' }}>
              <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-gray-500)', fontWeight: 600 }}>
                Application Reference Number
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'monospace', color: 'var(--color-navy)', marginTop: 4 }}>
                {submittedApplication.referenceNumber}
              </div>
            </div>

            <div style={{ fontSize: '14px', color: 'var(--color-gray-600)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.6 }}>
              A member of our healthcare placement team will review your qualifications and credentials. If your background aligns with our client requirements, we will contact you directly.
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/hot-jobs" className="btn btn--primary btn--md">
                View More Hot Jobs
              </Link>
              <Link to="/" className="btn btn--secondary btn--md">
                Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Hot Jobs', href: '/hot-jobs' },
          { label: associatedJob ? `Apply: ${associatedJob.title}` : 'Apply for Healthcare Opportunity' },
        ]}
      />

      <header className="page-hero" style={{ paddingBlock: '48px' }}>
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Direct Candidate Submission</span>
            <h1>Apply for This Position</h1>
            <p className="page-hero__subtitle">
              {associatedJob ? (
                <>Applying for: <strong>{associatedJob.title}</strong> (ID: {associatedJob.id}) &middot; {associatedJob.state}</>
              ) : (
                'Submit your credentials to be considered for current and upcoming healthcare staffing opportunities.'
              )}
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-off-white">
        <div className="container">
          <div style={{ maxWidth: 840, margin: '0 auto' }}>
            {/* Quick reassurance banner */}
            <div style={{ backgroundColor: '#fff', border: '1px solid var(--color-gray-200)', borderRadius: 8, padding: '16px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <ShieldCheck size={24} style={{ color: 'var(--color-violet)', flexShrink: 0 }} />
              <div style={{ fontSize: '14px', color: 'var(--color-gray-600)' }}>
                <strong>No login or registration required.</strong> Your information is handled securely and solely for healthcare credentialing and placement consideration.
              </div>
            </div>

            <form onSubmit={handleSubmit} className="admin-card" style={{ padding: '40px' }} noValidate>
              {errors.form && (
                <div style={{ backgroundColor: 'var(--color-error-light)', color: 'var(--color-error)', padding: '12px 16px', borderRadius: 4, marginBottom: 24, fontSize: '14px' }}>
                  {errors.form}
                </div>
              )}

              {/* 1. PERSONAL INFORMATION */}
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '2px solid var(--color-gray-100)', marginBottom: 20 }}>
                  Personal Information
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label form-label--required">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label form-label--required">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className={`form-input ${errors.lastName ? 'form-input--error' : ''}`}
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email" className="form-label form-label--required">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label form-label--required">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder="(555) 000-0000"
                      className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city" className="form-label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="form-input"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state" className="form-label">State</label>
                    <select
                      id="state"
                      name="state"
                      className="form-select"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="">Select State</option>
                      {STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. PROFESSIONAL INFORMATION */}
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '2px solid var(--color-gray-100)', marginBottom: 20 }}>
                  Professional Information
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="profession" className="form-label form-label--required">Profession</label>
                    <select
                      id="profession"
                      name="profession"
                      className={`form-select ${errors.profession ? 'form-input--error' : ''}`}
                      value={formData.profession}
                      onChange={handleChange}
                    >
                      <option value="">Select Primary Profession</option>
                      {PROFESSIONS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    {errors.profession && <span className="form-error">{errors.profession}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialty" className="form-label">Specialty / Focus Area</label>
                    <input
                      type="text"
                      id="specialty"
                      name="specialty"
                      placeholder="e.g. Primary Care, Psychiatry, ER"
                      className="form-input"
                      value={formData.specialty}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="yearsExperience" className="form-label">Years of Clinical Experience</label>
                    <input
                      type="number"
                      id="yearsExperience"
                      name="yearsExperience"
                      min="0"
                      max="60"
                      className="form-input"
                      value={formData.yearsExperience}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                      <div>
                        <label htmlFor="licenseNumber" className="form-label">License Number</label>
                        <input
                          type="text"
                          id="licenseNumber"
                          name="licenseNumber"
                          className="form-input"
                          value={formData.licenseNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label htmlFor="licenseState" className="form-label">License State</label>
                        <input
                          type="text"
                          id="licenseState"
                          name="licenseState"
                          maxLength={2}
                          placeholder="CA"
                          className="form-input"
                          value={formData.licenseState}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. OPPORTUNITY PREFERENCES */}
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '2px solid var(--color-gray-100)', marginBottom: 20 }}>
                  Opportunity Preferences
                </h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="assignmentType" className="form-label">Preferred Assignment Type</label>
                    <select
                      id="assignmentType"
                      name="assignmentType"
                      className="form-select"
                      value={formData.assignmentType}
                      onChange={handleChange}
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Per Diem">Per Diem</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="preferredShift" className="form-label">Preferred Shift</label>
                    <select
                      id="preferredShift"
                      name="preferredShift"
                      className="form-select"
                      value={formData.preferredShift}
                      onChange={handleChange}
                    >
                      <option value="Day">Day Shift</option>
                      <option value="Evening">Evening Shift</option>
                      <option value="Night">Night Shift</option>
                      <option value="Rotating">Rotating</option>
                      <option value="Flexible">Flexible</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="preferredLocation" className="form-label">Preferred Location / Region</label>
                    <input
                      type="text"
                      id="preferredLocation"
                      name="preferredLocation"
                      placeholder="e.g. Northern California, Sacramento area"
                      className="form-input"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="availableStartDate" className="form-label">Earliest Available Start Date</label>
                    <input
                      type="date"
                      id="availableStartDate"
                      name="availableStartDate"
                      className="form-input"
                      value={formData.availableStartDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              {/* 4. RESUME UPLOAD */}
              <div style={{ marginBottom: 36 }}>
                <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '2px solid var(--color-gray-100)', marginBottom: 20 }}>
                  Resume Upload *
                </h3>
                <label
                  htmlFor="resume-file"
                  className={`file-upload-zone ${resumeFile ? 'file-upload-zone--has-file' : ''}`}
                >
                  <input
                    type="file"
                    id="resume-file"
                    style={{ display: 'none' }}
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleFileChange}
                  />
                  {resumeFile ? (
                    <>
                      <FileText size={32} style={{ color: 'var(--color-success)' }} />
                      <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{resumeFile.name}</span>
                      <span style={{ fontSize: '12px', color: 'var(--color-gray-500)' }}>
                        {(resumeFile.size / 1024).toFixed(1)} KB &middot; Click to change file
                      </span>
                    </>
                  ) : (
                    <>
                      <UploadCloud size={32} style={{ color: 'var(--color-violet)' }} />
                      <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>
                        Click to upload your resume
                      </span>
                      <span style={{ fontSize: '13px', color: 'var(--color-gray-500)' }}>
                        Accepted formats: PDF, DOC, DOCX (Max 10 MB)
                      </span>
                    </>
                  )}
                </label>
                {errors.resume && <span className="form-error" style={{ display: 'block', marginTop: 8 }}>{errors.resume}</span>}
              </div>

              {/* 5. ADDITIONAL INFORMATION */}
              <div style={{ marginBottom: 36 }}>
                <div className="form-group">
                  <label htmlFor="message" className="form-label">Additional Information / Message (Optional)</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    placeholder="Tell us about specific schedule preferences, licensing details, or questions..."
                    className="form-textarea"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* 6. CONSENT */}
              <div style={{ marginBottom: 36 }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    name="consent"
                    className="form-checkbox"
                    checked={formData.consent}
                    onChange={handleChange}
                  />
                  <span>
                    I confirm that the information provided is accurate to the best of my knowledge. I authorize R.L. Klein &amp; Associates to contact me regarding healthcare opportunities and to verify my clinical credentials in accordance with applicable state and federal guidelines.
                  </span>
                </label>
                {errors.consent && <span className="form-error" style={{ display: 'block', marginTop: 8 }}>{errors.consent}</span>}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn--accent btn--lg"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  {submitting ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
