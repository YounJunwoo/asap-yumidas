import { useState } from "react";
import "../pages/SettingAdd.css";

const DeviceAdd = () => {
  const [publicKey, setPublicKey] = useState("");
  const [isRegistered, setIsRegistered] = useState(null);
  const [checking, setChecking] = useState(false);

  const handleCheck = async () => {
    if (!publicKey.trim()) return;

    setChecking(true);
    try {
      //등록 여부
      const res = await fetch("");//api url
      const data = await res.json();

      if (data.registered) {
        setIsRegistered(true);
      } else {
        //미등록 api url
        await fetch("", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key: publicKey })
        });
        setIsRegistered(false);
      }
    } catch (error) {
      console.log("Error checking key:", error);
    }
  };

  return (
    <div className="device-key-checker">
      <h3 className="section-title">디바이스 연결 정보</h3>

      <div className="input-row">
        <label className="label">● 디바이스 공개키 입력</label>
        <input
          type="text"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          disabled={checking}
        />
        <button onClick={handleCheck} disabled={checking}>확인</button>
      </div>

      <div className="status-row">
        <label className="label">● 등록 상태</label>
        <div className="status-box">
          {isRegistered === null ? null : isRegistered ? (
            <span className="registered">등록되어있음</span>
          ) : (
            <span className="not-registered">등록 완료</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceAdd;

