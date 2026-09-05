import React from "react";
import "./LockerActionBar.css";

/**
 * 사물함 액션 바.
 * 기본 상태에서는 [＋ 새 그룹] [n/9] [편집] [삭제] 를 보여주고,
 * 편집·삭제 모드에서는 무엇을 해야 하는지 안내문과 [완료] 로 바뀐다.
 *
 * mode  : "edit" | "delete" | null
 * count : 현재 만들어진 그룹 수 (최대 9)
 */
const LockerActionBar = ({ mode, count, onAdd, onEdit, onDelete, onExit }) => {
  if (mode) {
    const hint =
      mode === "edit"
        ? "수정할 사물함을 선택하세요"
        : "삭제할 사물함을 선택하세요";

    return (
      <div className="LockerActionBar InMode">
        <span className="BarHint" role="status" aria-live="polite">
          {hint}
        </span>
        <button type="button" className="BarDone" onClick={onExit}>
          완료
        </button>
      </div>
    );
  }

  const isFull = count >= 9;

  return (
    <div className="LockerActionBar">
      <button
        type="button"
        className="BarPrimary"
        onClick={onAdd}
        disabled={isFull}
        title={isFull ? "그룹은 최대 9개까지 만들 수 있어요" : undefined}
      >
        <span className="BarPlus" aria-hidden="true">
          +
        </span>
        새 그룹
      </button>

      <span className="BarCount">{count}/9</span>
      <span className="BarDivider" aria-hidden="true" />

      <button type="button" className="BarSecondary" onClick={onEdit}>
        편집
      </button>
      <button type="button" className="BarSecondary" onClick={onDelete}>
        삭제
      </button>
    </div>
  );
};

export default LockerActionBar;
