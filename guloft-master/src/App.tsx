import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Matching from './pages/matching'
import QuestionIntro from './pages/question-intro'
import Login from './pages/login'
import Profile from './pages/profile'
import Home from './pages/home'
import Signup from './pages/signup'
import Questions from './pages/questions'
import { LoginProvider } from './contexts/login-context'

const App: React.FC = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <LoginProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/question-intro" element={<QuestionIntro />} />
          <Route path="/questions" element={<Questions />} />
          <Route path="/matching" element={<Matching />} />
          <Route path="/profile/" element={<Profile />} />
        </Routes>
      </LoginProvider>
    </Router>
  )
}

export default App
