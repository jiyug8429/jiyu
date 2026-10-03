/**
 * NEIS API 호출 유틸리티
 *
 * 문서: https://open.neis.go.kr/hub/mealServiceDietInfo
 * - ATPT_OFCDC_SC_CODE: C10  (부산광역시교육청)
 * - SD_SCHUL_CODE:      7181089 (부산진여자중학교)
 */

const BASE_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
const ATPT_CODE = 'C10';
const SCHUL_CODE = '7181089';

/**
 * 날짜를 YYYYMMDD 형식 문자열로 변환
 * @param {Date} date
 * @returns {string}
 */
function toYYYYMMDD(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
}

/**
 * 해당 연월의 첫날과 마지막 날을 반환
 * @param {number} year
 * @param {number} month - 1-indexed (1~12)
 * @returns {{ from: string, to: string }} - YYYYMMDD 형식
 */
function getMonthRange(year, month) {
  const from = toYYYYMMDD(new Date(year, month - 1, 1));
  const to = toYYYYMMDD(new Date(year, month, 0)); // 다음달 0일 = 이번달 마지막날
  return { from, to };
}

/**
 * 특정 연월의 급식 데이터를 NEIS API에서 조회합니다.
 *
 * @param {number} year   - e.g. 2026
 * @param {number} month  - 1-indexed, e.g. 10
 * @returns {Promise<Array>} - NEIS row 배열 (rawData.mealServiceDietInfo[1].row)
 * @throws {Error} API 호출 실패 또는 데이터 없음
 */
export async function fetchMealData(year, month) {
  const apiKey = import.meta.env.VITE_NEIS_KEY;

  if (!apiKey || apiKey === '여기에_발급받은_NEIS_API키를_입력하세요') {
    throw new Error('NEIS API 키가 설정되지 않았습니다. .env 파일의 VITE_NEIS_KEY를 확인해주세요.');
  }

  const { from, to } = getMonthRange(year, month);

  const params = new URLSearchParams({
    KEY: apiKey,
    Type: 'json',
    pIndex: '1',
    pSize: '100',            // 한 달 최대 약 23일 × 1식 = 여유있게 100
    ATPT_OFCDC_SC_CODE: ATPT_CODE,
    SD_SCHUL_CODE: SCHUL_CODE,
    MLSV_FROM_YMD: from,
    MLSV_TO_YMD: to,
  });

  const url = `${BASE_URL}?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP 오류: ${response.status}`);
  }

  const data = await response.json();

  // NEIS API 에러 응답 처리
  // 데이터 없는 경우: { RESULT: { CODE: "INFO-200", MESSAGE: "해당하는 데이터가 없습니다." } }
  if (data.RESULT) {
    if (data.RESULT.CODE === 'INFO-200') {
      return []; // 데이터 없음 (정상 케이스)
    }
    throw new Error(`NEIS API 오류: ${data.RESULT.CODE} - ${data.RESULT.MESSAGE}`);
  }

  // 정상 응답 구조: { mealServiceDietInfo: [ { head: [...] }, { row: [...] } ] }
  const rows = data?.mealServiceDietInfo?.[1]?.row;
  if (!rows || rows.length === 0) {
    return [];
  }

  return rows;
}
