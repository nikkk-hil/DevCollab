import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './utils/ProtectedRoute.jsx'
import LoginComponent from './components/LoginComponent.jsx'
import SignupComponent from './components/SignupComponent.jsx'
import HomeComponent from './components/HomeComponent.jsx'
import BoardComponent from './components/BoardComponent.jsx'

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/signup" element={<SignupComponent />} />
      <Route path="/login" element={<LoginComponent/>} />

      {/* Protected Routes  */}
      <Route element={<ProtectedRoute />}>
        <Route path='/' element={<HomeComponent />} />
        <Route path='/board/:boardId' element={<BoardComponent />} />
      </Route>
    </Routes>
  )
}

export default App