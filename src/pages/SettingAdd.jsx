import "./SettingAdd.css";
import Settingbar from "../components/Settingbar";
import { useEffect, useState } from "react";
import DeviceAdd from "../components/DeviceAdd";

const SettingAdd = () => {
  const [crops, setCrops] = useState([]);
  const [newCrop, setNewCrop] = useState("");

  // 작물 목록 확인
  const fetchCrops = async () => {
    try {
      const res = await fetch("");//api url
      const data = await res.json();
      setCrops(data);
    } catch (error) {
      console.log("작물 목록 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  // 작물 추가 api url 
  const handleAddCrop = async () => {
    if (newCrop.trim() === "") return;

    try {
      const res = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: newCrop })
      });

      if (!res.ok) throw new Error("추가 실패");

      setNewCrop("");
      fetchCrops(); 
    } catch (error) {
      console.log("작물 추가 실패:", error);
    }
  };

  const handleCheckboxChange = (id) => {
    setCrops((prev) =>
      prev.map((crop) =>
        crop.id === id ? { ...crop, checked: !crop.checked } : crop
      )
    );
  };

  //작물 삭제+url api
  const handleDeleteSelected = async () => {
    const idsToDelete = crops.filter(c => c.checked).map(c => c.id);
    if (idsToDelete.length === 0) return;

    try {
      const res = await fetch("", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ids: idsToDelete })
      });

      if (!res.ok) throw new Error("삭제 실패");

      fetchCrops(); 
    } catch (error) {
      console.log("작물 삭제 실패:", error);
    }
  };

  return (
    <div className="settingbar-row">
      <Settingbar />
      <div className="addCard">
        <div className="addHeader">
          <span className="addTitle">작물추가</span>
        </div>
        <div className="addActions">
          <input
            type="text"
            placeholder="추가 작물 입력"
            value={newCrop}
            onChange={(e) => setNewCrop(e.target.value)}
            className="addInput"
          />
          <button onClick={handleAddCrop} className="addBtn">추가</button>
          <button onClick={handleDeleteSelected} className="deleteBtn">삭제</button>
        </div>
        <table className="addTable">
          <thead>
            <tr>
              <th><input type="checkbox" disabled /></th>
              <th>작물명</th>
            </tr>
          </thead>
          <tbody>
            {crops.map((crop) => (
              <tr key={crop.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={crop.checked || false}
                    onChange={() => handleCheckboxChange(crop.id)}
                  />
                </td>
                <td>{crop.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <DeviceAdd />
      </div>
    </div>
  );
};

export default SettingAdd;

/*
  {
    "id": number,        // 작물 고유 ID
    "name": string,      // 작물 이름
    "checked": boolean   // 체크박스 상태 (선택적)
  }*/
