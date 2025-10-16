import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Coupons from './pages/Coupons';
import Stores from './pages/Stores';
import StoreDetail from './pages/StoreDetail';
import Cashback from './pages/Cashback';
import SavingGuides from './pages/SavingGuides';
import SignIn from './pages/SignIn';
import Join from './pages/Join';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
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
