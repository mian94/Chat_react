import { useState } from 'react';

function Chat() {
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
export default Chat;