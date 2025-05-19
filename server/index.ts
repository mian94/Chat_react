const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

//定义用户数据路径
const usersFile = path.join(__dirname,'userinfo.json'); //拼接路径
const chatFile = path.join(__dirname,'record.json');

interface chatrecord {
  username: string
  friendname:string
  message:string[]
}

if(!fs.existsSync(usersFile)){
    fs.writeFileSync(usersFile,'[]');
}
if(!fs.existsSync(chatFile)){
  fs.writeFileSync(chatFile,'[]');
}

app.use(express.json());
app.use(cors());//启用cors

app.post('/api/register',(req: { body: { username: any; password: any; }; },res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): void; new(): any; }; }; }) =>{
    const {username,password} = req.body;
    //从文件中读取 JSON 数据并将其解析为JavaScript对象
    const users = JSON.parse(fs.readFileSync(usersFile,'utf-8') || '[]');
    if(users.some((u: { username: any; }) => u.username ===username)) {
        return res.status(400).json("用户名已存在");
    }
    else if(username===''||password===''){
        return res.status(400).json("用户名或密码不能为空");
    }
    users.push({username,password});
    fs.writeFileSync(usersFile,JSON.stringify(users));
    res.status(201).json("注册成功");
});

app.post('/api/login', (req: { body: { username: any; password: any } }, res: { status: (arg0: number) => { json: (arg0: { state: string, safeUsers?: Array<{ username: string }> }) => void } }) => {
    const { username, password } = req.body;
    const readStream = fs.createReadStream(usersFile);
    let data = '';
    readStream.on('data', (chunk: string) => data += chunk);
    readStream.on('end', () => {
        const users = JSON.parse(data || '[]');
        const user = users.find((u: { username: any; password: any }) => u.username === username && u.password === password);
        if (user) {
            const safeUsers = users.filter((u: { username: any; }) =>u.username !== username).map((u: { username: any; }) => ({
                username: u.username,
            }));
            res.status(200).json({
                state: "登录成功",
                safeUsers,
            });
        } else {
            res.status(400).json({ state: "用户名或密码错误" });
        }
    });
});

app.post('/api/message', async (req: { body: { username: string; friendname: string ; message: string; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: string): void; new(): any; }; }; }) => {
    const { username,friendname,message } = req.body;
    try {
      const messages:chatrecord[] = await JSON.parse(fs.readFileSync(chatFile,'utf-8')||'[]');
      let i=0;
      for(i=0;i<messages.length;i++){
        if(messages[i].username===username&&messages[i].friendname===friendname){
          messages[i].message.push(message);
          break;
        }
      }
      if(i===messages.length){
        const newmessage:string[]=[];
        newmessage.push(message);
        const newrecord:chatrecord = {
          username: username,
          friendname:friendname,
          message:newmessage
        }
        messages.push(newrecord);
      }
      fs.writeFileSync(chatFile,JSON.stringify(messages));
      res.status(201).json("发送成功");
    } catch (error) {
      res.status(500).json("内部服务器错误，请稍后再试");
    }
});

app.get('/api/messages', async (req: any, res: { json: (arg0: never[]) => void; status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
    try {
      const messages = await JSON.parse(fs.readFileSync(chatFile,'utf-8')||'[]');
      res.json(messages);
    } catch (error) {
      res.status(500).send('读取文件失败');
    }
});

app.listen(3000,() => {
    console.log('服务器运行在3000');
})