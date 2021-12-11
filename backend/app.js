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

let orderId = 10;

stocks[0].orderBook = {
    totalSold: 10,
    totalBuy: 1004,
    sold: [
        {
            price: 9.4,
            totalAmount: 4,
            sellers: [
                {orderId: 1, name: 'Admin', amount: 4}
            ]
        },
        {
            price: 9.38,
            totalAmount: 6,
            sellers: [
                {orderId: 2, name: 'Admin', amount: 4},
                {orderId: 3, name: 'Admin', amount: 2}
            ]
        },
    ],
    buy: [
        {

            price: 9.35,
            totalAmount: 1000,
            buyers: [
                {orderId: 4, name: 'Admin', amount: 1000}
            ]
        },
        {
            price: 9.3,
            totalAmount: 4,
            buyers: [
                {orderId: 5, name: 'Admin', amount: 4}
            ]
        },
    ],
};


app.get('/user/:userName', (req, res) => {
    const userName = req.params.userName;
    const user = users.find(user => user.name === userName);
    res.json(user);
})

app.get('/stock/:id', (req, res) => {
    const stock = stocks.find(stock => stock.id === +req.params.id);
    res.json(stock);
})

app.get('/order-book/:id', (req, res) => {
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


const soldWithBuyAndAddNewSold = (changedStock, socket, data) => {
    // decrement total from buy on this stock
    changedStock.totalBuy -= changedStock.orderBook.buy[0].totalAmount;

    //set new price for stock
    changedStock.price = +data.price;

    const remainAmount = +data.amount - changedStock.orderBook.buy[0].totalAmount;

    // all buyers can buy this stock
    for (let buyer of changedStock.orderBook.buy[0].buyers) {
        //find this buyer
        const user = users.find(user => user.name === buyer.name);
        console.log(user);
        //remove current order
        user.readyBuy = user.readyBuy.filter(order => order.orderId !== buyer.orderId);
        //decrement balance of buyer
        user.balance -= buyer.amount * +data.price;

        //add some stock to user
        const userCurrentStock = user.stocks.find(stock => stock.orderId === +data.id);
        userCurrentStock.amount += buyer.amount;
        userCurrentStock.price = +(((userCurrentStock.price + +data.price) / userCurrentStock.amount).toFixed(2));
        // emit to change data of user
        socket.emit('newBalance', user);

    }
    // create new order for sold
    const newOrderId = orderId++;

    changedStock.totalSold += remainAmount;
    // remove current price from buy
    changedStock.orderBook.buy.shift();

    //push new sold order
    changedStock.orderBook.sold.push({
        price: +data.price,
        sellers: [{
            orderId: newOrderId,
            name: data.userName,
            amount: remainAmount
        }],
        totalAmount: remainAmount,
    })

    //add to seller user this order
    const sellerUser = users.find(user => user.name === data.userName)
    sellerUser.readySold.push({
        orderId: newOrderId,
        amount: remainAmount
    });
    //add balance for sold stocks
    sellerUser.balance += (+data.amount - remainAmount) * +data.price;
    //remove sold stocks
    const sellerStock = sellerUser.stocks.find(stock => stock.id === +data.id);

    sellerStock.amount = sellerStock.amount - (+data.amount - remainAmount);
    sellerStock.frozenAmount += remainAmount;
    changedStock.orderBook.sold.sort((a, b) => b.price - a.price);
    const user = users.find(user => user.name === data.userName);
    socket.emit('sold', {changedStock, user});
}

const buyWithSoldAndAddNewBuy = (changedStock, socket, data) => {
    // decrement total from buy on this stock
    changedStock.totalSold -= changedStock.orderBook.sold[changedStock.orderBook.sold.length - 1].totalAmount;

    //set new price for stock
    changedStock.price = +data.price;

    const remainAmount = +data.amount - changedStock.orderBook.sold[changedStock.orderBook.sold.length - 1].totalAmount;

    // all buyers can buy this stock
    for (let seller of changedStock.orderBook.sold[changedStock.orderBook.sold.length - 1].sellers) {
        //find this buyer
        const user = users.find(user => user.name === seller.name);
        //remove current order
        user.readySold = user.readySold.filter(order => order.id !== seller.orderId);
        //decrement balance of buyer
        user.balance += seller.amount * +data.price;

        //add some stock to user
        const userCurrentStock = user.stocks.find(stock => stock.id === +data.id);
        userCurrentStock.amount -= seller.amount;
        // emit to change data of user
        socket.emit('newBalance', user);

    }
    // create new order for buyer
    const newOrderId = orderId++;

    changedStock.totalSBuy += remainAmount;
    // remove current price from sold
    changedStock.orderBook.sold.pop();

    //push new sold order
    changedStock.orderBook.buy.push({
        price: +data.price,
        buyers: [{
            orderId: newOrderId,
            name: data.userName,
            amount: remainAmount
        }],
        totalAmount: remainAmount,
    })

    //add to buyerUser user this order
    const buyerUser = users.find(user => user.name === data.userName)
    buyerUser.readyBuy.push({
        orderId: newOrderId,
        amount: remainAmount
    });
    //add balance for buy stocks
    buyerUser.balance -= (+data.amount - remainAmount) * +data.price;
    buyerUser.frozenBalance+= remainAmount * +data.price;
    //remove buy stocks
    const buyerStock = buyerUser.stocks.find(stock => stock.id === +data.id);
    buyerStock.price = +(((buyerStock.price + +data.price) / buyerStock.amount).toFixed(2));
    buyerStock.amount = buyerStock.amount + (+data.amount - remainAmount);
    changedStock.orderBook.buy.sort((a, b) => b.price - a.price);
    socket.emit('buy', {changedStock, user: buyerUser});
}

const soldAllStocks = (changedStock, socket, data) => {
    changedStock.price = +data.price;

    changedStock.orderBook.buy[0].totalAmount -= +data.amount;
    changedStock.orderBook.totalBuy -= +data.amount;
    console.log(changedStock)
    let remain = +data.amount;

    //remove sold stock
    const soldUser = users.find(user => user.name === data.userName);
    soldUser.balance += +data.amount * +data.price;
    soldUser.stocks.find(stock => stock.id === +data.id).amount -= data.amount;


    while (remain !== 0) {
        for (let buyer of changedStock.orderBook.buy[0].buyers) {
            // find buyer
            const user = users.find(user => user.name === buyer.name);
            // find this stock on buyer
            const userCurrentStock = user.stocks.find(stock => stock.id === +data.id);
            // remove order from buyer
            if (buyer.amount <= remain) {

                user.readyBuy = user.readyBuy.filter(order => order.orderId !== buyer.orderId);

                remain -= buyer.amount;

                userCurrentStock.amount += +buyer.amount;
                user.balance -= +buyer.amount * +data.price;
                userCurrentStock.price = +(((userCurrentStock.price + +data.price) / userCurrentStock.amount).toFixed(2))
                changedStock.orderBook.buy[0].buyers.shift();
            } else {
                changedStock.orderBook.buy[0].buyers[0].amount -= remain;
                console.log(buyer, user.readyBuy);
                user.readyBuy.find(order => order.orderId === buyer.orderId).amount -= remain;
                user.balance -= remain * +data.price;
                userCurrentStock.amount += remain;
                userCurrentStock.price = +(((userCurrentStock.price + +data.price) / userCurrentStock.amount).toFixed(2))
                remain = 0;
            }
        }

    }
    socket.emit('sold', {changedStock, user: soldUser});
}


const buyAllStocks = (changedStock, socket, data) => {
    changedStock.price = +data.price;

    changedStock.orderBook.sold[changedStock.orderBook.sold.length - 1].totalAmount -= +data.amount;
    changedStock.orderBook.totalSold -= +data.amount;
    let remain = +data.amount;

    //remove buy stock
    const buyUser = users.find(user => user.name === data.userName);
    buyUser.balance -= +data.amount * +data.price;
    const buyUserStocks = buyUser.stocks.find(stock => stock.id === +data.id);
    buyUserStocks.amount += data.amount;
    buyUserStocks.price = +(((buyUserStocks.price + +data.price) / buyUserStocks.amount).toFixed(2));


    while (remain !== 0) {
        for (let seller of changedStock.orderBook.sold[changedStock.orderBook.sold.length - 1].sellers) {
            // find seller
            const user = users.find(user => user.name === seller.name);
            // find this stock on seller
            const userCurrentStock = user.stocks.find(stock => stock.id === +data.id);
            // remove order from seller
            if (seller.amount <= remain) {

                user.readySold = user.readySold.filter(order => order.orderId !== seller.orderId);

                remain -= seller.amount;

                userCurrentStock.amount -= +seller.amount;
                user.balance += +seller.amount * +data.price;
                changedStock.orderBook.sold[changedStock.orderBook.sold.length - 1].sellers.shift();
            } else {
                changedStock.orderBook.sold[changedStock.orderBook.sold.length - 1].sellers[0].amount -= remain;
                user.readySold.find(order => order.orderId === seller.orderId).amount -= remain;
                user.balance += remain * +data.price;
                userCurrentStock.amount += remain;
                remain = 0;
            }
        }

    }
    socket.emit('buy', {changedStock, user: buyUser});
}

io.on('connection', (socket) => {
    console.log('a user connected');
    /*setInterval(() => {
        Math.random() > 0.5 ? user.balance -= +((Math.random() * 1000).toFixed(2)) :
            user.balance += +((Math.random() * 1000).toFixed(2));
        socket.emit('del', user.balance);

    }, 5000);*/
    socket.on('sold', (data) => {
        // find stock that we want to sold
        const changedStock = stocks.find(stock => stock.id === +data.id);

        if (changedStock.orderBook.buy.length) {
            // can sold
            if (+data.price === changedStock.orderBook.buy[0].price) {
                // cannot enough amount in buy
                if (changedStock.orderBook.buy[0].totalAmount <= +data.amount) {
                    soldWithBuyAndAddNewSold(changedStock, socket, data);
                } else {
                    //sold all
                    soldAllStocks(changedStock, socket, data);
                }
                return;
            }
        }

        //find user that want to sold stocks
        const user = users.find(user => user.name === data.userName);
        console.log(data)
        const userStock = user.stocks.find(stock => stock.id === +data.id);
        userStock.frozenAmount += +data.amount;
        console.log(user, data)
        changedStock.orderBook.totalSold += +data.amount;
        const order = changedStock.orderBook.sold.find(order => order.price === +data.price);
        //if there is this price
        if (order) {
            const newOrderId = orderId++;
            order.totalAmount += +data.amount;
            order.sellers.push({
                orderId: newOrderId,
                name: data.userName,
                amount: +data.amount
            });
            user.readySold.push({
                orderId: newOrderId,
                amount: +data.amount
            });
        } else {
            const newOrderId = orderId++;
            changedStock.orderBook.sold.push({
                price: +data.price,
                sellers: [{
                    orderId: newOrderId,
                    name: data.userName,
                    amount: +data.amount
                }],
                totalAmount: +data.amount,
            })
            user.readySold.push({
                orderId: newOrderId,
                amount: +data.amount
            });
        }
        changedStock.orderBook.sold.sort((a, b) => b.price - a.price);
        socket.emit('sold', {changedStock, user});

    });

    socket.on('buy', (data) => {
        // find stock that we want to sold
        const changedStock = stocks.find(stock => stock.id === +data.id);
        if (changedStock.orderBook.sold.length &&
            +data.price === changedStock.orderBook.sold[changedStock.orderBook.sold.length - 1].price) {
            // cannot enough amount in buy
            if (changedStock.orderBook.sold[changedStock.orderBook.sold.length - 1].totalAmount <= +data.amount) {
                buyWithSoldAndAddNewBuy(changedStock, socket, data);
            } else {
                //sold all
                buyAllStocks(changedStock, socket, data);
            }
            return;
        }

        //find user that want to buy stocks
        const user = users.find(user => user.name === data.userName);
        user.frozenBalance+= +data.amount * +data.price;

        changedStock.orderBook.totalBuy += +data.amount;
        const order = changedStock.orderBook.buy.find(order => order.price === +data.price);
        //if there is this price
        if (order) {
            const newOrderId = orderId++;
            order.totalAmount += +data.amount;
            order.buyers.push({
                orderId: newOrderId,
                name: data.userName,
                amount: +data.amount
            });
            user.readyBuy.push({
                orderId: newOrderId,
                amount: +data.amount
            });
        } else {
            const newOrderId = orderId++;
            changedStock.orderBook.buy.push({
                price: +data.price,
                buyers: [{
                    orderId: newOrderId,
                    name: data.userName,
                    amount: +data.amount
                }],
                totalAmount: +data.amount,
            })
            user.readyBuy.push({
                orderId: newOrderId,
                amount: +data.amount
            });
        }
        changedStock.orderBook.buy.sort((a, b) => b.price - a.price);
        socket.emit('buy', {changedStock, user});

    });
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});