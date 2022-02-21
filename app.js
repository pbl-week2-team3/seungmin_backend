const cookieParser = require('cookie-parser');
const express = require('express');
const Http = require('http');
const socketIo = require('socket.io');
const { Comments, Posts, Users, Likes } = require('./models')

const app = express();
const http = Http.createServer(app);
const io = socketIo(http, {
});

io.on('connection', (socket) => {
    socket.on('like', (data) => {
        const { user_id, post_id, comment, like } = data;
        io.emit
    })
});

const port = 5000;
const logger = (req, res, next) => {
    console.log('User request :', req.originalUrl, new Date());
    next();
};

app.use([logger, express.json(), cookieParser(), express.static('./static')]);


const loginRouter = require('./routes/login');
const postRouter = require('./routes/post');
const registerRouter = require('./routes/register');
const commentRouter = require('./routes/comment');
const likeRouter = require('./routes/like');
const authorize = require('./routes/authorize');

app.use('/api', [loginRouter, registerRouter]);
app.use('/api/post', [authorize, postRouter, likeRouter]);
app.use('/api/comment', [authorize, commentRouter]);
app.use('/', (req, res) => res.redirect('/login.html'));

// 서버 실행
http.listen(port, () => console.log('server on'));