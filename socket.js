const io = socketIo(http, {
});

io.on('connection', (socket) => {
    socket.on('like', (data) => {

    })
});