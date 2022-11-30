const express = require('express');
const app = express();
const http = require("http");
const { Server } = require('socket.io');
const cors = require("cors")
var counter = -1;
var cantType = true;
var counterGameSearching = -1;

var counterRanked = -1;
var cantTypeRanked = true;

app.use(cors())
app.get('/cors', (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.send({ "msg": "This has CORS enabled 🎈" })
    })
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:7101"],
        methods: ["GET", "POST"],
        preflightContinue: false,
    },
});

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`)
    
    socket.on("send_message", (data) => {
        io.sockets.emit("receive_message", data)
    });
});

io.on("connection", (socket) => {
    socket.on("counter-searching-game-reset", (data) => {
        counterGameSearching = -1;
    });
});



setInterval(() => {
    if (cantType == false)
    {
        counter--;
        if (counter < 0)
        {
            counter = 10;
            cantType = true;
            io.sockets.emit('cantType', cantType=true);
        }
    }

    else {
        counter--;
        if (counter < 0)
        {
            counter = 30;
            cantType = false;
            io.sockets.emit('cantType', cantType=false);
        }
    }

    io.sockets.emit('counter', counter);

},1000);

setInterval(() => {
    if (cantTypeRanked == false)
    {
        counterRanked--;
        if (counterRanked < 0)
        {
            counterRanked = 15;
            cantTypeRanked = true;
            io.sockets.emit('cantTypeRanked', cantTypeRanked=true);
        }
    }

    else {
        counterRanked--;
        if (counterRanked < 0)
        {
            counterRanked = 30;
            cantTypeRanked = false;
            io.sockets.emit('cantTypeRanked', cantTypeRanked=false);
        }
    }

    io.sockets.emit('counterRanked', counterRanked);

},1000);

setInterval(() => {

    counterGameSearching++;
    io.sockets.emit('counter-searching-game', counterGameSearching);

},1000);






server.listen(3001, () => {
    console.log("SERVER IS RUNNING");
});