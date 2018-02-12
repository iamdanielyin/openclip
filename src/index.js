/**
 * 导出模块
 */
const path = require('path');
const fsx = require('fs-extra');
const taskAddon = require('ibird-task');
const app = require('ibird').newApp({
  prefix: '/api',
  uploadDir: __dirname + '/public/upload',
  statics: {
    '/': __dirname + '/public'
  }
});
app.import(taskAddon);

app.post('/upload', async ctx => {
  const { files } = ctx.request.body;
  const file = files ? files['file'] : null;
  if (file) {
    ctx.body = { data: ctx.origin + `/upload/${path.parse(file.path).base}` };
  } else {
    ctx.body = { data: null };
  }
});

app.addTask({
  name: '文件清理',
  cronTime: '0 * * * * *',
  onTick: () => {
    try {
      const uploadDir = app.c()['uploadDir'];
      fsx.emptyDirSync(uploadDir);
    } catch (error) { }
  }
});

app.play(null);

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const totalOnline = {};
io.on('connection', function (client) {
  totalOnline[client.id] = 1;
  app.info(`客户端 ${client.id} 连接成功，当前在线：${Object.keys(totalOnline).length}`);
  io.emit('onlineMembers', Object.keys(totalOnline).length);

  client.on('login', function (uid) {
    app.info(`客户端 ${client.id} 登录：${uid}`);
    if (uid) {
      client.on(`${uid}:copy_or_cut`, function (data) {
        client.broadcast.emit(`${uid}:paste`, data);
      });
    }
  });

  client.on('logout', function (uid) {
    app.info(`客户端 ${client.id} 退出登录：${uid}`);
    if (uid) {
      client.removeAllListeners(`${uid}:copy_or_cut`);
    }
  });

  client.on('disconnect', function () {
    delete totalOnline[client.id];
    app.info(`客户端 ${client.id} 连接断开，当前在线：${Object.keys(totalOnline).length}`);
    io.emit('onlineMembers', Object.keys(totalOnline).length);
  });
});

server.listen(3000);