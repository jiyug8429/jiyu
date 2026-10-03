/**
 * 월간 / 주간 / 일간 보기 전환 버튼 그룹
 *
 * @param {{ viewMode: string, onChange: (mode: string) => void }} props
 */

const MODES = [
  { key: 'monthly', label: '월간' },
  { key: 'weekly',  label: '주간' },
  { key: 'daily',   label: '일간' },
];

function ViewToggle({ viewMode, onChange }) {
  return (
    <div className="view-toggle" role="group" aria-label="보기 모드 선택">
      {MODES.map((m) => (
        <button
          key={m.key}
          className={`toggle-btn${viewMode === m.key ? ' active' : ''}`}
          onClick={() => onChange(m.key)}
          aria-pressed={viewMode === m.key}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

export default ViewToggle;
