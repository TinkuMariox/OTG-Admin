import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/Dashboard';
import Vendors from './pages/Vendors';
import Categories from './pages/Categories';
import SubCategories from './pages/SubCategories';
import Materials from './pages/Materials';
import AdminLayout from './components/layout/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected/Admin routes render inside AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/vendors" element={<Vendors />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/sub-categories" element={<SubCategories />} />
          <Route path="/materials" element={<Materials />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
