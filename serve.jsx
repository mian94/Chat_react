function Login() {
    const { useState } = React;//从React中解构useState
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

const root1 = ReactDOM.createRoot(document.getElementById("root1"));
root1.render(
    <Login />
)

function Chat() {
    const {useState} = React;
    const [input,setInput] = useState('');

    const handleChat = () =>{
        if(!input.trim()) return;
        const response = fetch('http://localhost:3000/api/message',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({input})
        })
        .then(alert(response.json))
        .catch(error => alert('发送失败'));
    }
    return (
        <div>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
            <button onClick={handleChat}>发送</button>
        </div>
    )
}
const root2 = ReactDOM.createRoot(document.getElementById("root2"));
root2.render(
    <Chat />
)