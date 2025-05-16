import React from 'react';
import { useState,useEffect } from 'react';
import { useSafeUsers, useUser } from '../Login';

type chattuple = [string, ...string[]];

function Chat() {
  const [input,setInput] = useState<string>('');
  const [messages, setMessages] = useState<[string, ...string[]][]>([]);
  const [chatRecord, setChatRecord] = useState<chattuple | null>(null);
  const { safeUsers, setSafeUsers } = useSafeUsers();
  const { user } = useUser();
  const currentUser = user?.username || '未登录';

  const handleChat = async () =>{
      if (!input.trim()) return alert('请输入内容');
      if (currentUser === '未登录') return alert('请先登录');
      try{
        const response = await fetch('http://localhost:3000/api/message',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ username: currentUser, message: input})
        })
        const result: {message?: string,error?: string} = await response.json();
        alert(result);
        setInput('');
      }catch(error){
        alert('发送失败');
      }
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/messages');
        const data: unknown = await res.json();

        if (Array.isArray(data)) {
          const record = data.find((msg: chattuple) => msg[0] === currentUser);
          if (record) {
            setChatRecord(record);
          }
        }
        
      } catch (error) {
        console.error('获取消息失败', error);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentUser]);

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
              !chatRecord||chatRecord.length === 1 ?(
                <p>暂无消息</p>
              ):(
                <ul>
                  {
                    chatRecord.slice(1).map((msg,index) => (
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