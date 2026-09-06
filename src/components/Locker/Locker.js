import React, {useState} from 'react';
import './Locker.css';
import LockerIcon from '../../images/MainPage/Locker.svg';
import GreenLockerIcon from '../../images/MainPage/GreenLocker.svg';
import PinkLockerIcon from '../../images/MainPage/PinkLocker.svg';
import YellowLockerIcon from '../../images/MainPage/YellowLocker.svg';
import EditIcon from '../../images/MainPage/EditIcon.svg';

const Locker = ({ GroupName, groupColor, unreadMaimuCount, isEditing, isDeleting, onClick }) => {

  let lockerIcon;

  switch (groupColor) {
    case '초록':
      lockerIcon = GreenLockerIcon;
      break;
    case '핑크':
      lockerIcon = PinkLockerIcon;
      break;
    case '노랑':
      lockerIcon = YellowLockerIcon;
      break;
    default:
      lockerIcon = LockerIcon; 
      break;
  }

  return (
    <div className={`Locker ${GroupName ? '' : 'isEmpty'}`} onClick={onClick}>
      <img className='LockerIcon' src={lockerIcon} alt='LockerIcon' onClick={onClick}/>
      <div className='GroupName'>{GroupName}</div>
      {/* 안읽음 배지는 CheckCircle / EditIcon 과 좌표(top -227px, right -87px)가
          완전히 같아서, 편집·삭제 모드에서는 겹쳐 보인다. 모드일 때는 숨긴다. */}
      {unreadMaimuCount > 0 && !isEditing && !isDeleting && (
        <div className='UnreadBadge'>{unreadMaimuCount}</div>
      )}
      {GroupName && isDeleting ? <div className='CheckCircle'></div> : null}
      {GroupName && isDeleting ? <div className='delICon'></div> : null}
      {GroupName && isEditing ? <img className='EditIcon'src={EditIcon} alt='EditIcon' /> : null}
    </div>
  );
};

export default Locker;
