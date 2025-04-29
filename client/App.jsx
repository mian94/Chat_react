import { useState } from 'react'
import Login from './pages/Login'
import Chat from './pages/Chat'
import './App.css'

function App() {
 const [activePage, setActivePage] = useState('login')


  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px'}}>
        <button onClick={() => setActivePage('login')}>登录页面</button>
        <button onClick={() => setActivePage('chat')}>聊天页面</button>
      </div>
    <div style={{width: '800px'}}>
      {activePage === 'login' && <Login />}
      {activePage === 'chat' && <Chat />}
    </div>
    </>
  )
}

export default App
