import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { PROFESSIONS, SPECIALTIES } from '../../data/jobs';

const EXPERIENCE_OPTIONS = ['01-03 Years', '04-06 Years', '07-09 Years', '10+ Years'];
const START_OPTIONS = ['Immediately', '3 months', '6 months', 'Year or longer'];

const HERO_IMAGE = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=2000&q=80';

export function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    specialty: '',
    experience: '',
    startTime: '',
    emailConsent: true,
    smsConsent: false,
    message: '',
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
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'A valid email is required.';
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    // Simulate submission to recruiter intake pipeline
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="contact-page">
      <section className="contact-hero" style={{ backgroundImage: `url(${HERO_IMAGE})` }}>
        <div className="contact-hero__overlay" />
        <div className="contact-hero__inner">
          <div className="contact-hero__col">
            <h1>Want to Talk to a Recruiter?</h1>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="contact-form-section__container">
          {submitted ? (
            <div className="contact-form-section__success">
              <CheckCircle2 size={56} />
              <h2>Thank You!</h2>
              <p>
                We received your information. An R.L. Klein &amp; Associates recruiter will reach out to you as soon as possible.
                For immediate assistance, call us at <a href="tel:5624275577">562-427-5577</a>.
              </p>
              <Link to="/hot-jobs" className="btn btn--accent btn--md">Browse Hot Jobs</Link>
            </div>
          ) : (
            <>
              <h2>Let&apos;s Chat!</h2>
              <p>
                Have questions or just want to learn more about healthcare careers with R.L. Klein &amp; Associates? Give us a little info and a recruiter will reach out to you ASAP!
                <br />
                If you are a healthcare facility seeking help with staffing, <Link to="/facilities/staffing-request">click here to contact us</Link>.
              </p>

              <form onSubmit={handleSubmit} className="contact-form" noValidate>
                <div className="contact-form__grid">
                  <div className="form-group">
                    <label htmlFor="firstName" className="form-label form-label--required">First Name</label>
                    <input id="firstName" name="firstName" type="text" maxLength={40} autoComplete="given-name" className={`form-input${errors.firstName ? ' form-input--error' : ''}`} value={form.firstName} onChange={handleChange} />
                    {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName" className="form-label form-label--required">Last Name</label>
                    <input id="lastName" name="lastName" type="text" maxLength={80} autoComplete="family-name" className={`form-input${errors.lastName ? ' form-input--error' : ''}`} value={form.lastName} onChange={handleChange} />
                    {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label form-label--required">Email</label>
                    <input id="email" name="email" type="email" maxLength={80} autoComplete="email" className={`form-input${errors.email ? ' form-input--error' : ''}`} value={form.email} onChange={handleChange} />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label form-label--required">Phone</label>
                    <input id="phone" name="phone" type="tel" maxLength={40} autoComplete="tel" className={`form-input${errors.phone ? ' form-input--error' : ''}`} value={form.phone} onChange={handleChange} />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="profession" className="form-label">Profession</label>
                    <select id="profession" name="profession" className="form-select" value={form.profession} onChange={handleChange}>
                      <option value="">--None--</option>
                      {PROFESSIONS.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="specialty" className="form-label">Primary Specialty</label>
                    <select id="specialty" name="specialty" className="form-select" value={form.specialty} onChange={handleChange}>
                      <option value="">--None--</option>
                      {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience" className="form-label">Clinical Experience</label>
                    <select id="experience" name="experience" className="form-select" value={form.experience} onChange={handleChange}>
                      <option value="">--None--</option>
                      {EXPERIENCE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="startTime" className="form-label">When would you like to start?</label>
                    <select id="startTime" name="startTime" className="form-select" value={form.startTime} onChange={handleChange}>
                      <option value="">--None--</option>
                      {START_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="contact-form__consents">
                  <label className="form-checkbox-label">
                    <input type="checkbox" name="emailConsent" className="form-checkbox" checked={form.emailConsent} onChange={handleChange} />
                    <span>By checking this box, you agree to receive promotional email messages from us. You can unsubscribe at any time.</span>
                  </label>
                  <label className="form-checkbox-label">
                    <input type="checkbox" name="smsConsent" className="form-checkbox" checked={form.smsConsent} onChange={handleChange} />
                    <span>
                      I agree to receive text messages from R.L. Klein &amp; Associates or on R.L. Klein &amp; Associates&apos; behalf to the phone number I provided. Messages and data rates may apply. Message frequency varies. Consent is not a condition of receiving any property, goods, or services from R.L. Klein &amp; Associates. You can opt out at any time by replying STOP.
                    </span>
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">Message</label>
                  <textarea id="message" name="message" rows={5} className="form-textarea" value={form.message} onChange={handleChange} />
                </div>

                <div className="contact-form__submit">
                  <button type="submit" disabled={submitting} className="btn btn--accent btn--lg">
                    {submitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
