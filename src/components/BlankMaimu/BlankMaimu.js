import React from "react";

import GreyMaimu from "../../images/DetailPage/GreyMaimu.svg";

// 게스트 화면에서 '이미 도착한 쪽지가 있다'는 것만 알려주는 자리 표시자.
// 누를 수 없고 내용도 담지 않으므로 보조기기에서는 숨긴다.
const BlankMaimu = () => (
  <img className="GreyMaimu BlankMaimu" src={GreyMaimu} alt="" aria-hidden="true" />
);

export default BlankMaimu;
