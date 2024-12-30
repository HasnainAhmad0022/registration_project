import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import DisablePerson from './pages/DisablePerson/DisablePerson'
import StudentForm from './pages/Student/StudentForm'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/register/member" element={<MemberPage />} /> */}
          <Route path="/register-disabled" element={<DisablePerson />} />
          <Route path="/register-student" element={<StudentForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App