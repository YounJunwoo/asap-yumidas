import { useState, useEffect } from 'react';
import './SettingNetwork.css';
import Settingbar from '../components/SettingBar';
import wifi from '../assets/wifi.svg';
import Switch from '../components/Switch/Switch';

const SettingNetwork = () => {
  const [userInfoItems, setUserInfoItems] = useState([
    { title: 'IPv4 주소', value: '정보 없음' },
    { title: 'DHCP 사용', value: '정보 없음' },
    { title: 'DHCP 서버', value: '정보 없음' },
    { title: 'DNS 서버', value: '정보 없음' },
  ]);

  const [isConnected, setIsConnected] = useState(false);
  const [smartFarmIP, setSmartFarmIP] = useState('연결되지 않음');
  const [networkName, setNetworkName] = useState('');
  const [isLoading] = useState(false);

  useEffect(() => {
    const checkNetworkStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/network-info'); //웹 대시보드 wifi /api url
        if (response.ok) {
          const data = await response.json();
          setIsConnected(data.isConnected);
          setNetworkName(data.networkName || '네트워크 이름');
          setSmartFarmIP(
            data.isConnected
              ? `${data.smartFarmIP}(기본 설정)`
              : '연결되지 않음'
          );

          if (data.isConnected) {
            setUserInfoItems([
              { title: 'IPv4 주소', value: `${data.ipv4}(기본 설정)` },
              { title: 'DHCP 사용', value: data.dhcpEnabled ? '예' : '아니오' },
              { title: 'DHCP 서버', value: data.gateway },
              { title: 'DNS 서버', value: data.dns },
            ]);
          }
        }
      } catch (error) {
        console.error('네트워크 상태 확인 실패:', error);
      }
    };

    checkNetworkStatus();
  }, []);

  const handleWifiToggle = async (newState) => {
    if (newState) {
      // 스마트팜기기 IVp4 + api url
      const response = await fetch('http://localhost:5000/api/network-info', {
        method: 'get',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) return console.log('connect api error');
      const data = await response.json();

      setIsConnected(true);
      setSmartFarmIP(`${data.smartFarmIP}(기본 설정)`);
      setNetworkName(data.networkName || '네트워크 이름');

      setUserInfoItems([
        { title: 'IPv4 주소', value: `${data.ipv4}(기본 설정)` },
        { title: 'DHCP 사용', value: data.dhcpEnabled ? '예' : '아니오' },
        { title: 'DHCP 서버', value: data.gateway },
        { title: 'DNS 서버', value: data.dns },
      ]);
    } else {
      // 스마트팜 wifi 연결 해제요청,api url
      const response = await fetch('', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) return console.log('API 연결 error');

      setIsConnected(false);
      setSmartFarmIP('연결되지 않음');
      setNetworkName('');

      setUserInfoItems([
        { title: 'IPv4 주소', value: '정보 없음' },
        { title: 'DHCP 사용', value: '정보 없음' },
        { title: 'DHCP 서버', value: '정보 없음' },
        { title: 'DNS 서버', value: '정보 없음' },
      ]);
    }
  };

  return (
    <div className="settingbar-row">
      <Settingbar />
      <div className="network-card">
        <div className="networkHeader">
          <span className="networkTitle">네트워크</span>
        </div>

        <div className="wifi-section">
          <img src={wifi} alt="와이파이 아이콘" className="wifi" />
          <div className="wifi-info">
            <div className="wifi-name">
              {isConnected ? networkName : '네트워크 이름'}
            </div>
            <div className="wifi-status">
              {isConnected ? '연결됨' : '인터넷 없음'}
            </div>
          </div>
          <div className="switch">
            <Switch
              value={isConnected}
              onToggle={handleWifiToggle}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="network-info-title">사용자 정보</div>
        <div className="user-info">
          {userInfoItems.map((item, index) => (
            <div className="info-row" key={index}>
              <div className="user-info-title">{item.title}</div>
              <div className="user-info-value">{item.value}</div>
            </div>
          ))}
        </div>

        <div className="network-info-title">스마트팜 정보</div>
        <div className="info-row">
          <div className="device-info-title">IPv4 주소</div>
          <div className="device-info-value">
            {isConnected ? smartFarmIP : '연결되지 않음'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingNetwork;

/*네트워크 상태 확인
{
  "isConnected": boolean,        // WiFi 연결 상태
  "networkName": string,         // WiFi 네트워크 이름
  "smartFarmIP": string,        // 스마트팜 기기의 IP 주소
  "ipv4": string,              // IPv4 주소
  "dhcpEnabled": boolean,       // DHCP 사용 여부
  "gateway": string,           // DHCP 서버 주소
  "dns": string               // DNS 서버 주소
}
*/
