import React, { useEffect, useState } from 'react';
import './PersonalInformation.css';
import Settingbar from '../components/Settingbar'; // 실제 위치에 따라 경로 조정

const PersonalInformation = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: '********',
    phone: ''
  });
  const [isChecked, setIsChecked] = useState(false);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/user-info", {
        method: "GET",
        credentials: "include"
      });
      const data = await res.json();
      if (data.success) {
        setUserInfo(data.user);
      } else {
        alert(data.message || "사용자 정보를 불러올 수 없습니다.");
      }
    } catch (err) {
      console.error("불러오기 실패:", err);
      alert("서버 연결 실패");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 탈퇴하시겠습니까?")) return;

    try {
      const res = await fetch("http://localhost:5000/api/delete-user", {
        method: "POST",
        credentials: "include"
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) {
        window.location.href = "/"; // 로그인 페이지로 이동
      }
    } catch (err) {
      console.error("회원 탈퇴 실패:", err);
      alert("서버 오류 발생");
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="settingbar-row">
      <Settingbar />
      <div className="PCard">
        <div className="PHeader">
          <span className="Title">개인 정보</span>
          <div className="pActions">
            <button className="pAdd" onClick={handleDelete}>회원 탈퇴</button>
          </div>
        </div>

        <table className="pTable">
          <thead>
            <tr>
              <th style={{ width: '5%' }}></th>
              <th className="rightShift">아이디</th>
              <th className="rightShift">비밀번호</th>
              <th className="rightShift">휴대전화</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
              </td>
              <td className="maskedInfo">{userInfo.email || "정보 없음"}</td>
              <td className="maskedInfo">
                {userInfo.password || "********"} <button className="verifyButton">확인 버튼</button>
              </td>
              <td className="maskedInfo">{userInfo.phone || "정보 없음"}</td>
            </tr>

            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i}>
                <td><input type="checkbox" disabled /></td>
                <td colSpan={3}></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PersonalInformation;

