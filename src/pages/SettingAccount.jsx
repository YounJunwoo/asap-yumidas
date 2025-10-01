import React, { useEffect, useState } from 'react';
import './SettingAccount.css';
import Settingbar from '../components/SettingBar';

const SettingAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'GET',
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(data.users || []);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error('계정 목록 불러오기 실패:', err);
      alert('서버 연결 실패');
    }
  };

  const handleAccountRegister = async () => {
    const email = prompt('등록할 이메일을 입력하세요:');
    if (!email) return;

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, role: '관리자' }),
      });
      const data = await res.json();
      if (data.success) {
        alert('계정이 등록되었습니다.');
        fetchAccounts();
      } else {
        alert('등록 실패: ' + data.message);
      }
    } catch (err) {
      console.error('등록 에러:', err);
      alert('등록 중 오류 발생');
    }
  };

  const handleAccountDelete = async () => {
    if (selectedEmails.length === 0) {
      alert('삭제할 계정을 선택하세요.');
      return;
    }

    if (!window.confirm('선택한 계정을 삭제하시겠습니까?')) return;

    try {
      const res = await fetch('http://localhost:5000/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ emails: selectedEmails }),
      });
      const data = await res.json();
      if (data.success) {
        alert('삭제되었습니다.');
        setSelectedEmails([]);
        fetchAccounts();
      } else {
        alert('삭제 실패: ' + data.message);
      }
    } catch (err) {
      console.error('삭제 에러:', err);
      alert('삭제 중 오류 발생');
    }
  };

  const toggleEmailSelection = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="settingbar-row">
      <Settingbar />
      <div className="accountCard">
        <div className="accountHeader">
          <span className="accountTitle">계정 관리</span>
          <div className="accountActions">
            <button className="accountAdd" onClick={handleAccountRegister}>
              계정 등록
            </button>
            <button className="accountDelete" onClick={handleAccountDelete}>
              삭제
            </button>
          </div>
        </div>
        <table className="accountTable">
          <thead>
            <tr>
              <th>
                <input type="checkbox" disabled />
              </th>
              <th>계정</th>
              <th>등록일</th>
              <th>권한</th>
              <th>일련번호</th>
              <th>활성화</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.email}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEmails.includes(acc.email)}
                    onChange={() => toggleEmailSelection(acc.email)}
                  />
                </td>
                <td>{acc.email}</td>
                <td>{acc.date || '-'}</td>
                <td>{acc.role || '관리자'}</td>
                <td>{acc.id || '-'}</td>
                <td>
                  {acc.active ? (
                    <span className="accountActive">
                      <span className="dot" /> 활성화
                    </span>
                  ) : (
                    <span className="accountInactive">
                      <span className="dotInactive" /> 비활성화
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 6 - accounts.length) }).map(
              (_, i) => (
                <tr key={`empty-${i}`}>
                  <td>
                    <input type="checkbox" disabled />
                  </td>
                  <td colSpan={5}></td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SettingAccount;
