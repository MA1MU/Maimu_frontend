import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './MyPageProfileEdit.css';
import SpeechBubble from '../../images/ProfileEdit/SpeechBubble.svg';
import Pomegranate from '../../images/ProfileEdit/Pomegranate.svg';
import Plum from '../../images/ProfileEdit/Plum.svg';
import Arrow from '../../images/ProfileEdit/NextArrow.svg';
import PomegranateBubble from '../../images/ProfileEdit/PomegranateBubble.svg';
import CitronBubble from '../../images/ProfileEdit/CitronBubble.svg';
import PlumBubble from '../../images/ProfileEdit/PlumBubble.svg';
import TwinkleImg from '../../images/ProfileEdit/Twinkle.svg';
import Citron from '../../images/ProfileEdit/Citron.svg';

import '../../App.css'

const MyPageProfileEdit = () => {
  const [name, setName] = useState('');
  const [iconName, setIconName] = useState('');
  const [iconPosition, setIconPosition] = useState({ top: 0, left: 0 });
  const [bubbleImage, setBubbleImage] = useState(SpeechBubble);

  const navigate = useNavigate();

  const handleIconClick = (iconName, position, bubbleImage) => {
    setName(iconName);
    setIconName(iconName);
    setIconPosition(position);
    setBubbleImage(bubbleImage);
  };

  const handleNextButtonClick = () => {
    // 석류, 매실, 유자 중 어떤 아이콘이 포커스되어 있는지 정보를 같이 전달
    navigate('/MyPageEdit', { state: { focusedIcon: iconName } });
  };

  return (

    <div className='ProfileEdit'>
      <div className="JustifyContainer">
        <img className='SpeechBubble' src={bubbleImage} alt='SpeechBubble' />
        {iconName === '석류' && <img className='PomegranateTwinkle' src={TwinkleImg} alt='TwinkleImg'/>}
        {iconName === '유자' && <img  className='CitronTwinkle' src={TwinkleImg} alt='TwinkleImg'/>}
        {iconName === '매실' && <img className='PlumTwinkle' src={TwinkleImg} alt='TwinkleImg'/>}
      
      <div className="MaimuContainer">
      <img
        className='Pomegranate'
        src={Pomegranate}
        alt='Pomegranate'
        onClick={() =>
          handleIconClick('석류', { top: 487, marginRight:"236px" }, PomegranateBubble)
        }
      />
      <img
        className='Citron'
        src={Citron}
        alt='Citron'
        onClick={() =>
          handleIconClick('유자', { top: 487 }, CitronBubble)
        }
      />
      <img
        className='Plum'
        src={Plum}
        alt='Plum'
        onClick={() =>
          handleIconClick('매실', { top: 487, marginLeft:"232px" }, PlumBubble)
        }
      />
      </div>

  

      {name && (
        <div
          className='IconName'
          style={{ 
            position: 'absolute',
           ...iconPosition }}
        >
          <p>{name}</p>
        </div>
      )}

{iconName && (
        <button className='NextButton' onClick={handleNextButtonClick}>
          다음 <img className='Arrow' src={Arrow} alt='Arrow' />
        </button>
      )}
      </div>
    </div>
  );
};

export default MyPageProfileEdit;
