import { useState, useEffect } from 'react';
import { fetchMealData } from './utils/neisApi';
import ViewToggle from './components/ViewToggle';
import MonthSelector from './components/MonthSelector';
import MonthlyView from './components/MonthlyView';
import WeeklyView from './components/WeeklyView';
import DailyView from './components/DailyView';
import './App.css';

function App() {
  const now = new Date();

  // ── 보기 모드 ──────────────────────────────────────────────
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'weekly' | 'daily'

  // ── 월 선택 (API 호출 기준) ────────────────────────────────
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);

  // ── 주간/일간 뷰 기준 날짜 ─────────────────────────────────
  const [selectedDate, setSelectedDate] = useState(new Date(now));

  // ── 데이터 상태 ────────────────────────────────────────────
  const [mealRows, setMealRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── API 호출: selectedYear, selectedMonth가 바뀔 때마다 재호출 ──
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchMealData(selectedYear, selectedMonth)
      .then((rows) => setMealRows(rows))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedYear, selectedMonth]);

  // ── 월 선택 드롭다운 핸들러 ────────────────────────────────
  const handleMonthChange = (year, month) => {
    setSelectedYear(year);
    setSelectedMonth(month);
    setSelectedDate(new Date(year, month - 1, 1));
  };

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
