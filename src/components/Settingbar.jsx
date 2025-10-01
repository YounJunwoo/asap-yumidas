import React from "react";
import { Link } from "react-router-dom";
import './SettingBar.css';
import userRoundPen from "../assets/user-round-pen.svg";
import globeIcon from "../assets/globe.svg";
import hardDriveIcon from "../assets/hardDrive.svg";


const SettingBar = () => {
  return (
    <div className="settingbar">
      <div className="settingbarTitle">설정</div>
      <ul className="settingbarMenu">
        <li>
          <Link to="/setting" className="settingbarMenu-btn">
            <img src={userRoundPen} alt="프로필" className="settingbarIcon" />프로필</Link>
        </li>
        <li>
          <Link to="/settingnetwork" className="settingbarMenu-btn">
            <img src={globeIcon} alt="네트워크" className="settingbarIcon" />네트워크</Link>
        </li>
        <li>
          <Link to="/settingaccount" className="settingbarMenu-btn">
            <img src={hardDriveIcon} alt="계정 관리" className="settingbarIcon" />계정 관리</Link>
        </li>
      </ul>
    </div>
  );
};

export default SettingBar;
