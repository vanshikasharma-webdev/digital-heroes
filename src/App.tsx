import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Scores from './pages/Scores';
import ProtectedRoute from './components/ProtectedRoute';
import Charities from './pages/Charities';
import CharitySelection from './pages/CharitySelection';
import Subscription from './pages/Subscription';
import Impact from './pages/Impact';
import Home from './pages/Home';
import Admin from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/impact" element={<Impact />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/charities" element={<Charities />} />
        <Route path="/charity-selection" element={<CharitySelection />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/scores" element={<Scores />} />
          <Route path="/admin" element={<Admin />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;