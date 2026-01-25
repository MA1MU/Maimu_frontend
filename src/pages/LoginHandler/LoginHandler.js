import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginHandeler = () => {
  const navigate = useNavigate();
  const {search} = useLocation();

  useEffect(() => {
    // 1. URL에서 쿼리 파라미터를 읽어옵니다.
    const params = new URLSearchParams(search);
    const accessToken = params.get('accessToken');
    const tempToken = params.get('tempToken');
    // 2. 토큰 존재 여부에 따른 분기 처리
    if (tempToken) {
      // [시나리오 1] 신규 회원 (PREMEMBER)
      console.log('신규 회원: 프로필 설정이 필요합니다.');
      localStorage.setItem('temp_token', tempToken); // 프로필 저장 API 호출 시 사용할 토큰
      
      // 주소창 세탁 후 이동
      window.history.replaceState({}, null, window.location.pathname);
      navigate('/ProfileEdit', { replace: true });
    } 
    else if (accessToken) {
      // [시나리오 2] 기존 회원 (MEMBER)
      console.log('기존 회원: 메인 페이지로 이동합니다.');
      localStorage.setItem('access_token', accessToken); // 이후 모든 API 호출 헤더에 사용
      
      // 주소창 세탁 후 이동
      window.history.replaceState({}, null, window.location.pathname);
      navigate('/MainPage', { replace: true });
    } 
    else {
      // 토큰이 없는 부적절한 접근
      console.error('인증 정보가 없습니다.');
      navigate('/', { replace: true });
    }
  }, [search, navigate]);


  return (
    <div className="LoginHandeler">
      <div className="JustifyCenter">
        <p>로그인 중입니다.</p>
        <p>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
};

export default LoginHandeler;
