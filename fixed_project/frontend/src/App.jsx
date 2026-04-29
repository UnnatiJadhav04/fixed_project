import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Services from './pages/Services'
import Login from './pages/Login'
import Register from './pages/Register'
import AddMail from './pages/AddMail'
import AddKeywords from './pages/AddKeywords'
import AlertConfig from './pages/AlertConfig'
import AddPassKey from './pages/AddPassKey'
import LoadingScreen from './pages/LoadingScreen'
import SetupComplete from './pages/SetupComplete'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/services" element={<Services />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/add-mail" element={<AddMail />} />
        <Route path="/add-keywords" element={<AddKeywords />} />
        <Route path="/alert-config" element={<AlertConfig />} />
        <Route path="/add-passkey" element={<AddPassKey />} />
        <Route path="/loading" element={<LoadingScreen />} />
        <Route path="/setup-complete" element={<SetupComplete />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
