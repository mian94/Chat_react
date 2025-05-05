import { useState,useEffect } from 'react';

function Chat() {
  const [input,setInput] = useState('');
  const [messages,setMessages] = useState([]);

  const handleChat = async () =>{
      try{
        const response = await fetch('http://localhost:3000/api/message',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({input})
        })
        const result = await response.json();
        alert(result);
      }catch(error){
        alert('发送失败');
      }
  }

  useEffect(() => {
    const intervalId = setInterval(async () => {
      try {
        const res = await fetch('http://localhost:3000/api/messages');
        const data = await res.json();
        const filtered = data.filter(msg => msg.trim && msg.trim());
        setMessages(filtered);
      } catch (error) {
        console.error('获取消息失败', error);
      }
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
      <div>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)}/>
          <button onClick={handleChat}>发送</button>
          
      </div>
  )
}
export default Chat;