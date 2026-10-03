/**
 * DDISH_NM 문자열을 파싱해서 날짜별 메뉴 배열을 반환합니다.
 *
 * @param {string} ddishNm - NEIS API의 DDISH_NM 값
 * @returns {Array<{ name: string, allergyNums: number[] }>}
 *
 * 예시 입력: "쌀밥<br/>된장국(5.9.)<br/>진25팀<br/>삼겹살구이(2.5.10.16.)"
 * 예시 출력: [
 *   { name: "쌀밥",         allergyNums: [] },
 *   { name: "된장국",       allergyNums: [5, 9] },
 *   { name: "진25팀",       allergyNums: [] },       // 숫자 아닌 괄호 → 제외
 *   { name: "삼겹살구이",   allergyNums: [2, 5, 10, 16] },
 * ]
 */

// 괄호 안이 '숫자 + 점' 조합으로만 이뤄진 경우에만 알레르기 번호로 인정
// ex) "(1.2.13.)"  → 유효
// ex) "(진25)"     → 무효 (숫자가 아닌 문자 포함)
const ALLERGY_PATTERN = /\(([\d.]+)\)\s*$/;

/**
 * 단일 메뉴 문자열을 파싱합니다.
 * @param {string} raw - e.g. "삼겹살구이(2.5.10.16.)"
 * @returns {{ name: string, allergyNums: number[] }}
 */
export function parseMenuItem(raw) {
  const trimmed = raw.trim();
  const match = trimmed.match(ALLERGY_PATTERN);

  if (!match) {
    // 괄호가 없거나 유효한 알레르기 패턴이 아님
    return { name: trimmed, allergyNums: [] };
  }

  // 괄호 부분을 이름에서 제거
  const name = trimmed.slice(0, trimmed.length - match[0].length).trim();

  // "2.5.10.16." → [2, 5, 10, 16] (빈 문자열, NaN 제거)
  const allergyNums = match[1]
    .split('.')
    .map((s) => parseInt(s, 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= 19);

  return { name, allergyNums };
}

/**
 * DDISH_NM 전체 문자열을 파싱합니다.
 * @param {string} ddishNm
 * @returns {Array<{ name: string, allergyNums: number[] }>}
 */
export function parseDdishNm(ddishNm) {
  if (!ddishNm) return [];

  return ddishNm
    .split('<br/>')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map(parseMenuItem);
}
