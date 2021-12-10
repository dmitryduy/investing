const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const  io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors());
app.use(bodyParser.json());
const users = JSON.parse(fs.readFileSync('backend/user.json', 'utf8'));
const stocks = JSON.parse(fs.readFileSync('backend/stocks.json', 'utf8'));

let user = users[0];

app.get('/user/:userName', (req, res) => {
    const userName = req.params.userName;
    user = users.find(user => user.name === userName);
    res.json(user);
})

app.get('/stock/:id', (req, res) => {
    const stock = stocks.find(stock => stock.id === +req.params.id);
    res.json(stock);
})

app.post('/getStock', (req, res) => {
    let arrOfStock = req.body.map(stockId => {
        const stock = stocks.find(stock => stock.id === stockId);
        return {
            id: stock.id,
            price: stock.price,
            name: stock.name,
            ticker: stock.ticker,
            image: stock.image
        }
    });
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