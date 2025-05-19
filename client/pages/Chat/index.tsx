import React, { useState,useEffect } from 'react';
import { useFriend, useSafeUsers, useUser } from '../Login';

interface chatrecord {
  username: string
  friendname:string
  message:string[]
}

function Chat() {
  const [input,setInput] = useState<string>('');
  const [chatRecord, setChatRecord] = useState<chatrecord>();
  const { safeUsers, setSafeUsers } = useSafeUsers();
  const { user } = useUser();
  const currentUser = user?.username || '未登录';
  const { friend,setFriend } = useFriend();
  const currentFriend = friend?.friendname || '未选择联系人'

  const handleChat = async () =>{
      if (!input.trim()) return alert('请输入内容');
      if (currentUser === '未登录') return alert('请先登录');
      if (currentFriend === '未选择联系人') return alert('请先选择联系人');
      try{
        const response = await fetch('http://localhost:3000/api/message',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({ username: currentUser, friendname: currentFriend , message: input})
        })
        const result= await response.json();
        alert(result);
        setInput('');
      }catch(error){
        alert('发送失败');
      }
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (!currentUser || currentUser === '未登录') return;
      try {
        const res = await fetch('http://localhost:3000/api/messages');
        const data:chatrecord[] = await res.json();
        let i=0;
        for(i=0;i<data.length;i++){
          if(data[i].username===currentUser&&data[i].friendname===currentFriend){
            setChatRecord(data[i]);
            break;
          }
        }
        if(i===data.length) setChatRecord(undefined);
      } catch (error) {
        console.error('获取消息失败', error);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, [currentUser, currentFriend]);

  return (
      <div>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
          <button onClick={handleChat}>发送</button>
          <div id='chat'>
            <div id='friends'>
              <h3>联系人</h3>
              <ul>
                {safeUsers.map((user,index) => (
                  <button id='friends' key={index} onClick={() => setFriend({ friendname: user.username })}>{user.username}</button>
                ))}
              </ul>
            </div>
            <div id='chatrecord'>
              <h3>聊天记录</h3>
            {
              chatRecord?.message.length === 0 ?(
                <p>暂无消息</p>
              ):(
                <ul>
                  {
                    chatRecord?.message.map((msg,index) => (
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