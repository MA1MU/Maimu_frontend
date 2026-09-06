import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import './ProfileEdit.css';
import SpeechBubble from '../../images/ProfileEdit/SpeechBubble.svg';
import Pomegranate from '../../images/ProfileEdit/Pomegranate.svg';
import Plum from '../../images/ProfileEdit/Plum.svg';
import Arrow from '../../images/ProfileEdit/NextArrow.svg';
import PomegranateBubble from '../../images/ProfileEdit/PomegranateBubble.svg';
import CitronBubble from '../../images/ProfileEdit/CitronBubble.svg';
import PlumBubble from '../../images/ProfileEdit/PlumBubble.svg';
import Citron from '../../images/ProfileEdit/Citron.svg';

import '../../App.css'

// 화면에 놓이는 순서 그대로. name 은 그대로 서버까지 가는 값이라 바꾸지 않는다.
const PROFILES = [
  { name: '석류', image: Pomegranate, bubble: PomegranateBubble },
  { name: '유자', image: Citron, bubble: CitronBubble },
  { name: '매실', image: Plum, bubble: PlumBubble },
];

const ProfileEdit = () => {
  const [iconName, setIconName] = useState('');
  const [bubbleImage, setBubbleImage] = useState(SpeechBubble);

  const navigate = useNavigate();

  const handleIconClick = (name, bubble) => {
    setIconName(name);
    setBubbleImage(bubble);
  };

  const handleNextButtonClick = () => {
    // 석류, 매실, 유자 중 어떤 아이콘이 포커스되어 있는지 정보를 같이 전달
    navigate('/MyPage', { state: { focusedIcon: iconName } });
  };

  return (

    <div className='ProfileEdit'>
      <div className="JustifyContainer">
        <img className='SpeechBubble' src={bubbleImage} alt='' />

        <div className="MaimuContainer">
          {PROFILES.map(({ name, image, bubble }) => {
            const selected = iconName === name;
            return (
              <button
                type='button'
                key={name}
                className={`MaimuChoice${selected ? ' isSelected' : ''}`}
                aria-pressed={selected}
                onClick={() => handleIconClick(name, bubble)}
              >
                <span className='Twinkle' aria-hidden='true' />
                <img className='MaimuChoiceImg' src={image} alt='' />
                <span className='IconName'>{name}</span>
              </button>
            );
          })}
        </div>

        <button
          type='button'
          className='NextButton'
          onClick={handleNextButtonClick}
          disabled={!iconName}
        >
          다음 <img className='Arrow' src={Arrow} alt='' />
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
