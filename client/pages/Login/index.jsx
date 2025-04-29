import { useState } from 'react';

function Login() {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');

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

    const handleLogin = async () =>{
        try{
            const response = await fetch('http://localhost:3000/api/login',{
                method:'POST',
                headers:{'Content-Type':'application/json'},
                body:JSON.stringify({username,password})
            });
            const result = await response.json();
            alert(result);
        }catch(error){
            alert('登录失败');
        }
    }
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

