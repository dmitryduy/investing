const express = require('express');
const app = express();
const fs = require('fs');
let cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const  io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors())
const users = JSON.parse(fs.readFileSync('backend/user.json', 'utf8'));
const stocks = JSON.parse(fs.readFileSync('backend/stocks.json', 'utf8'));

let user = users[0];

app.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
    user = users.find(user => user.id === + userId);
    console.log(user, 'jlkdjdlf')
    res.json(user);
})

app.get('/getStock', (req, res) => {
    let arrOfStock = user.stocks.map(userStock => ({userStock, stock: stocks.find(stock => stock.id === userStock.id)}));
    res.json(arrOfStock);
})


io.on('connection', (socket) => {
    console.log('a user connected');
    setInterval(() => {
        Math.random() > 0.5 ? user.balance-= +((Math.random()* 1000).toFixed(2)):
            user.balance+= +((Math.random()* 1000).toFixed(2));
        socket.emit('del', user.balance);

    }, 5000);
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});