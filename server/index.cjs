const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();

//定义用户数据路径
const usersFile = path.join(__dirname,'userinfo.json'); //拼接路径
const chatFile = path.join(__dirname,'record.json');

if(!fs.existsSync(usersFile)){
    fs.writeFileSync(usersFile,'[]');
}
if(!fs.existsSync(chatFile)){
    fs.writeFileSync(chatFile,'[]');
}

app.use(express.json());
app.use(cors());//启用cors

app.post('/api/register',(req,res) =>{
    const {username,password} = req.body;
    //从文件中读取 JSON 数据并将其解析为JavaScript对象
    const users = JSON.parse(fs.readFileSync(usersFile,'utf-8') || '[]');
    if(users.some(u => u.username ===username)) {
        return res.status(400).json("用户名已存在");
    }
    else if(username===''||password===''){
        return res.status(400).json("用户名或密码不能为空");
    }
    users.push({username,password});
    fs.writeFileSync(usersFile,JSON.stringify(users));
    res.status(201).json("注册成功");
});

app.post('/api/login',(req,res) => {
    const {username,password} = req.body;
    const readStream = fs.createReadStream(usersFile);
    let data ='';
    readStream.on('data',chunk => data+=chunk);
    readStream.on('end',() =>{
        const users = JSON.parse(data ||'[]');
        const user = users.find(u => u.username === username&&u.password === password);
        if(user){
            res.status(201).json("登录成功");
        }else{
            res.status(400).json("用户名或密码错误");
        }
    });
});

app.post('/api/message', async (req, res) => {
    const { input } = req.body;
  
    if (!input || !input.trim()) {
      return res.status(400).json("消息不能为空");
    }
  
    try {
      const messages = await JSON.parse(fs.readFileSync(chatFile,'utf-8')||'[]');
      messages.push(input);
      await fs.writeFileSync(chatFile, JSON.stringify(messages));
      res.status(201).json("发送成功");
    } catch (error) {
      res.status(500).json("内部服务器错误，请稍后再试");
    }
  });

  app.get('/api/messages', async (req, res) => {
    try {
      const messages = await JSON.parse(fs.readFileSync(chatFile,'utf-8')||'[]');
      res.json(messages);
    } catch (err) {
      if (err.code === 'ENOENT') {
        return res.json([]);
      }
      res.status(500).send('读取文件失败');
    }
  });

app.listen(3000,() => {
    console.log('服务器运行在3000');
})