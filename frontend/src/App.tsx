import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { PageLoader } from './components/ui/PageLoader';
// The home page is the most visited entry point, so it ships in the main bundle.
import { HomePageRefresh } from './pages/public/HomePageRefresh';
import './App.css';

// Every other page is downloaded only when a visitor opens it (code splitting).
// Admin pages never reach public visitors' browsers unless they go to /admin.
const HotJobsPage = lazy(() => import('./pages/public/HotJobsPage').then((m) => ({ default: m.HotJobsPage })));
const JobDetailsPage = lazy(() => import('./pages/public/JobDetailsPage').then((m) => ({ default: m.JobDetailsPage })));
const ApplyPage = lazy(() => import('./pages/public/ApplyPage').then((m) => ({ default: m.ApplyPage })));
const ConsentAgreementPage = lazy(() => import('./pages/public/ConsentAgreementPage').then((m) => ({ default: m.ConsentAgreementPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/public/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })));
const TermsOfUsePage = lazy(() => import('./pages/public/TermsOfUsePage').then((m) => ({ default: m.TermsOfUsePage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then((m) => ({ default: m.ContactPage })));
const BlogPage = lazy(() => import('./pages/public/BlogPage').then((m) => ({ default: m.BlogPage })));
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const WhoWeArePage = lazy(() => import('./pages/about/WhoWeArePage').then((m) => ({ default: m.WhoWeArePage })));
const TeamPage = lazy(() => import('./pages/about/TeamPage').then((m) => ({ default: m.TeamPage })));
const AwardsRecognitionPage = lazy(() => import('./pages/about/AwardsRecognitionPage').then((m) => ({ default: m.AwardsRecognitionPage })));
const SafetyCompliancePage = lazy(() => import('./pages/about/SafetyCompliancePage').then((m) => ({ default: m.SafetyCompliancePage })));
const JointCommissionPage = lazy(() => import('./pages/about/JointCommissionPage').then((m) => ({ default: m.JointCommissionPage })));

const CDCRMainPage = lazy(() => import('./pages/staffig solutions/CDCRMainPage').then((m) => ({ default: m.CDCRMainPage })));
const CDCRFacilitiesPage = lazy(() => import('./pages/staffig solutions/CDCRFacilitiesPage').then((m) => ({ default: m.CDCRFacilitiesPage })));
const CDCROpportunitiesPage = lazy(() => import('./pages/staffig solutions/CDCROpportunitiesPage').then((m) => ({ default: m.CDCROpportunitiesPage })));
const AlliedHealthPage = lazy(() => import('./pages/staffig solutions/AlliedHealthPage').then((m) => ({ default: m.AlliedHealthPage })));
const ComplianceCredentialingPage = lazy(() => import('./pages/staffig solutions/ComplianceCredentialingPage').then((m) => ({ default: m.ComplianceCredentialingPage })));
const CorrectionalHealthcarePage = lazy(() => import('./pages/staffig solutions/CorrectionalHealthcarePage').then((m) => ({ default: m.CorrectionalHealthcarePage })));
const DentalHealthcarePage = lazy(() => import('./pages/staffig solutions/DentalHealthcarePage').then((m) => ({ default: m.DentalHealthcarePage })));
const MedicalStaffingPage = lazy(() => import('./pages/staffig solutions/MedicalStaffingPage').then((m) => ({ default: m.MedicalStaffingPage })));
const MentalHealthPage = lazy(() => import('./pages/staffig solutions/MentalHealthPage').then((m) => ({ default: m.MentalHealthPage })));
const WorkforceContinuityPage = lazy(() => import('./pages/staffig solutions/WorkforceContinuityPage').then((m) => ({ default: m.WorkforceContinuityPage })));

const CapabilitiesPage = lazy(() => import('./pages/facilities/CapabilitiesPage').then((m) => ({ default: m.CapabilitiesPage })));
const StaffingRequestPage = lazy(() => import('./pages/facilities/StaffingRequestPage').then((m) => ({ default: m.StaffingRequestPage })));

const ProfessionalsMainPage = lazy(() => import('./pages/professionals/ProfessionalsMainPage').then((m) => ({ default: m.ProfessionalsMainPage })));
const HowItWorksPage = lazy(() => import('./pages/professionals/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })));
const PayBenefitsPage = lazy(() => import('./pages/professionals/PayBenefitsPage').then((m) => ({ default: m.PayBenefitsPage })));
const RecruitersPage = lazy(() => import('./pages/professionals/RecruitersPage').then((m) => ({ default: m.RecruitersPage })));
const CredentialingOnboardingPage = lazy(() => import('./pages/professionals/CredentialingOnboardingPage').then((m) => ({ default: m.CredentialingOnboardingPage })));
const ProfessionalsFAQPage = lazy(() => import('./pages/professionals/ProfessionalsFAQPage').then((m) => ({ default: m.ProfessionalsFAQPage })));

const AdminLayout = lazy(() => import('./layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then((m) => ({ default: m.AdminDashboardPage })));
const AdminJobsPage = lazy(() => import('./pages/admin/AdminJobsPage').then((m) => ({ default: m.AdminJobsPage })));
const AdminJobEditorPage = lazy(() => import('./pages/admin/AdminJobEditorPage').then((m) => ({ default: m.AdminJobEditorPage })));
const AdminApplicationsPage = lazy(() => import('./pages/admin/AdminApplicationsPage').then((m) => ({ default: m.AdminApplicationsPage })));
const AdminApplicationDetailsPage = lazy(() => import('./pages/admin/AdminApplicationDetailsPage').then((m) => ({ default: m.AdminApplicationDetailsPage })));

function App() {
  return (
      <AuthProvider>
        {/* Covers routes outside the layouts (admin login, admin shell). */}
        <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePageRefresh />} />
            <Route path="/jobs" element={<HotJobsPage hotOnly={false} />} />
            <Route path="/hot-jobs" element={<HotJobsPage />} />
            <Route path="/jobs/:jobId" element={<JobDetailsPage />} />
            <Route path="/apply" element={<ApplyPage />} />
            <Route path="/apply/:jobId" element={<ApplyPage />} />
            <Route path="/consent-agreement" element={<ConsentAgreementPage />} />
            <Route path="/about/who-we-are" element={<WhoWeArePage />} />
            <Route path="/about/team" element={<TeamPage />} />
            <Route path="/about/awards-recognition" element={<AwardsRecognitionPage />} />
            <Route path="/cdcr-healthcare" element={<CDCRMainPage />} />
            <Route path="/cdcr-healthcare/facilities" element={<CDCRFacilitiesPage />} />
            <Route path="/cdcr-healthcare/opportunities" element={<CDCROpportunitiesPage />} />
            <Route path="/cdcr-healthcare/allied-health" element={<AlliedHealthPage />} />
            <Route path="/cdcr-healthcare/compliance-credentialing" element={<ComplianceCredentialingPage />} />
            <Route path="/cdcr-healthcare/correctional-healthcare" element={<CorrectionalHealthcarePage />} />
            <Route path="/cdcr-healthcare/dental-healthcare" element={<DentalHealthcarePage />} />
            <Route path="/cdcr-healthcare/medical-staffing" element={<MedicalStaffingPage />} />
            <Route path="/cdcr-healthcare/mental-behavioral-health" element={<MentalHealthPage />} />
            <Route path="/cdcr-healthcare/workforce-continuity" element={<WorkforceContinuityPage />} />
            <Route path="/facilities/capabilities" element={<CapabilitiesPage />} />
            <Route path="/facilities/staffing-request" element={<StaffingRequestPage />} />
            <Route path="/healthcare-professionals" element={<ProfessionalsMainPage />} />
            <Route path="/healthcare-professionals/how-it-works" element={<HowItWorksPage />} />
            <Route path="/healthcare-professionals/pay-benefits" element={<PayBenefitsPage />} />
            <Route path="/healthcare-professionals/recruiters" element={<RecruitersPage />} />
            <Route path="/healthcare-professionals/credentialing-onboarding" element={<CredentialingOnboardingPage />} />
            <Route path="/healthcare-professionals/faqs" element={<ProfessionalsFAQPage />} />
            <Route path="/healthcare-professionals/faq" element={<Navigate to="/healthcare-professionals/faqs" replace />} />
            <Route path="/about/faqs" element={<Navigate to="/healthcare-professionals/faqs" replace />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blogs/:slug" element={<BlogPage />} />
            <Route path="/resources" element={<Navigate to="/blogs" replace />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route path="/about/safety-compliance" element={<SafetyCompliancePage />} />
            <Route path="/about/joint-commission" element={<JointCommissionPage />} />
            <Route path="/joint-commission" element={<Navigate to="/about/joint-commission" replace />} />
            <Route path="/joint-commision" element={<Navigate to="/about/joint-commission" replace />} />
            {/* Unknown URLs show a real "Page Not Found" instead of silently redirecting home. */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
          <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/jobs" element={<AdminJobsPage />} />
            <Route path="/admin/jobs/new" element={<AdminJobEditorPage />} />
            <Route path="/admin/jobs/:jobId/edit" element={<AdminJobEditorPage />} />
            <Route path="/admin/applications" element={<AdminApplicationsPage />} />
            <Route path="/admin/applications/:applicationId" element={<AdminApplicationDetailsPage />} />
          </Route>
        </Routes>
        </Suspense>
      </AuthProvider>
  );
}

export default App;
