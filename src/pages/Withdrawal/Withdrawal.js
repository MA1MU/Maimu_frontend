import React from 'react';
import './Withdrawal.css';
import SmallLogoImg from '../../images/SmallLogo.svg';
import MiniLogo from '../../images/Withdrawal/MiniLogo.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';
import axios from 'axios';

const Withdrawal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const focusedIcon = location.state?.focusedIcon;

  const access_token = localStorage.getItem("access_token");

  const handleWithdrawal = async () => {
    try {
      const response = await axios.delete(`${api.baseUrl}/user/logout`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      console.log("탈퇴 성공");
      localStorage.removeItem("access_token");
  
      navigate('/');
  
    } catch (error) {
      // 에러 발생시 처리할 로직
      if (error.response) {
        // 서버로부터 에러 응답을 받았을 때
        console.error("탈퇴 요청에 실패했습니다. 서버 응답:", error.response.data);
      } else if (error.request) {
        // 요청이 완료되고 응답을 받지 못했을 때
        console.error("탈퇴 요청에 실패했습니다. 응답을 받지 못했습니다.");
      } else {
        // 요청을 보내기 전에 발생한 에러
        console.error("탈퇴 요청에 실패했습니다. 에러 메시지:", error.message);
      }
    }
  };
  

  const handleGoBack=() => {
    navigate('/MainPage', { state: { focusedIcon: focusedIcon } });
  };


  return (
    <div className='Withdrawal'>
        <div className='JustifyCenter'> 
            <img className='SmallLogoImg' src={SmallLogoImg} alt='SmallLogoImg'/>
            <div className='WithdrawalContainer'>탈퇴 안내</div>
            <div className='MemberWithdrawalGuide'>
                <li>계정이 영구 삭제됩니다.</li>
                <li>모든 편지와 활동 내역이 삭제됩니다.</li>
                <li>삭제된 정보는 복구할 수 없습니다.</li>
                <li>동일 계정으로 재가입 불가합니다.</li>
                <p>MAIMU와 함께 좋은 추억을 <br />만드셨길 바랍니다. 감사합니다.</p>
                <button className='WithdrawalButton' onClick={handleWithdrawal}>탈퇴하기</button>
                <button className='BackButton' onClick={handleGoBack}>돌아가기</button>
            </div>
            <img className='MiniLogo' src={MiniLogo} alt='MiniLogo'/>
        </div>
        
    </div>
  )
}

export default Withdrawal