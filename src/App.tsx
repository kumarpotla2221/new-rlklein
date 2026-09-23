import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AdminLayout } from './layouts/AdminLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { ProtectedRoute } from './components/ui/ProtectedRoute';
import { HomePage } from './pages/public/HomePage';
import { HomePageRefresh } from './pages/public/HomePageRefresh';
import { HotJobsPage } from './pages/public/HotJobsPage';
import { JobDetailsPage } from './pages/public/JobDetailsPage';
import { ApplyPage } from './pages/public/ApplyPage';
import { ConsentAgreementPage } from './pages/public/ConsentAgreementPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsOfUsePage } from './pages/public/TermsOfUsePage';
import { ContactPage } from './pages/public/ContactPage';
import { WhoWeArePage } from './pages/about/WhoWeArePage';
import { TeamPage } from './pages/about/TeamPage';
import { AwardsRecognitionPage } from './pages/about/AwardsRecognitionPage';
import { SafetyCompliancePage } from './pages/about/SafetyCompliancePage';
import { CDCRMainPage } from './pages/cdcr/CDCRMainPage';
import { CDCRFacilitiesPage } from './pages/cdcr/CDCRFacilitiesPage';
import { CDCROpportunitiesPage } from './pages/cdcr/CDCROpportunitiesPage';
import { AlliedHealthPage } from './pages/cdcr/AlliedHealthPage';
import { ComplianceCredentialingPage } from './pages/cdcr/ComplianceCredentialingPage';
import { CorrectionalHealthcarePage } from './pages/cdcr/CorrectionalHealthcarePage';
import { DentalHealthcarePage } from './pages/cdcr/DentalHealthcarePage';
import { MedicalStaffingPage } from './pages/cdcr/MedicalStaffingPage';
import { MentalHealthPage } from './pages/cdcr/MentalHealthPage';
import { WorkforceContinuityPage } from './pages/cdcr/WorkforceContinuityPage';
import { CapabilitiesPage } from './pages/facilities/CapabilitiesPage';
import { StaffingRequestPage } from './pages/facilities/StaffingRequestPage';
import { ProfessionalsMainPage } from './pages/professionals/ProfessionalsMainPage';
import { HowItWorksPage } from './pages/professionals/HowItWorksPage';
import { PayBenefitsPage } from './pages/professionals/PayBenefitsPage';
import { RecruitersPage } from './pages/professionals/RecruitersPage';
import { CredentialingOnboardingPage } from './pages/professionals/CredentialingOnboardingPage';
import { ProfessionalsFAQPage } from './pages/professionals/ProfessionalsFAQPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminJobsPage } from './pages/admin/AdminJobsPage';
import { AdminJobEditorPage } from './pages/admin/AdminJobEditorPage';
import { AdminApplicationsPage } from './pages/admin/AdminApplicationsPage';
import { AdminApplicationDetailsPage } from './pages/admin/AdminApplicationDetailsPage';
import './App.css';

function App() {
  return (
      <AuthProvider>
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
            <Route path="/healthcare-professionals/faq" element={<ProfessionalsFAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route path="/about/safety-compliance" element={<SafetyCompliancePage />} />
            <Route path="/joint-commision" element={<SafetyCompliancePage />} />
            <Route path="/joint-commission" element={<SafetyCompliancePage />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
  );
}

export default App;