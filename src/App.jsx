import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import DisablePerson from './pages/DisablePerson/DisablePerson';
import StudentForm from './pages/Student/StudentForm';
import Login from './pages/Login/Login';
import MemberPage from './pages/MemberPage/MemberPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home-page"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register/member"
            element={
              <ProtectedRoute>
                <MemberPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-student"
            element={
              <ProtectedRoute>
                <StudentForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register-disabled"
            element={
              <ProtectedRoute>
                <DisablePerson />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
};

export default App;