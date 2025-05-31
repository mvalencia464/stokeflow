import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import PublicLayout from './layouts/PublicLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import FormBuilder from './pages/dashboard/FormBuilder';
import FormEdit from './pages/dashboard/FormEdit';
import FormsList from './pages/dashboard/FormsList';
import FormTemplates from './pages/dashboard/FormTemplates';
import Analytics from './pages/dashboard/Analytics';
import FormAnalytics from './pages/dashboard/FormAnalytics';
import AnalyticsTest from './pages/dashboard/AnalyticsTest';
import FormsDebug from './pages/dashboard/FormsDebug';
import Leads from './pages/dashboard/Leads';
import Settings from './pages/dashboard/Settings';

// Public Pages
import Home from './pages/public/Home';
import FormPreview from './pages/public/FormPreview';
import EmbedInstructions from './pages/dashboard/EmbedInstructions';
import { useAuthStore } from './stores/authStore';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="form/:formId" element={<FormPreview />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Dashboard Routes - Protected */}
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? <DashboardLayout /> : <Navigate to="/auth/login" />
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="forms" element={<FormsList />} />
        <Route path="forms/templates" element={<FormTemplates />} />
        <Route path="forms/new" element={<FormBuilder />} />
        <Route path="forms/:formId/edit" element={<FormEdit />} />
        <Route path="forms/:formId/embed" element={<EmbedInstructions />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="analytics/:formId" element={<FormAnalytics />} />
        <Route path="analytics-test" element={<AnalyticsTest />} />
        <Route path="forms-debug" element={<FormsDebug />} />
        <Route path="leads" element={<Leads />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;