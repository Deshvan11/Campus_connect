import './App.css'
import {BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/SignUp'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import MarketMingle from './pages/MarketMingle'
import BudgetBuddy from './pages/BudgetBuddy'
import StudyBuddy from './pages/StudyBuddy'
import PackPal from './pages/PackPal'
import FacultyTimeSlot from './pages/FacultyTimeSlot'


function ProtectedRoute({ children }) {
  const userId = sessionStorage.getItem('userId');
  return userId ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <>
      <Router>
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/market-mingle" 
              element={
                <ProtectedRoute>
                  <MarketMingle />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/budget-buddy" 
              element={
                <ProtectedRoute>
                  <BudgetBuddy />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/study-buddy" 
              element={
                <ProtectedRoute>
                  <StudyBuddy />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pack-pal" 
              element={
                <ProtectedRoute>
                  <PackPal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/faculty-finder" 
              element={
                <ProtectedRoute>
                  <FacultyTimeSlot />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
      </Router>
    </>
  )
}

export default App
