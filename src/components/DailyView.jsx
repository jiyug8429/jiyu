/**
 * 일간 보기 — 하루의 급식 메뉴 전체 표시
 *
 * - 이전 날 / 다음 날 이동 버튼
 * - 메뉴 이름 + 알레르기 번호 표시
 * - 데이터 없으면 "급식 정보가 없습니다"
 *
 * @param {{
 *   selectedDate: Date,
 *   onDateChange: (date: Date) => void,
 *   mealRows: Array
 * }} props
 */

import { parseDdishNm } from '../utils/parseMenu';
import { toYYYYMMDD, buildMealMap, WEEKDAY_LABELS } from '../utils/dateUtils';

function DailyView({ selectedDate, onDateChange, mealRows }) {
  const mealMap = buildMealMap(mealRows);
  const dateStr = toYYYYMMDD(selectedDate);

  const rows = mealMap[dateStr];
  const menuItems = rows ? parseDdishNm(rows[0].DDISH_NM) : [];

  // 이전/다음 날 이동
  const moveDay = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    onDateChange(d);
  };

  // 날짜 표시: "2026년 10월 3일 (토)"
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth() + 1;
  const day = selectedDate.getDate();
  const weekday = WEEKDAY_LABELS[selectedDate.getDay()];
  const displayDate = `${year}년 ${month}월 ${day}일 (${weekday})`;

  const isSun = selectedDate.getDay() === 0;
  const isSat = selectedDate.getDay() === 6;

  return (
    <div className="daily-view">
      {/* 날짜 탐색 */}
      <div className="day-nav">
        <button className="nav-btn" onClick={() => moveDay(-1)} aria-label="이전 날">
          ‹ 이전
        </button>
        <h2 className={`day-title${isSun ? ' sunday' : isSat ? ' saturday' : ''}`}>
          {displayDate}
        </h2>
        <button className="nav-btn" onClick={() => moveDay(1)} aria-label="다음 날">
          다음 ›
        </button>
      </div>

      {/* 메뉴 목록 */}
      {menuItems.length > 0 ? (
        <ul className="daily-menu">
          {menuItems.map((item, idx) => (
            <li key={idx} className="daily-menu-item">
              <span className="menu-name">{item.name}</span>
              {item.allergyNums.length > 0 && (
                <span className="allergy-tag">
                  [{item.allergyNums.join('·')}]
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-data">급식 정보가 없습니다.</p>
      )}
    </div>
  );
}

export default DailyView;
