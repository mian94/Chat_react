import React from 'react';
import { useState,useEffect } from 'react';
import { useSafeUsers } from '../Login';


function Chat() {
  const [input,setInput] = useState<string>('');
  const [messages,setMessages] = useState<string[]>([]);
  const { safeUsers, setSafeUsers } = useSafeUsers();

  const handleChat = async () =>{
      try{
        const response = await fetch('http://localhost:3000/api/message',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({input})
        })
        const result: {message?: string,error?: string} = await response.json();
        alert(result);
      }catch(error){
        alert('发送失败');
      }
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/messages');
        const data: unknown = await res.json();

        if(!Array.isArray(data)) return;
        const filtered = data.filter((msg: string) => typeof msg === 'string' && msg.trim() !== '');
        if (filtered.length > messages.length) {
          const newMessage = filtered.slice(messages.length); // 获取新增的消息
          setMessages(prevMessages=> [...prevMessages, ...newMessage]); // 更新消息列表
        }
      } catch (error) {
        console.error('获取消息失败', error);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [messages]);

  return (
      <div>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
          <button onClick={handleChat}>发送</button>
          <div id='chat'>
            <div id='friends'>
              <h3>联系人</h3>
              <ul>
                {safeUsers.map((user, index) => (
                  <li key={index}>{user.username}</li>
                ))}
              </ul>
            </div>
            <div id='chatrecord'>
              <h3>聊天记录</h3>
            {
              messages.length === 0 ?(
                <p>暂无消息</p>
              ):(
                <ul>
                  {
                    messages.map((msg,index) => (
                      <li key={index}>{msg}</li>
                    ))
                  }
                </ul>
              )
            }
            </div>
          </div>
      </div>
  )
}
export default Chat;