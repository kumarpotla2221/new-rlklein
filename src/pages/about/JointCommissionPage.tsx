import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CalendarDays,
  CircleCheck,
  FileText,
  Heart,
  Shield,
  Star,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { photo } from '../../data/images';

const SEAL_SRC = `${import.meta.env.BASE_URL}joint-commission.jpg`;
const ACCREDITATION_URL =
  'https://www.jointcommission.org/en-us/about-us/recognizing-excellence/find-accredited-organizations/736727';
const JOINT_COMMISSION_URL = 'https://www.jointcommission.org/en/accreditation/who-we-accredit';
const NPSG_URL = 'https://www.jointcommission.org/en/standards/international-patient-safety-goals';

const BENEFITS: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Shield, title: 'Trusted Quality', text: 'Meets the highest industry standards.' },
  { icon: Users, title: 'Better Care', text: 'Skilled professionals for improved patient outcomes.' },
  { icon: Star, title: 'Top Pay', text: 'Competitive compensation for our healthcare professionals.' },
  { icon: CalendarDays, title: 'Flexible Opportunities', text: 'Choose the schedule that fits your lifestyle.' },
  { icon: Heart, title: 'Full Benefits', text: 'Comprehensive benefits for your peace of mind.' },
];

const SAFETY_GOALS = [
  'Eliminate dangerous abbreviations and symbols in information management systems.',
  'Improve the accuracy of patient information.',
  'Enhance communication among caregivers.',
  'Prevent healthcare-associated infections.',
  'Ensure safe use of high-alert medications.',
];

