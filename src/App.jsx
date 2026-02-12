import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/home/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import About from './pages/legal/About';
import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import AdminDashboard from './pages/admin/AdminDashboard';
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
          <Route path="/learn/:id" element={<CoursePlayer />} />

          {/* Dashboard Routes */}
          <Route path="/dashboard" element={<LearningDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />

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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
