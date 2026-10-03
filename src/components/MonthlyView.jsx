/**
 * 월간 보기 — 캘린더 그리드
 *
 * - 7열 그리드 (일 ~ 토)
 * - 급식 데이터가 있는 날: 메뉴 이름 목록 표시 (최대 4줄, 나머지는 +N개)
 * - 주말/데이터 없는 날: 날짜만 표시
 *
 * @param {{
 *   year: number,
 *   month: number,
 *   mealRows: Array
 * }} props
 */

import { parseDdishNm } from '../utils/parseMenu';
import { buildMealMap, WEEKDAY_LABELS } from '../utils/dateUtils';

const MAX_ITEMS_VISIBLE = 4;

function MonthlyView({ year, month, mealRows }) {
  const mealMap = buildMealMap(mealRows);

  // 해당 월의 1일 요일(0=일) 과 마지막 날짜
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();

  // 캘린더 셀 배열: null은 이전 달 빈 칸
  const cells = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // 셀을 주 단위로 분리
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const today = new Date();
  const isToday = (day) =>
    day !== null &&
    today.getFullYear() === year &&
    today.getMonth() + 1 === month &&
    today.getDate() === day;

  return (
    <div className="monthly-view">
      {/* 요일 헤더 */}
      <div className="calendar-header">
        {WEEKDAY_LABELS.map((label, i) => (
          <div
            key={label}
            className={`calendar-weekday${i === 0 ? ' sunday' : i === 6 ? ' saturday' : ''}`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 주별 행 */}
      {weeks.map((week, wi) => (
        <div key={wi} className="calendar-week">
          {week.map((day, di) => {
            if (day === null) {
              return <div key={`empty-${di}`} className="calendar-cell empty" />;
            }

            const mm = String(month).padStart(2, '0');
            const dd = String(day).padStart(2, '0');
            const dateKey = `${year}${mm}${dd}`;
            const rows = mealMap[dateKey];          // 해당일 row 배열 (없으면 undefined)
            const menuItems = rows
              ? parseDdishNm(rows[0].DDISH_NM)      // 중식(첫 번째 row) 사용
              : [];

            const visible = menuItems.slice(0, MAX_ITEMS_VISIBLE);
            const overflow = menuItems.length - MAX_ITEMS_VISIBLE;
            const isSun = di === 0;
            const isSat = di === 6;

            return (
              <div
                key={dateKey}
                className={[
                  'calendar-cell',
                  isToday(day) ? 'today' : '',
                  isSun ? 'sunday' : '',
                  isSat ? 'saturday' : '',
                  menuItems.length > 0 ? 'has-meal' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="cell-day">{day}</span>
                {visible.length > 0 && (
                  <ul className="cell-menu">
                    {visible.map((item, idx) => (
                      <li key={idx} className="cell-menu-item">
                        {item.name}
                      </li>
                    ))}
                    {overflow > 0 && (
                      <li className="cell-menu-more">+{overflow}개</li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default MonthlyView;
