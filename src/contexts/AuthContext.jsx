/**
 * AuthContext — Firebase 인증 상태를 앱 전역에 공급
 *
 * - user         : Firebase User 객체 (비로그인 시 null)
 * - authLoading  : onAuthStateChanged 초기 응답 대기 중 여부
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

/**
 * AuthProvider — main.jsx에서 <App />을 감싸서 사용
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // 초기 세션 확인 완료 전 true

  useEffect(() => {
    // Firebase가 로컬 세션을 복원하면 콜백 호출
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthLoading(false);
    });

    return unsubscribe; // 컴포넌트 언마운트 시 구독 해제
  }, []);

  return (
    <AuthContext.Provider value={{ user, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

/** useAuth 훅 — Context 외부에서 호출 시 명확한 에러 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === null) {
    throw new Error('useAuth는 <AuthProvider> 안에서만 사용할 수 있습니다.');
  }
  return ctx;
}
