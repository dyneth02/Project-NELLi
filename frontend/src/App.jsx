import { ToastContainer } from 'react-toastify'
import AppRoutes from './routes/AppRoutes.jsx'

export default function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        theme="dark"
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  )
}
