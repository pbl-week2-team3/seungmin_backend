const cookieParser = require('cookie-parser');
const express = require('express');
const Http = require('http');
const socketIo = require('socket.io');
const { Posts } = require('./models')

const app = express();
const http = Http.createServer(app);
const io = socketIo(http);

io.on('connection', (socket) => {
    // data는 { user_id: user_id } 꼴임.
    // 자기 방에 꽂아준다. socket id를 이용하는 방법은 잘 모르겠음.
    // cookie 있으면 프론트에서 해당 방에 꽂아준다.
    socket.on('connect', (data) => {
        if (Object.keys(data).length) {
            return;
        }
        socket.join(`${data.user_id}`);
    });

    socket.on('like', (data) => {
        const { post_id, id } = data;
        Posts.findOne({ where: { id: post_id } })
            .then((post) => {
                try {
                    socket.to(`${post.user_id}`).emit('alarm', {
                        like: true,
                        comment: false,
                        by: id,
                        post_id,
                        to: post.user_id,
                        date: new Date().toISOString()
                    });
                } catch (err) {
                    socket.to(`${id}`).send({
                        success: false,
                        errorMessage: '존재하지 않는 게시글입니다.'
                    });
                }
            });
    });
    // 댓글을 쓰면
    socket.on('comment', (data) => {
        const { post_id, id } = data;
        Posts.findOne({ where: { id: post_id } })
            .then((post) => {
                try {
                    socket.to(`${post.user_id}`).emit('alarm', {
                        like: false,
                        comment: true,
                        by: id,
                        post_id,
                        to: post.user_id,
                        date: new Date().toISOString()
                    });
                } catch (err) {
                    socket.to(`${id}`).send({
                        success: false,
                        errorMessage: '존재하지 않는 게시글입니다.'
                    });
                }
            });
    });

});


const port = 3000;
const logger = (req, res, next) => {
    console.log('User request :', req.originalUrl, new Date());
    next();
};

app.use([
    logger,
    express.urlencoded(),
    express.json(),
    cookieParser(),
    express.static(__dirname + '/static')]);


const loginRouter = require('./routes/login');
const postRouter = require('./routes/post');
const registerRouter = require('./routes/register');
const commentRouter = require('./routes/comment');
const likeRouter = require('./routes/like');
const authorize = require('./routes/authorize');

app.use('/api', [loginRouter, registerRouter]);
app.use('/api/post', [authorize, postRouter, likeRouter]);
app.use('/api/comment', [authorize, commentRouter]);
app.use('/', (req, res) => res.sendFile(__dirname + '/static/login.html'));

// 서버 실행
http.listen(port, () => console.log('server on'));