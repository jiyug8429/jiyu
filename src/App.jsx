import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import { useAuth } from './contexts/AuthContext';
import { fetchMealData } from './utils/neisApi';
import AuthPage from './components/AuthPage';
import ViewToggle from './components/ViewToggle';
import MonthSelector from './components/MonthSelector';
import MonthlyView from './components/MonthlyView';
import WeeklyView from './components/WeeklyView';
import DailyView from './components/DailyView';
import './App.css';

function App() {
  // ── 인증 상태 ──────────────────────────────────────────────
  const { user, authLoading } = useAuth();

  // ── 보기 모드 ──────────────────────────────────────────────
  const now = new Date();
  const [viewMode, setViewMode]       = useState('monthly');
  const [selectedYear, setSelectedYear]   = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedDate, setSelectedDate]   = useState(new Date(now));

  // ── 데이터 상태 ────────────────────────────────────────────
  const [mealRows, setMealRows] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  // ── API 호출 (로그인된 경우에만) ───────────────────────────
  useEffect(() => {
    if (!user) return; // 비로그인 상태면 스킵

    setLoading(true);
    setError(null);

    fetchMealData(selectedYear, selectedMonth)
      .then((rows) => setMealRows(rows))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, selectedYear, selectedMonth]);

  // ── 월 선택 핸들러 ─────────────────────────────────────────
  const handleMonthChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDate(new Date(year, month - 1, 1));
  };

  // ── 로그아웃 ───────────────────────────────────────────────
  const handleLogout = () => signOut(auth);

  // ── 렌더링 분기 ────────────────────────────────────────────

  // 1) Firebase 세션 초기화 중 (앱 최초 로딩 시 깜빡임 방지)
  if (authLoading) {
    return (
      <div className="auth-init-screen">
        <span className="spinner" aria-label="로딩 중" />
      </div>
    );
  }

  // 2) 비로그인 → 로그인/회원가입 화면
  if (!user) {
    return <AuthPage />;
  }

  // 3) 로그인 완료 → 메인 앱
  return (
    <div className="app">
      {/* ── 헤더 ── */}
      <header className="app-header">
        <div className="header-inner">
          {/* 브랜드 */}
          <div className="header-brand">
            <span className="header-icon" aria-hidden="true">🍱</span>
            <div className="header-text">
              <h1 className="app-title">급식 알레르기 알리미</h1>
              <p className="app-subtitle">부산진여자중학교</p>
            </div>
          </div>

          {/* 컨트롤 */}
          <div className="controls">
            <MonthSelector
              year={selectedYear}
              month={selectedMonth}
              onChange={handleMonthChange}
            />
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />

            {/* 사용자 정보 + 로그아웃 */}
            <div className="header-user">
              <span className="user-email" title={user.email}>
                {user.email}
              </span>
              <button
                id="logout-btn"
                className="logout-btn"
                onClick={handleLogout}
                aria-label="로그아웃"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── 본문 ── */}
      <main className="app-main">
        {loading && (
          <div className="loading-wrap">
            <span className="spinner" aria-label="로딩 중" />
            <p className="loading-text">급식 데이터를 불러오는 중…</p>
          </div>
        )}

        {error && (
          <div className="error-wrap">
            <span className="error-icon" aria-hidden="true">⚠️</span>
            <p className="error-text">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="view-container">
            {viewMode === 'monthly' && (
              <MonthlyView
                year={selectedYear}
                month={selectedMonth}
                mealRows={mealRows}
              />
            )}
            {viewMode === 'weekly' && (
              <WeeklyView
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                mealRows={mealRows}
              />
            )}
            {viewMode === 'daily' && (
              <DailyView
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                mealRows={mealRows}
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