export function JointCommissionPage() {
  return (
    <div className="jc-page">
      {/* Hero */}
      <header className="jc-hero" style={{ '--jc-hero-img': `url(${photo('patientWard', 1800)})` } as CSSProperties}>
        <div className="container jc-hero__inner">
          <div className="jc-hero__content">
            <span className="jc-eyebrow">Joint Commission Certified</span>
            <h1 className="jc-hero__title">Healthcare Staffing Services</h1>
            <span className="jc-hero__rule" aria-hidden="true" />
            <p className="jc-hero__text">
              RLKlein is proud to be a Joint Commission certified healthcare staffing company, demonstrating our
              unwavering commitment to quality, safety and excellence in every placement we make.
            </p>
            <a href={ACCREDITATION_URL} target="_blank" rel="noreferrer" className="jc-btn jc-btn--solid">
              Learn More <ArrowRight size={15} />
            </a>
          </div>
          <div className="jc-hero__seal">
            <img src={SEAL_SRC} alt="Joint Commission Certified — National Quality Approval gold seal" className="jc-seal" />
          </div>
        </div>
      </header>

      {/* What is the Joint Commission */}
      <section className="jc-about" id="about-joint-commission">
        <div className="container jc-about__inner">
          <div className="jc-about__intro">
            <span className="jc-eyebrow jc-eyebrow--sm">About the Joint Commission</span>
            <h2 className="jc-h2">What is the Joint Commission?</h2>
            <p>
              The Joint Commission is a leading, independent healthcare accrediting organization in the United States,
              setting the highest standards for quality and safety in healthcare. Its accreditation is a mark of trust,
              ensuring that healthcare organizations meet rigorous standards for patient care, clinical excellence and
              operational performance.
            </p>
            <a href={JOINT_COMMISSION_URL} target="_blank" rel="noreferrer" className="jc-btn jc-btn--outline">
              Learn More About the Joint Commission <ArrowRight size={15} />
            </a>
          </div>

          <div className="jc-about__details">
            <div className="jc-about__points">
              <div className="jc-point">
                <span className="jc-icon-circle jc-icon-circle--tint"><Shield size={20} /></span>
                <p>
                  The Joint Commission&apos;s Gold Seal of Approval recognizes organizations that demonstrate continuous
                  compliance with its performance standards, reflecting a commitment to safe and high-quality patient care.
                </p>
              </div>
              <div className="jc-point jc-point--boxed">
                <span className="jc-icon-circle"><Shield size={20} /></span>
                <p>
                  A trusted symbol of quality.
                  <br />
                  A higher standard in healthcare.
                </p>
              </div>
            </div>
            <div className="jc-about__seal">
              <img src={SEAL_SRC} alt="Joint Commission Gold Seal of Approval" className="jc-seal" loading="lazy" />
              <h3>Joint Commission Gold Seal of Approval</h3>
              <p>For Healthcare Staffing Services Certification</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="jc-benefits">
        <div className="container">
          <div className="jc-benefits__heading">
            <span className="jc-eyebrow jc-eyebrow--sm jc-eyebrow--navy">The Benefits</span>
            <h2 className="jc-h2">Experience the Benefits of Working with a Joint Commission Certified Agency</h2>
            <p>
              When you choose to work with RLKlein, you can feel confident that you are receiving the best staffing
              services available. Joint Commission Certification is a widely recognized and respected symbol of quality,
              and working with a certified agency like RLKlein means you are working with an agency that has been
              thoroughly vetted and meets the highest standards in the industry.
            </p>
          </div>
          <div className="jc-benefits__grid">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div className="jc-benefit" key={title}>
                <span className="jc-icon-circle jc-icon-circle--white jc-icon-circle--lg"><Icon size={24} /></span>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose */}
      <section className="jc-why">
        <div className="jc-why__photo">
          <img src={photo('supportiveCare', 900)} alt="Smiling RLKlein nurse holding a clipboard" loading="lazy" />
        </div>
        <div className="jc-why__panel">
          <span className="jc-eyebrow jc-eyebrow--sm jc-eyebrow--light">Why Choose RLKlein</span>
          <h2 className="jc-h2 jc-h2--light">Why Choose RLKlein&apos;s Joint Commission Certified Staffing Services?</h2>
          <p>
            Our Joint Commission Certification is just one of the many reasons why healthcare professionals choose to
            work with us. In addition to our commitment to quality, we also offer top pay, flexible job opportunities,
            and full benefits.
          </p>
          <Link to="/hot-jobs" className="jc-btn jc-btn--white">
            View Open Jobs <ArrowRight size={15} />
          </Link>
        </div>
        <div className="jc-why__importance">
          <div className="jc-why__importance-head">
            <span className="jc-icon-circle jc-icon-circle--tint"><Shield size={20} /></span>
            <h3>The Importance of Joint Commission Certification in Healthcare Staffing</h3>
          </div>
          <p>
            <strong>Joint Commission Certification</strong> helps to ensure that healthcare professionals are working
            with agencies that have been thoroughly evaluated and meet the highest standards for quality and patient
            safety. By choosing a Joint Commission Certified agency like RLKlein, you can trust that you are receiving
            top-notch staffing services and support.
          </p>
        </div>
      </section>

      {/* National Patient Safety Goals */}
      <section className="jc-npsg">
        <div className="container jc-npsg__inner">
          <div className="jc-npsg__intro">
            <div className="jc-npsg__head">
              <span className="jc-icon-circle jc-icon-circle--white jc-icon-circle--xl"><Users size={24} /></span>
              <div>
                <span className="jc-eyebrow jc-eyebrow--sm">Championing National Patient Safety Goals</span>
                <h2 className="jc-h2 jc-h2--md">National Patient Safety Goals</h2>
              </div>
            </div>
            <p>
              At RLKlein, we proudly uphold the National Patient Safety Goals set by the Joint Commission. Our commitment
              to these goals is reflected in our rigorous standards for patient safety and quality of care, ensuring the
              highest level of care for every patient.
            </p>
            <a href={NPSG_URL} target="_blank" rel="noreferrer" className="jc-btn jc-btn--outline">
              Learn More About National Patient Safety Goals <ArrowRight size={15} />
            </a>
          </div>
          <ul className="jc-npsg__list">
            {SAFETY_GOALS.map((goal) => (
              <li key={goal}>
                <CircleCheck size={20} className="jc-npsg__check" aria-hidden="true" />
                <span>{goal}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Policy statement */}
      <section className="jc-policy">
        <div className="container jc-policy__inner">
          <div className="jc-policy__head">
            <span className="jc-policy__icon"><FileText size={30} /></span>
            <div>
              <span className="jc-eyebrow jc-eyebrow--sm jc-eyebrow--light">Joint Commission</span>
              <h2 className="jc-h2 jc-h2--light jc-h2--md">Policy Statement</h2>
            </div>
          </div>
          <div className="jc-policy__body">
            <p>
              In compliance with the Joint Commission&apos;s Standards for Healthcare Staffing Services, RLKlein strives to
              provide a higher standard of service and to deliver safe, quality patient care.
            </p>
            <p>
              As our customer, you can have the confidence that the processes and procedures within RLKlein support that
              the supplemental staff working in your organization have met the requirements established by the Joint
              Commission. To assure compliance with the Joint Commission Standards for Healthcare Staffing services,
              RLKlein provides the customer a written description of the following service features.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
