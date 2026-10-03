import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './contexts/AuthContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider로 감싸서 앱 전역에 인증 상태 공급 */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
);
