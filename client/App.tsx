import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import './App.css';
import { SafeUsersProvider, UserProvider, FriendProvider } from './pages/Login';

// 导航栏按钮组件
function NavButtons() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
      <Link to="/login" className='nav-link'>登录页面</Link>
      <Link to="/chat" className='nav-link'>聊天页面</Link>
    </div>
  );
}

// 主组件
function AppContent() {
  return (
    <div style={{ width: '800px', margin: '0 auto' }}>
      <NavButtons />
      <SafeUsersProvider>
        <UserProvider>
          <FriendProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/chat" element={<Chat />} />
              {/* 默认重定向到登录页 */}
              <Route path="*" element={<Login />} />
            </Routes>
          </FriendProvider>
        </UserProvider>
      </SafeUsersProvider>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
