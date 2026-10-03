/**
 * 날짜 관련 공통 유틸리티
 * - neisApi.js에도 동일 함수가 내부적으로 존재하나, 뷰 컴포넌트에서 공유하기 위해 별도 모듈로 분리
 */

/**
 * Date → "YYYYMMDD" 문자열
 * @param {Date} date
 * @returns {string}
 */
export function toYYYYMMDD(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

/**
 * "YYYYMMDD" → "YYYY-MM-DD" 표시용 문자열
 * @param {string} yyyymmdd
 * @returns {string}
 */
export function formatDate(yyyymmdd) {
  return `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
}

/**
 * Date의 해당 주 일요일(주 시작)을 반환
 * @param {Date} date
 * @returns {Date}
 */
export function getWeekStart(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay()); // 일요일로 이동
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * mealRows 배열을 날짜 키(MLSV_YMD)로 인덱싱한 Map 반환
 * 같은 날 여러 식사가 있을 경우 배열로 저장 (중학교는 중식 1개가 일반적)
 *
 * @param {Array} mealRows
 * @returns {Object<string, Array>}  { '20261001': [row, ...], ... }
 */
export function buildMealMap(mealRows) {
  const map = {};
  for (const row of mealRows) {
    const key = row.MLSV_YMD;
    if (!map[key]) map[key] = [];
    map[key].push(row);
  }
  return map;
}

/**
 * 두 Date가 같은 날인지 비교
 * @param {Date} a
 * @param {Date} b
 * @returns {boolean}
 */
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** 요일 레이블 (일요일부터) */
export const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
