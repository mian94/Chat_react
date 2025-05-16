import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 定义 SafeUser 类型
type SafeUser = {
    username: string;
};

// 定义 Context 的值类型
interface SafeUsersContextType {
    safeUsers: SafeUser[];
    setSafeUsers: React.Dispatch<React.SetStateAction<SafeUser[]>>;
}

// 创建 Context 并指定默认值（这里用 null 表示没有默认值）
export const SafeUsersContext = createContext<SafeUsersContextType | null>(null);
// Provider 组件
export const SafeUsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [safeUsers, setSafeUsers] = useState<SafeUser[]>([]);
    return (
        <SafeUsersContext.Provider value={{ safeUsers, setSafeUsers }}>
            {children}
        </SafeUsersContext.Provider>
    );
};
// 自定义 Hook 来使用 Context
export const useSafeUsers = (): SafeUsersContextType => {
    const context = useContext(SafeUsersContext);
    if (context === null) {
        throw new Error("useSafeUsers 必须在一个 SafeUsersProvider 中使用");
    }
    return context;
};

type User = {
  username: string;
};

type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const initialUserContext: UserContextType = {
  user: null,
  setUser: () => {},
};

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
    throw new Error('useContext 必须在 UserProvider 内部使用');
    }
    return context;
};


function Login() {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const navigate = useNavigate();
    const { safeUsers, setSafeUsers } = useSafeUsers(); // 使用 context 中的状态
    const { user, setUser } = useUser();
    const handleRegister = async () => {
        try{
            const response = await fetch('http://localhost:3000/api/register',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({username,password}) 
            });
            const result = await response.json();
            alert(result);
        }catch(error){
            alert('注册失败');
        }
    };

    const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (response.ok && result.state=='登录成功') {
        alert('登录成功');
        // 设置全局状态
        setSafeUsers(result.safeUsers);    
        setUser({ username });
        // 跳转到聊天页面
        navigate('/chat');
        console.log(result);
      } else {
        alert(result);
      }
    } catch (error) {
      alert('网络错误，请稍后再试');
    }
  };
    return (
        <div>
            用户名：<input type="text" value={username} onChange={(e) =>setUsername(e.target.value)}/>
            密码：<input type="password" value={password} onChange={(e =>setPassword(e.target.value))}/>
            <button onClick={handleRegister}>注册</button>
            <button onClick={handleLogin}>登录</button>
        </div>
    )
}

export default Login;

