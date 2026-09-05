import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "./InformationModal.css";
import InformationToggle from "../../images/StartPage/InformationToggle.svg";
import InformationXButton from "../../images/StartPage/InformationXButton.svg";

function InformationModal({ isInformationOpen, closeInformationModal, page }) {
  // 기존에는 X 버튼으로만 닫을 수 있었다. Esc 로도 닫는다.
  useEffect(() => {
    if (!isInformationOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeInformationModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isInformationOpen, closeInformationModal]);

  return (
    <div
      style={{
        display: isInformationOpen ? "block" : "none",
      }}
    >
      {/* 어두운 배경을 누르면 닫힌다. 내용 위 클릭은 target 비교로 걸러진다. */}
      <div
        className="InformationToggleOut"
        role="dialog"
        aria-modal="true"
        aria-label="마이무 이용 안내"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeInformationModal();
        }}
      >
        <div className="InformationToggle">
          <img src={InformationToggle} alt="" aria-hidden="true" />
          <button
            type="button"
            className="InformationXBtn"
            onClick={closeInformationModal}
            aria-label="안내 닫기"
          >
            <img src={InformationXButton} alt="" aria-hidden="true" />
          </button>
        </div>
        <Swiper
          slidesPerView={1}
          centeredSlides={false}
          spaceBetween={30}
          pagination={{ el: ".swiper-pagination", clickable: true }}
          navigation={{
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          }}
          modules={[Navigation, Pagination]}
          className="InfoSwiper"
        >
          <SwiperSlide className="Swiper">
            <div className="SwiperContainer">
              <div className="Friend_T SwiperTitle">
                나랑 친구하자!<div className="Friend_T_Underbar"></div>
              </div>
              <div className="Friend_C SwiperContent">
                MAIMU는 3월 4일부터 3월 31일까지 <br /> 새학기 친구들이 마이무와
                함께 남겨준 <br /> 나의 첫인상을 확인하는 서비스예요!
              </div>
              <div className="HowToUse_T SwiperTitle">
                MAIMU는 어떻게 이용하나요?
                <div className="HowToUse_T_Underbar"></div>
              </div>
              {page === "WriteDetailPage" ? (
                <div className="HowToUse_C SwiperContent">
                  <ul>
                    <li>친구가 받은 마이무는 볼 수 없어요.</li>
                    <li>
                      친구에게 주고 싶은 마이무 맛을 선택해주세요. 마이무로
                      친구에 대한 애정도를 드러내주세요.
                    </li>
                    <li>3월 4일부터 친구에게 마이무를 보낼 수 있어요.</li>
                    <li>
                      내가 쓴 마이무는 3월 31일 이후에 친구가 확인할 수 있어요.
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="HowToUse_C SwiperContent">
                  <ul>
                    <li>가입하고 내 프로필 설정해요.</li>
                    <li>
                      사물함 별로 그룹을 만들고 친구들에게 링크를 공유해요.
                    </li>
                    <li>
                      사물함 안에는 친구들이 남겨준 내 첫인상이 적힌 마이무가
                      들어있어요.
                    </li>
                    <li>3월 4일부터 친구에게 마이무를 보낼 수 있어요.</li>
                    <li>3월 31일 전까지는 받은 마이무를 확인할 수 없어요.</li>
                  </ul>
                </div>
              )}
            </div>
          </SwiperSlide>
          <SwiperSlide className="Swiper">
            <div className="SwiperContainer">
              <div className="WhatFlavor_T SwiperTitle">
                MAIMU는 무슨 맛이 있나요?
                <div className="WhatFlavor_T_Underbar"></div>
              </div>
              {page === "WriteDetailPage" ? (
                <div className="WhatFlavor_C1 SwiperContent">
                  내가 친구에게 주고 싶은...
                </div>
              ) : (
                <div className="WhatFlavor_C1 SwiperContent">
                  친구가 나에게 주고 싶은...
                </div>
              )}
              <div className="WhatFlavor_C2 SwiperContent">
                <ul>
                  <li>석류 - 우리 사이 당도 0~33% (수줍…)</li>
                  <li>유자 - 우리 사이 당도 34~66% (데헷)</li>
                  <li>매실 - 우리 사이 당도 67~99% (끼야호)</li>
                </ul>
              </div>
              <div className="WhoMade_T1 SwiperTitle">
                누가 만든 서비스인가요?
                <div className="WhoMade_T_Underbar"></div>
              </div>
              <div className="WhoMade_C SwiperContent">
                <ul>
                  <li>
                    MAIMU는 홍익대, 이화여대, 고려대, 세종대, 서울여대 학생
                    8명으로 구성된 대학생 팀 ‘수감자들(Wednesday’s Potatoes)’이
                    만든 서비스예요.
                  </li>
                  <li>IT 연합동아리 ‘코테이토’에서 탄생한 팀이에요.</li>
                </ul>
              </div>
              <a
                className="InstaLink"
                href="https://www.instagram.com/maimu.official/?igsh=cm1lYWhuNTB4eTY2&utm_source=qr"
              >
                @maimu.official
              </a>
            </div>
          </SwiperSlide>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </Swiper>
      </div>
    </div>
  );
}

export default InformationModal;
