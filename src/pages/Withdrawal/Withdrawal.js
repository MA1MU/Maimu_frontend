import React from 'react';
import './Withdrawal.css';
import SmallLogoImg from '../../images/SmallLogo.svg';
import MiniLogo from '../../images/Withdrawal/MiniLogo.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../api/api';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Withdrawal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const focusedIcon = location.state?.focusedIcon;

  const access_token = localStorage.getItem("access_token");

  const handleWithdrawal = async () => {
    if (!access_token) return;

    try {
      console.log("Requesting member withdrawal...");
      
      const response = await axios.delete(`${api.baseUrl}/v1/api/member`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (response.status === 204 || response.status === 200) {
        toast.success("회원 탈퇴가 완료되었습니다.", {
          autoClose: 2000,
          hideProgressBar: true,
        });

        localStorage.removeItem("access_token");
        localStorage.removeItem("temp_token");

        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (error) {
      console.error("탈퇴 요청 중 오류 발생:", error);
      
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || '회원 탈퇴 중 오류가 발생했습니다.';
        toast.error(errorMessage, {
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        toast.error('서버 오류가 발생했습니다. 다시 시도해주세요.', {
          autoClose: 3000,
          hideProgressBar: true,
        });
      }
    }
  };
  

  const handleGoBack=() => {
    navigate('/MainPage', { state: { focusedIcon: focusedIcon } });
  };


  return (
    <div className='Withdrawal'>
        <ToastContainer />
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