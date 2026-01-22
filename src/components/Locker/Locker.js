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
    <div className='Locker' onClick={onClick}>
      <img className='LockerIcon' src={lockerIcon} alt='LockerIcon' onClick={onClick}/>
      <div className='GroupName'>{GroupName}</div>
      {unreadMaimuCount > 0 && (
        <div className='UnreadBadge'>{unreadMaimuCount}</div>
      )}
      {GroupName && isDeleting ? <div className='CheckCircle'></div> : null}
      {GroupName && isDeleting ? <div className='delICon'></div> : null}
      {GroupName && isEditing ? <img className='EditIcon'src={EditIcon} alt='EditIcon' /> : null}
    </div>
  );
};

export default Locker;
