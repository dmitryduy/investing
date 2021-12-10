const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors')
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});

app.use(cors());
app.use(bodyParser.json());
const users = JSON.parse(fs.readFileSync('backend/user.json', 'utf8'));
const stocks = JSON.parse(fs.readFileSync('backend/stocks.json', 'utf8'));

stocks[0].orderBook = {
    totalSold: 10,
    totalBuy: 10,
    sold: [
        {
            price: 9.4,
            seller: 'Alex',
            amount: 4,
        },
        {
            price: 9.38,
            seller: 'Alex',
            amount: 6,
        },
    ],
    buy: [
        {
            price: 9.35,
            seller: 'Alex',
            amount: 7,
        },
        {
            price: 9.3,
            seller: 'Alex',
            amount: 3,
        },
    ],
};


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

app.get ('/order-book/:id', (req, res) => {
    const orderBook = stocks.find(stock => stock.id === +req.params.id).orderBook;
    res.json(orderBook);
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
    /*setInterval(() => {
        Math.random() > 0.5 ? user.balance -= +((Math.random() * 1000).toFixed(2)) :
            user.balance += +((Math.random() * 1000).toFixed(2));
        socket.emit('del', user.balance);

    }, 5000);*/
    socket.on('sold', (data) => {
        const changedStock = stocks.find(stock => stock.id === +data.id);
        changedStock.orderBook.totalSold+= +data.amount;
        const order = changedStock.orderBook.sold.find(order => order.price === +data.price);
        if(order) {
            order.amount+= +data.amount;
        }
        else {
            changedStock.orderBook.sold.push({
                price: +data.price,
                seller: 'Alex',
                amount: +data.amount,
            })
        }

        socket.emit('sold', changedStock)

    });
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});