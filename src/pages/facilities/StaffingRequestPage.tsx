import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../../components/ui/Typography';
import { PROFESSIONS, STATES } from '../../data/jobs';
import { CheckCircle2, Building2, PhoneCall, ArrowRight, ShieldCheck } from 'lucide-react';

const FACILITY_TYPES = [
  'State Correctional Facility',
  'Federal Detention / Healthcare Facility',
  'County Jail / Sheriff Department Healthcare',
  'Juvenile Justice Healthcare Unit',
  'State Psychiatric / Behavioral Hospital',
  'Government / Municipal Health Clinic',
  'Veterans Affairs / Public Healthcare',
  'Other Institutional Facility',
];

export function StaffingRequestPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    title: '',
    email: '',
    phone: '',
    organization: '',
    city: '',
    state: 'California',
    facilityType: 'State Correctional Facility',
    professionNeeded: 'Registered Nurse',
    numberNeeded: 1,
    assignmentType: 'Full-Time',
    shift: 'Day',
    startDate: '',
    details: '',
    hasExistingAgency: false,
    improvementGoals: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.firstName.trim()) newErrors.firstName = 'First name is required.';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required.';
    if (!form.title.trim()) newErrors.title = 'Professional title is required.';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Valid institutional email is required.';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required.';
    if (!form.organization.trim()) newErrors.organization = 'Facility or organization name is required.';
    if (!form.professionNeeded) newErrors.professionNeeded = 'Please select a primary profession needed.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 120, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    // Simulate submission to facility intake pipeline
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (submitted) {
    return (
      <div className="staffing-request-page">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Staffing Request Submitted' }]} />
        <div className="container section">
          <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center', backgroundColor: '#fff', padding: '60px 40px', borderRadius: 12, border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
            <CheckCircle2 size={64} style={{ color: 'var(--color-success)', margin: '0 auto 20px' }} />
            <span className="eyebrow" style={{ color: 'var(--color-success)' }}>Requirement Received</span>
            <h1 style={{ fontSize: '32px', color: 'var(--color-navy)', marginTop: 8, marginBottom: 16 }}>
              Staffing Request Submitted
            </h1>
            <p style={{ fontSize: '17px', lineHeight: 1.6, color: 'var(--color-gray-700)', marginBottom: 28 }}>
              Thank you for contacting R.L. Klein &amp; Associates. A senior workforce coordinator will review your facility requirements and reach out directly to discuss available candidate pipelines and credentialing timelines.
            </p>
            <div style={{ backgroundColor: 'var(--color-off-white)', padding: 20, borderRadius: 8, marginBottom: 32, fontSize: '14px', color: 'var(--color-gray-700)' }}>
              For urgent or emergency shift coverage, contact our operational line directly at: <strong>562-427-5577</strong> or after hours at <strong>562-512-7740</strong>.
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
              <Link to="/" className="btn btn--primary btn--md">
                Return to Home
              </Link>
              <Link to="/facilities/capabilities" className="btn btn--secondary btn--md">
                View Capabilities
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="staffing-request-page">
      <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Facilities', href: '/facilities/capabilities' }, { label: 'Staffing Request' }]} />

      <header className="page-hero">
        <div className="container">
          <div className="page-hero__content">
            <span className="eyebrow" style={{ color: '#A0B8E8' }}>Workforce Solutions</span>
            <h1>Tell Us What Your Facility Needs</h1>
            <p className="page-hero__subtitle">
              Whether you require per-diem coverage, full-time clinical placements, or long-term workforce continuity, our coordinators are ready to support your facility.
            </p>
          </div>
        </div>
      </header>

      <section className="section bg-off-white">
        <div className="container" style={{ maxWidth: 860 }}>
          <form onSubmit={handleSubmit} className="admin-card" style={{ padding: 40 }} noValidate>
            {/* 1. CONTACT & ORGANIZATION */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
                1. Institutional Contact Information
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label form-label--required">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className={`form-input ${errors.firstName ? 'form-input--error' : ''}`}
                    value={form.firstName}
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
                    value={form.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="title" className="form-label form-label--required">Title / Role (e.g. Medical Director, Scheduler)</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className={`form-input ${errors.title ? 'form-input--error' : ''}`}
                    value={form.title}
                    onChange={handleChange}
                  />
                  {errors.title && <span className="form-error">{errors.title}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="organization" className="form-label form-label--required">Organization / Facility Name</label>
                  <input
                    type="text"
                    id="organization"
                    name="organization"
                    className={`form-input ${errors.organization ? 'form-input--error' : ''}`}
                    value={form.organization}
                    onChange={handleChange}
                  />
                  {errors.organization && <span className="form-error">{errors.organization}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email" className="form-label form-label--required">Work Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-input ${errors.email ? 'form-input--error' : ''}`}
                    value={form.email}
                    onChange={handleChange}
                  />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label form-label--required">Direct Phone</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`form-input ${errors.phone ? 'form-input--error' : ''}`}
                    value={form.phone}
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
                    value={form.city}
                    onChange={handleChange}
                  />
                </div>
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
              </div>

              <div className="form-group">
                <label htmlFor="facilityType" className="form-label">Facility Classification</label>
                <select
                  id="facilityType"
                  name="facilityType"
                  className="form-select"
                  value={form.facilityType}
                  onChange={handleChange}
                >
                  {FACILITY_TYPES.map((ft) => (
                    <option key={ft} value={ft}>{ft}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* 2. STAFFING SPECIFICATIONS */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
                2. Staffing Specifications
              </h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="professionNeeded" className="form-label form-label--required">Primary Profession Needed</label>
                  <select
                    id="professionNeeded"
                    name="professionNeeded"
                    className="form-select"
                    value={form.professionNeeded}
                    onChange={handleChange}
                  >
                    {PROFESSIONS.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="numberNeeded" className="form-label">Number of Clinicians Needed</label>
                  <input
                    type="number"
                    id="numberNeeded"
                    name="numberNeeded"
                    min="1"
                    className="form-input"
                    value={form.numberNeeded}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="assignmentType" className="form-label">Assignment Type</label>
                  <select
                    id="assignmentType"
                    name="assignmentType"
                    className="form-select"
                    value={form.assignmentType}
                    onChange={handleChange}
                  >
                    <option value="Full-Time">Full-Time Staffing</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Per Diem">Per Diem / PRN Shifts</option>
                    <option value="Contract">Fixed-Term Contract</option>
                    <option value="Permanent">Permanent Placement</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="shift" className="form-label">Target Shift</label>
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
                    <option value="Rotating">Rotating Coverage</option>
                    <option value="Flexible">All Shifts / Flexible</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="startDate" className="form-label">Target Coverage Start Date</label>
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

              <div className="form-group">
                <label htmlFor="details" className="form-label">Specific Facility Requirements / Scope Notes</label>
                <textarea
                  id="details"
                  name="details"
                  rows={4}
                  placeholder="Detail any specialized clinical requirements, security clearance prerequisites, or orientation dates..."
                  className="form-textarea"
                  value={form.details}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* 3. CURRENT AGENCY EXPERIENCE */}
            <div style={{ marginBottom: 32 }}>
              <h3 style={{ fontSize: '20px', color: 'var(--color-navy)', paddingBottom: 8, borderBottom: '1px solid var(--color-gray-200)', marginBottom: 20 }}>
                3. Partnership Preferences
              </h3>
              <div style={{ marginBottom: 16 }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    name="hasExistingAgency"
                    className="form-checkbox"
                    checked={form.hasExistingAgency}
                    onChange={handleChange}
                  />
                  <span>Our organization currently utilizes healthcare staffing agencies.</span>
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="improvementGoals" className="form-label">
                  What would you most like to improve regarding your clinical staffing support?
                </label>
                <textarea
                  id="improvementGoals"
                  name="improvementGoals"
                  rows={3}
                  placeholder="e.g. Faster credentialing turnaround, lower clinician turnover, better attendance, responsive scheduler contact..."
                  className="form-textarea"
                  value={form.improvementGoals}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn--accent btn--lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {submitting ? 'Submitting Staffing Request...' : 'Submit Staffing Request'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
