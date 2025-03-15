import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './index.css'
import Index from './Index.jsx'
import FormRegistration from './Application.jsx'
import LoginForm from './Login.jsx'
import Dashboard from './Dashboard.jsx'
import ShowApp from './Showapp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/apply" element={<FormRegistration />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/admin/showapp" element={<ShowApp />} />
      </Routes>
    </Router>
  </StrictMode>,
)
