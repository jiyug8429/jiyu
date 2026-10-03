/**
 * 주간 보기 — 선택된 날짜가 포함된 주의 7일을 표시
 *
 * - 이전 주 / 다음 주 이동 버튼
 * - 각 날짜의 메뉴 전체 목록(이름만) 표시
 * - 로드된 달(mealRows)에 없는 날짜는 "급식 정보 없음" 표시
 *
 * @param {{
 *   selectedDate: Date,
 *   onDateChange: (date: Date) => void,
 *   mealRows: Array
 * }} props
 */

import { parseDdishNm } from '../utils/parseMenu';
import {
  toYYYYMMDD,
  getWeekStart,
  buildMealMap,
  WEEKDAY_LABELS,
} from '../utils/dateUtils';

function WeeklyView({ selectedDate, onDateChange, mealRows }) {
  const mealMap = buildMealMap(mealRows);

  // 이번 주 일요일 기준으로 7일 생성
  const weekStart = getWeekStart(selectedDate);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const today = new Date();
  const todayStr = toYYYYMMDD(today);

  // 이전/다음 주 이동
  const moveDays = (delta) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + delta);
    onDateChange(d);
  };

  // 주 범위 표시 (예: 2026-09-27 ~ 2026-10-03)
  const rangeLabel = `${toYYYYMMDD(days[0]).slice(0, 4)}-${toYYYYMMDD(days[0]).slice(4, 6)}-${toYYYYMMDD(days[0]).slice(6, 8)} ~ ${toYYYYMMDD(days[6]).slice(0, 4)}-${toYYYYMMDD(days[6]).slice(4, 6)}-${toYYYYMMDD(days[6]).slice(6, 8)}`;

  return (
    <div className="weekly-view">
      {/* 주 탐색 */}
      <div className="week-nav">
        <button className="nav-btn" onClick={() => moveDays(-7)} aria-label="이전 주">
          ‹ 이전
        </button>
        <span className="week-range">{rangeLabel}</span>
        <button className="nav-btn" onClick={() => moveDays(7)} aria-label="다음 주">
          다음 ›
        </button>
      </div>

      {/* 7일 컬럼 */}
      <div className="week-columns">
        {days.map((day, i) => {
          const dateStr = toYYYYMMDD(day);
          const rows = mealMap[dateStr];
          const menuItems = rows ? parseDdishNm(rows[0].DDISH_NM) : [];
          const isToday = dateStr === todayStr;
          const isSun = i === 0;
          const isSat = i === 6;

          return (
            <div
              key={dateStr}
              className={[
                'week-col',
                isToday ? 'today' : '',
                isSun ? 'sunday' : '',
                isSat ? 'saturday' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {/* 날짜 헤더 */}
              <div className="week-col-header">
                <span className="week-weekday">{WEEKDAY_LABELS[i]}</span>
                <span className="week-day">{day.getDate()}</span>
              </div>

              {/* 메뉴 */}
              {menuItems.length > 0 ? (
                <ul className="week-menu">
                  {menuItems.map((item, idx) => (
                    <li key={idx} className="week-menu-item">
                      {item.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-meal">-</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeeklyView;
