import { parseDdishNm } from '../utils/parseMenu';

/**
 * 날짜별 급식 메뉴를 텍스트로 표시하는 컴포넌트
 *
 * @param {{ mealRows: Array }} props
 *   mealRows: NEIS API row 배열 (fetchMealData의 반환값)
 */
function MealList({ mealRows }) {
  if (!mealRows || mealRows.length === 0) {
    return <p className="no-data">급식 정보가 없습니다.</p>;
  }

  return (
    <ul className="meal-list">
      {mealRows.map((row) => {
        const date = row.MLSV_YMD;          // "20261001"
        const menuItems = parseDdishNm(row.DDISH_NM);

        // 날짜 포맷: "20261001" → "2026-10-01"
        const formattedDate = `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;

        return (
          <li key={date} className="meal-day">
            <h2 className="meal-date">{formattedDate}</h2>
            <ul className="menu-items">
              {menuItems.map((item, idx) => (
                <li key={idx} className="menu-item">
                  <span className="menu-name">{item.name}</span>
                  {item.allergyNums.length > 0 && (
                    <span className="allergy-tag">
                      알레르기: {item.allergyNums.join(', ')}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

export default MealList;
