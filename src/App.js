// src/App.js
import './App.css';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// 대시보드 컴포넌트
import DashBoard from './pages/DashBoard/DashBoard';
import Setting from './pages/Setting';
import SettingAccount from './pages/SettingAccount';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DataStatistics from './pages/DataStatistics';
import SettingNetwork from './pages/SettingNetwork';
import SettingAdd from './pages/SettingAdd';
import Chatting from './pages/Chatting/Chatting';
import PersonalInformation from './pages/PersonalInformation';
import useSensorMonitor from './hooks/useSensorMonitor';

// 웹페이지 컴포넌트
import Homepage from './webpage/pages/Homepage';
import Detailpage from './webpage/pages/Detailpage';
import Sellingpost from './webpage/pages/Sellingpost';
import Paymentpage from './webpage/pages/Paymentpage';
import PaymentComplete from './webpage/pages/PaymentComplete';
import Mypage from './webpage/pages/Mypage';
import Market from './webpage/pages/Market';
// ⚠️ Chat 컴포넌트는 roomId 파라미터를 받도록 구현되어 있어야 함
import Chat from './webpage/pages/Chat';
import LoginPage from './webpage/pages/LoginPage';
import SignUpPage from './webpage/pages/SignUpPage';
import FindPWPage from './webpage/pages/FindPWPage';
import AdminPage from './webpage/pages/AdminPage';
import AiPrice from './webpage/pages/AiPrice';
import SmartFarmList from './webpage/pages/SmartFarmList';

import Header from './webpage/components/Header';

// ✅ API 베이스 통일 (localhost/127.0.0.1 혼용 금지!)
const API = import.meta.env?.VITE_API ?? 'http://localhost:5000';

function App() {
  const location = useLocation();

  // 서버 세션을 기준으로만 로그인 상태 결정
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checking, setChecking] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardAccess, setDashboardAccess] = useState(null);
  const { sensorData } = useSensorMonitor();

  // 대시보드 라우터 목록
  const dashboardPaths = [
    '/smartfarm/:serial',
    '/dashboard',
    '/setting',
    '/settingnetwork',
    '/settingaccount',
    '/settingadd',
    '/datastatistics',
    '/dashboard/chat',
    '/PersonalInformation',
  ];
  const isDashboardRoute = dashboardPaths.includes(location.pathname);

  // ✅ 앱 시작 시 로그인 세션 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API}/api/check`, { credentials: 'include' });
        const data = await res.json();
        setIsLoggedIn(!!data.loggedIn);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  // 대시보드 접근 체크 (단순히 로그인 여부로 판정)
  useEffect(() => {
    const checkSession = async () => {
      if (!isDashboardRoute) {
        setDashboardAccess(null);
        setChecking(false);
        return;
      }
      setChecking(true);
      try {
        const res = await fetch(`${API}/api/check`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setDashboardAccess(!!data.loggedIn);
      } catch (error) {
        console.error('대시보드 세션 확인 실패:', error);
        setDashboardAccess(false);
      } finally {
        setChecking(false);
      }
    };
    checkSession();
  }, [isDashboardRoute, location.pathname]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // 로그인 성공 시점에서만 상태 갱신 (LoginPage에서 성공 후 콜백 호출)
  const handleLogin = () => {
    setIsLoggedIn(true);
    window.dispatchEvent(new Event('authchange'));
  };

  // 서버 로그아웃 호출 + 상태 초기화
  const handleLogout = async () => {
    try {
      await fetch(`${API}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      // 네트워크 오류여도 클라이언트 상태는 로그아웃 처리
    }
    setIsLoggedIn(false);
    window.dispatchEvent(new Event('authchange'));
  };

  // if (checking && isDashboardRoute) return <div>세션 확인 중...</div>;

  return (
    <div className={isDashboardRoute ? 'dashboard-layout' : ''}>
      {/* 대시보드 경로일 때만 Navbar & Sidebar 표시 */}
      {isDashboardRoute && <Navbar onToggleSidebar={toggleSidebar} />}
      <div className="layout-row">
        {isDashboardRoute && (
          <Sidebar isOpen={window.innerWidth <= 1024 ? isSidebarOpen : true} />
        )}
        <Header />
        <div className={isDashboardRoute ? 'main-content' : 'website-main-content'}>
          <Routes>
            {/*  웹페이지 라우터 */}
            <Route
              path="/"
              element={
                <Homepage
                  isLoggedIn={isLoggedIn}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              }
            />
            <Route path="/detail/:id" element={<Detailpage />} />
            <Route path="/price" element={<AiPrice />} />
            <Route
              path="/sellingpost"
              element={isLoggedIn ? <Sellingpost /> : <Navigate to="/login" replace />}
            />
            <Route path="smartfarmlist" element={<SmartFarmList />} />
            <Route path="/payment/:id" element={<Paymentpage />} />
            <Route path="/paymentcomplete" element={<PaymentComplete />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route
              path="/pagination"
              element={
                <Market
                  isLoggedIn={isLoggedIn}
                  onLogin={handleLogin}
                  onLogout={handleLogout}
                />
              }
            />

            {/* ✅ 채팅: roomId가 있는 경로를 추가 (중요) */}
            <Route
              path="/chat/:roomId"
              element={isLoggedIn ? <Chat /> : <Navigate to="/login" replace />}
            />
            {/* (선택) 과거 링크 호환: /chat → 로그인 시 채팅 목록/가이드 or Chat 컴포넌트 */}
            <Route
              path="/chat"
              element={isLoggedIn ? <Chat /> : <Navigate to="/login" replace />}
            />

            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/findpw" element={<FindPWPage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* 대시보드 라우터 */}
            <Route path="/smartfarm/:serial" element={<DashBoard />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/settingnetwork" element={<SettingNetwork />} />
            <Route path="/settingaccount" element={<SettingAccount />} />
            <Route path="/settingadd" element={<SettingAdd />} />
            <Route path="/datastatistics" element={<DataStatistics />} />
            <Route path="/dashboard/chat" element={<Chatting />} />
            <Route path="/PersonalInformation" element={<PersonalInformation />} />

            {/* 404 */}
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
