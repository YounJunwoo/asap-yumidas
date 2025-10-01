import { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [rows, setRows] = useState([]);
  const [serial, setSerial] = useState('');
  const [product, setProduct] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  //일련번호 초기 데이터 불러오기
  useEffect(() => {
    fetch('http://localhost:5000/api/admin/serial', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRows(data.items.map(item => ({ ...item, selected: false })));
        }
      })
      .catch(err => console.log('일련번호 데이터 불러오기 실패', err));
  }, []);

  // 일련번호 등록
  const handleRegister = async () => {
    
    // 입력값 유효성 검사
    if (!serial.trim()) {
      alert('일련번호를 입력해주세요.');
      return;
    }
    if (!product) {
      alert('작물을 선택해주세요.');
      return;
    }
// api수정 
    try {
      const res = await fetch('http://localhost:5000/api/admin/serial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ serial: serial.trim(), crop: product }),
      });

      const data = await res.json();
      if (data.success) {
        const newItem = {
        id: data.item.id,
        serial: data.item.serial,
        crop: data.item.crop,
        date: data.item.date,
        selected: false
      };
      
      setRows(prev => [newItem, ...prev]);
      setSerial('');
      setProduct('');
      alert('등록 성공');
      } else {
        alert('일련번호 등록 실패');
      }
    } catch (err) {
      console.log('일련번호 등록 오류', err);
    }
  };

  // 테이블 전체 선택 및 해제
  const handleToggleAll = () => {
    const next = !selectAll;
    setSelectAll(next);
    setRows(prev => prev.map(r => ({ ...r, selected: next })));
  };

  //  테이블 개별 선택
  const handleToggleRow = idx => {
    setRows(prev =>
      prev.map((r, i) => (i === idx ? { ...r, selected: !r.selected } : r))
    );
  };

  // 테이블 선택항목 삭제
  const handleDeleteSelected = async () => {
    const selectedItems = rows.filter(r => r.selected).map(r => r.id);
    if (selectedItems.length === 0) return;

    if (!window.confirm(`선택한 ${selectedItems.length}개 항목을 삭제하시겠습니까?`)) {
      return;
    }
    //api 수정
    try {
      const res = await fetch('http://localhost:5000/api/admin/serial', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ids: selectedItems }),
      });
      const data = await res.json();

      if (data.success) {
        setRows(prev => prev.filter(r => !r.selected));
        setSelectAll(false);
      } else {
        console.log('테이블 데이터 삭제 실패');
      }
    } catch (err) {
      console.error('테이블 데이터 삭제 오류', err);
    }
  };

  return (
    <div className="adminPage">
      <div className="container">
        <div className="main-grid">
          <div className ="header-space">
          <section className="title-section">
            <h2 className="form-title">관리자 페이지</h2>
            <div className="form-desc">일련번호를 등록, 조회하세요.</div>
          </section>
          <div className="label">일련번호 등록하기</div>
          </div>
          <section className="serial-form-section">
            <div className="serial-form-right">
              <div className="serial-form-controls">
                <input
                  type="text"
                  className="serial-text-input"
                  placeholder="일련번호를 입력하세요"
                  value={serial}
                  onChange={e => setSerial(e.target.value)}
                />
                <select
                  className="serial-select-input"
                  value={product}
                  onChange={e => setProduct(e.target.value)}>
                  {/*작물 선택지 */}
                  <option value="Lettuce">상추</option>
                  <option value="Tomato">토마토</option>
                  <option value="Potato">감자</option>
                  <option value="Carrot">당근</option>
                  <option value="Garlic">마늘</option>
                  <option value="Eggplant">가지</option>
                  <option value="Other">기타</option>
                </select>
                <button className="serial-primary-btn" onClick={handleRegister}>
                  등록하기
                </button>
              </div>
            </div>
          </section>

          <section className="table-header">
            <div className="table-title">전체 내역</div>
            <button className="serial-delete-btn" onClick={handleDeleteSelected}>
              삭제하기
            </button>
          </section>

          <section className="table-section">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="checkbox-cell">
                    <input type="checkbox" checked={selectAll} onChange={handleToggleAll} />
                  </th>
                  <th>일련번호</th>
                  <th>작물</th>
                  <th>등록일자</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={row.id}>
                    <td className="checkbox-cell">
                      <input
                        type="checkbox"
                        checked={row.selected}
                        onChange={() => handleToggleRow(idx)}
                      />
                    </td>
                    <td className="table-serial-number">{row.serial}</td>
                    <td>{row.crop}</td>
                    <td className="table-date">{row.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
