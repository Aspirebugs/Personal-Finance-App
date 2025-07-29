import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AuthProvider from './context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './components/App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
     </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
