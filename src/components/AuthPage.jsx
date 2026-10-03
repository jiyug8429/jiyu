/**
 * AuthPage — 로그인 / 회원가입 전환 폼
 *
 * - mode: 'login' | 'signup'  (버튼으로 전환)
 * - Firebase 에러 코드 → 한국어 메시지 변환
 * - 제출 중 버튼 비활성화 (중복 클릭 방지)
 */

import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';

/** Firebase 에러 코드 → 사용자에게 보여줄 한국어 메시지 */
const AUTH_ERROR_MAP = {
  'auth/invalid-email':          '올바른 이메일 형식이 아닙니다.',
  'auth/user-not-found':         '존재하지 않는 계정입니다.',
  'auth/wrong-password':         '비밀번호가 올바르지 않습니다.',
  'auth/invalid-credential':     '이메일 또는 비밀번호가 올바르지 않습니다.',
  'auth/email-already-in-use':   '이미 사용 중인 이메일입니다.',
  'auth/weak-password':          '비밀번호는 6자 이상이어야 합니다.',
  'auth/too-many-requests':      '잠시 후 다시 시도해 주세요. (요청 초과)',
  'auth/network-request-failed': '네트워크 오류가 발생했습니다.',
  'auth/user-disabled':          '비활성화된 계정입니다.',
};

function getAuthErrorMsg(code) {
  return AUTH_ERROR_MAP[code] ?? `오류가 발생했습니다. (${code})`;
}

function AuthPage() {
  const [mode, setMode]       = useState('login'); // 'login' | 'signup'
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const isLogin = mode === 'login';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        // 성공 시 onAuthStateChanged가 user를 갱신 → App이 자동으로 메인 화면으로 전환
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(getAuthErrorMsg(err.code));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? 'signup' : 'login');
    setError(null);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-backdrop">
      <div className="auth-card">

        {/* 브랜드 헤더 */}
        <div className="auth-brand">
          <span className="auth-icon" aria-hidden="true">🍱</span>
          <h1 className="auth-title">급식 알레르기 알리미</h1>
          <p className="auth-subtitle">부산진여자중학교</p>
        </div>

        {/* 모드 탭 */}
        <div className="auth-tabs" role="tablist">
          <button
            role="tab"
            aria-selected={isLogin}
            className={`auth-tab${isLogin ? ' active' : ''}`}
            onClick={() => { setMode('login'); setError(null); }}
          >
            로그인
          </button>
          <button
            role="tab"
            aria-selected={!isLogin}
            className={`auth-tab${!isLogin ? ' active' : ''}`}
            onClick={() => { setMode('signup'); setError(null); }}
          >
            회원가입
          </button>
        </div>

        {/* 폼 */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-email">이메일</label>
            <input
              id="auth-email"
              className="auth-input"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="auth-password">비밀번호</label>
            <input
              id="auth-password"
              className="auth-input"
              type="password"
              placeholder={isLogin ? '비밀번호 입력' : '6자 이상 입력'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              disabled={loading}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p className="auth-error" role="alert">
              <span aria-hidden="true">⚠ </span>{error}
            </p>
          )}

          {/* 제출 버튼 */}
          <button
            id="auth-submit-btn"
            className="auth-submit"
            type="submit"
            disabled={loading || !email || !password}
          >
            {loading
              ? <span className="btn-spinner" aria-label="처리 중" />
              : isLogin ? '로그인' : '가입하기'}
          </button>
        </form>

        {/* 모드 전환 */}
        <p className="auth-switch">
          {isLogin ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          {' '}
          <button className="auth-switch-btn" onClick={switchMode} type="button">
            {isLogin ? '회원가입' : '로그인'}
          </button>
        </p>

      </div>
    </div>
  );
}

export default AuthPage;
