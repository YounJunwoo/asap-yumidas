import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SmartFarm.css";

const API = import.meta.env?.VITE_API ?? "http://localhost:5000";

export default function SmartFarmList() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openAdd, setOpenAdd] = useState(false);
  const [serial, setSerial] = useState("");
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const [busySerial, setBusySerial] = useState(null);
  const navigate = useNavigate();

  const fetchFarms = async () => {
    setErr("");
    try {
      const res = await fetch(`${API}/api/my-farms`, { credentials: "include" });
      const data = await res.json();
      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error(data.message || "불러오기 실패");
      setFarms(data.farms || []);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFarms(); /* eslint-disable-next-line */ }, []);

  const addFarm = async (e) => {
    e.preventDefault();
    setErr("");
    if (!serial.trim()) return setErr("시리얼을 입력하세요");
    try {
      const res = await fetch(`${API}/api/smartfarm/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ serial, name }),
      });
      const data = await res.json();
      if (res.status === 401) { navigate("/login"); return; }
      if (!res.ok) throw new Error(data.message || "등록 실패");
      setSerial(""); setName(""); setOpenAdd(false);
      fetchFarms();
    } catch (e) {
      setErr(e.message);
    }
  };

  // mode: "unlink" (기본: cleanup_orphan=1) | "delete_all" (오너 단독일 때만)
  const deleteFarm = async (ev, farmSerial, { mode = "unlink" } = {}) => {
    ev.stopPropagation();
    ev.preventDefault();
    setErr("");
    try {
      const qs = new URLSearchParams();
      if (mode === "delete_all") qs.set("delete_all", "1");
      else qs.set("cleanup_orphan", "1");
      setBusySerial(farmSerial);
      const res = await fetch(
        `${API}/api/my-farms/${encodeURIComponent(farmSerial)}?${qs.toString()}`,
        { method: "DELETE", credentials: "include" }
      );
      const data = await res.json();
      if (res.status === 401) { navigate("/login"); return; }
      if (!res.ok || data?.success === false)
        throw new Error(data?.message || "삭제 실패");
      await fetchFarms();
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusySerial(null);
    }
  };

  if (loading) return <div className="container" style={{padding:20}}>불러오는 중…</div>;

  return (
    <div className="container smartfarm-wrap">
      <h2 className="page-title">내 스마트팜</h2>

      {err && <div className="alert">{err}</div>}

      {/* 추가 영역 */}
      <div className="add-box">
        {!openAdd ? (
          <button className="btn-primary" onClick={() => setOpenAdd(true)}>스마트팜 추가</button>
        ) : (
          <form onSubmit={addFarm} className="add-form">
            <input placeholder="시리얼 (필수)" value={serial} onChange={e=>setSerial(e.target.value)} />
            <input placeholder="이름 (선택)" value={name} onChange={e=>setName(e.target.value)} />
            <button className="btn-primary" type="submit">등록</button>
            <button className="btn-ghost" type="button" onClick={()=>setOpenAdd(false)}>취소</button>
          </form>
        )}
      </div>

      {/* 리스트 */}
      {farms.length === 0 ? (
        <div className="empty">
          아직 등록된 스마트팜이 없습니다.
          <div style={{marginTop:12}}>
            <button className="btn-primary" onClick={() => setOpenAdd(true)}>스마트팜 추가</button>
          </div>
        </div>
      ) : (
        <div className="farm-grid">
          {farms.map(f => (
            <div key={f.serial} className="farm-card" onClick={()=>navigate(`/smartfarm/${f.serial}`)}>
              <div className="farm-card-top">
                <span className="farm-serial">{f.serial}</span>
                {f.role && <span className={`role-badge role-${(f.role||'member').toLowerCase()}`}>{f.role}</span>}
              </div>
              <div className="farm-name">{f.name || "이름 없음"}</div>
              <div className="farm-actions">
                <button
                  className="btn-ghost danger-ghost"
                  disabled={busySerial === f.serial}
                  onClick={(ev) => {
                    if (window.confirm(`'${f.serial}'을(를) 내 계정에서 제거할까요?\n(남는 멤버가 없으면 자동 정리)`) ){
                      deleteFarm(ev, f.serial, { mode: "unlink" });
                    }
                  }}
                >
                  {busySerial === f.serial ? "삭제 중…" : "삭제"}
                </button>

                {String(f.role || "").toLowerCase() === "owner" && (
                  <button
                    className="btn-danger"
                    disabled={busySerial === f.serial}
                    onClick={(ev) => {
                      if (window.confirm("⚠ 완전 삭제합니다. 남은 멤버가 없어야 하며 모든 관련 데이터가 정리됩니다. 진행할까요?")) {
                        deleteFarm(ev, f.serial, { mode: "delete_all" });
                      }
                    }}
                  >
                    {busySerial === f.serial ? "삭제 중…" : "완전 삭제"}
                  </button>
                )}
              </div>
              <div className="farm-go">대시보드 열기 →</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
