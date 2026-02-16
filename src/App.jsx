import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import About from './pages/legal/About';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import AdminDashboard from './pages/admin/AdminDashboard';
// Admin Views
import DashboardOverview from './pages/admin/views/DashboardOverview';
import CoursesView from './pages/admin/views/CoursesView';
import CourseCreateView from './pages/admin/views/CourseCreateView';
import CategoryManagementView from './pages/admin/views/CategoryManagementView';
import UserManagementView from './pages/admin/views/UserManagementView';
import BlogManagementView from './pages/admin/views/BlogManagementView';
import BlogPostCreateView from './pages/admin/views/BlogPostCreateView';
import AnalyticsView from './pages/admin/views/AnalyticsView';
import SettingsView from './pages/admin/views/SettingsView';

import CourseDetail from './pages/course/CourseDetail';
import CourseList from './pages/course/CourseList';
import LearningDashboard from './pages/dashboard/LearningDashboard';
import CoursePlayer from './pages/course/CoursePlayer';
import Subscriptions from './pages/legal/Subscriptions';
import Business from './pages/legal/Business';
import Government from './pages/legal/Government';
import Careers from './pages/legal/Careers';
import Contact from './pages/legal/Contact';
import Cookies from './pages/legal/Cookies';
import Blog from './pages/blog/Blog';
import BlogDetail from './pages/blog/BlogDetail';
import Profile from './pages/profile/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import './App.css';

import AdminLogin from './pages/auth/AdminLogin';

function AppContent() {
  const location = useLocation();
  const isSpecialRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/learn') ||
    location.pathname === '/login' ||
    location.pathname === '/signup';

  return (
    <div className="app-container">
      {!isSpecialRoute && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Informational Routes */}
          <Route path="/about" element={<About />} />

          {/* Course Routes */}
          <Route path="/courses" element={<CourseList />} />
          <Route path="/course/:id" element={<CourseDetail />} />
          <Route path="/learn/:id" element={
            <ProtectedRoute>
              <CoursePlayer />
            </ProtectedRoute>
          } />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <LearningDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="courses" element={<CoursesView />} />
            <Route path="courses/create" element={<CourseCreateView />} />
            <Route path="courses/edit/:id" element={<CourseCreateView />} />
            <Route path="categories" element={<CategoryManagementView />} />
            <Route path="users" element={<UserManagementView />} />
            <Route path="blog" element={<BlogManagementView />} />
            <Route path="blog/create" element={<BlogPostCreateView />} />
            <Route path="blog/edit/:id" element={<BlogPostCreateView />} />
            <Route path="analytics" element={<AnalyticsView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>

          {/* Legal & Informational Routes */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/cookies" element={<Cookies />} />
          <Route path="/subscriptions" element={<Subscriptions />} />
          <Route path="/business" element={<Business />} />
          <Route path="/government" element={<Government />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </main>
      {!isSpecialRoute && <Footer />}
    </div>
  );
}

import { SettingsProvider } from './context/SettingsContext';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <AppContent />
      </Router>
    </SettingsProvider>
  );
}

export default App;
