/**
 * 년도 + 월 선택 드롭다운
 * 선택 변경 시 부모의 onChange(year, month)를 호출 → API 재호출 트리거
 *
 * @param {{
 *   year: number,
 *   month: number,
 *   onChange: (year: number, month: number) => void
 * }} props
 */

// 선택 가능 연도 범위 (필요 시 확장)
const YEAR_OPTIONS = [2024, 2025, 2026, 2027];

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function MonthSelector({ year, month, onChange }) {
  const handleYearChange = (e) => {
    onChange(Number(e.target.value), month);
  };

  const handleMonthChange = (e) => {
    onChange(year, Number(e.target.value));
  };

  return (
    <div className="month-selector">
      <select
        id="year-select"
        value={year}
        onChange={handleYearChange}
        aria-label="연도 선택"
      >
        {YEAR_OPTIONS.map((y) => (
          <option key={y} value={y}>
            {y}년
          </option>
        ))}
      </select>

      <select
        id="month-select"
        value={month}
        onChange={handleMonthChange}
        aria-label="월 선택"
      >
        {MONTH_OPTIONS.map((m) => (
          <option key={m} value={m}>
            {m}월
          </option>
        ))}
      </select>
    </div>
  );
}

export default MonthSelector;
