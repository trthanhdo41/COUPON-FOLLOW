import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import Home from './pages/Home';
import Coupons from './pages/Coupons';
import Stores from './pages/Stores';
import StoreDetail from './pages/StoreDetail';
import Cashback from './pages/Cashback';
import SavingGuides from './pages/SavingGuides';
import ArticleDetail from './pages/ArticleDetail';
import Search from './pages/Search';
import SignIn from './pages/SignIn';
import Join from './pages/Join';
import UserDashboard from './pages/UserDashboard';
import TermsOfUse from './pages/TermsOfUse';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <CookieConsent />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/coupons" element={
            <>
              <Navbar />
              <Coupons />
              <Footer />
            </>
          } />
          <Route path="/stores" element={
            <>
              <Navbar />
              <Stores />
              <Footer />
            </>
          } />
          <Route path="/store/:storeId" element={
            <>
              <Navbar />
              <StoreDetail />
              <Footer />
            </>
          } />
          <Route path="/cashback" element={
            <>
              <Navbar />
              <Cashback />
              <Footer />
            </>
          } />
              <Route path="/saving-guides" element={
                <>
                  <Navbar />
                  <SavingGuides />
                  <Footer />
                </>
              } />
              
              {/* Search Routes */}
              <Route path="/search" element={
                <>
                  <Navbar />
                  <Search />
                  <Footer />
                </>
              } />
              <Route path="/article/:id" element={
                <>
                  <Navbar />
                  <ArticleDetail />
                  <Footer />
                </>
              } />
              
              {/* User Dashboard */}
              <Route path="/dashboard" element={
                <>
                  <Navbar />
                  <UserDashboard />
                  <Footer />
                </>
              } />
              
              {/* Legal Pages */}
              <Route path="/terms" element={
                <>
                  <Navbar />
                  <TermsOfUse />
                  <Footer />
                </>
              } />
              <Route path="/privacy" element={
                <>
                  <Navbar />
                  <PrivacyPolicy />
                  <Footer />
                </>
              } />
              
              {/* Auth Routes */}
          <Route path="/signin" element={
            <>
              <Navbar />
              <SignIn />
              <Footer />
            </>
          } />
          <Route path="/join" element={
            <>
              <Navbar />
              <Join />
              <Footer />
            </>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
