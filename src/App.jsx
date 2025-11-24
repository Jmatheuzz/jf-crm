
import './App.css'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { Route, Routes } from 'react-router-dom'
import ValidationEmail from './pages/ValidationEmail'
import BasicInfo from './pages/BasicInfo'
import ProtectedRoute from './routes/ProtectedRoute'
import Home from './pages/Home'
import CriarAtendimento from './pages/CriarAtendimento'
import Dashboard from './pages/Dashboard'
import { ProcessoDetailScreen } from './components/ProcessoDetailScreen'
import CriarVisita from './pages/CriarVisita'
import { AdminImovel } from './pages/AdminImovel'
import { AdminUsuario } from './pages/AdminUsuario'
import ForgotPassword from './pages/ForgotPassword'
import ValidateCode from './pages/ValidateCode'
import ResetPassword from './pages/ResetPassword'
import AdminProcesso from './pages/AdminProcesso'


function App() {

  return (
    <Routes>
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<SignUp />} />
      <Route path="/validation-email" element={<ValidationEmail />} />
      <Route path="/basic-info" element={<BasicInfo />} />
      <Route path="/criar-atendimento" element={<CriarAtendimento />} />
      <Route path="/criar-visita" element={<CriarVisita />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/processos/:id" element={<ProcessoDetailScreen />} />
      <Route path="/gerenciar-imovel" element={<AdminImovel />} />
      <Route path="/gerenciar-user" element={<AdminUsuario />} />
      <Route path="/gerenciar-processo" element={<AdminProcesso />} />
      <Route path="/request-reset-senha" element={<ForgotPassword />} />
      <Route path="/validar-codigo-senha" element={<ValidateCode />} />
      <Route path="/resetar-senha" element={<ResetPassword />} />
    </Routes>
  )
}

export default App
