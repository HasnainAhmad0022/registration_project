import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import DisablePerson from './pages/DisablePerson/DisablePerson'
import StudentForm from './pages/Student/StudentForm'
import Login from './pages/Login/Login'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home-page" element={<HomePage />} />
          {/* <Route path="/register/member" element={<MemberPage />} /> */}
          <Route path="/register-student" element={<StudentForm />} />
          <Route path="/register-disabled" element={<DisablePerson />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App