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
const users: IUser[] = JSON.parse(fs.readFileSync('backend/user.json', 'utf8'));
const stocks: IStock[] = JSON.parse(fs.readFileSync('backend/stocks.json', 'utf8'));

let orderId = 0;


app.get('/user/:userName', (req, res) => {
    const userName = req.params.userName;
    const user = users.find(user => user.name === userName);
    if (!user) {
        res.status(400);
    }
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

app.get('/stock', (req, res) => {
    res.json(stocks.map(stock => ({
        id: stock.id,
        image: stock.image,
        name: stock.name,
        ticker: stock.ticker,
        price: stock.price
    })));
});

app.get('/admin', (req, res) => {
    res.json({users, stocks});
})


interface soldData {
    stockId: number,
    soldByPrice: number,
    amount: number,
    sellerName: string
}

interface buyData {
    stockId: number,
    buyByPrice: number,
    amount: number,
    buyerName: string
}

interface ISeller {
    orderId: number,
    name: string,
    amount: number
}

interface IBuyer {
    orderId: number,
    name: string,
    amount: number
}

interface ISold {
    price: number,
    sellers: ISeller[],
    totalAmount: number
}

interface IBuy {
    price: number,
    buyers: IBuyer[],
    totalAmount: number
}

interface IOrderBook {
    totalSold: number,
    totalBuy: number,
    sold: ISold[],
    buy: IBuy[]
}

interface IStock {
    id: number,
    name: string,
    ticker: string,
    price: number,
    image: string,
    sector: string,
    about: string,
    countryInfo: {
        countryName: string,
        countryImage: string
    },
    stockExchangeInfo: {
        stockExchangeImage: string,
        stockExchangeName: string
    }
    orderBook: IOrderBook
}

interface IReadyBuyOrBuy {
    orderId: number,
    amount: number,
    price: number,
    stockName: string,
    totalAmount: number
}

interface IUserStock {
    id: number,
    amount: number,
    frozenAmount: number,
    price: number
}

interface IUser {
    id: number,
    name: string,
    startBalance: number,
    balance: number,
    frozenBalance: number,
    readyBuy: IReadyBuyOrBuy[],
    readySold: IReadyBuyOrBuy[],
    stocks: IUserStock[]
}

const findStockById = (stockId: number): IStock => {
    return stocks.find(stock => stock.id === stockId);
}

const getTopBuy = (stock: IStock): IBuy | undefined => {
    return stock.orderBook.buy[0];
}

const getLowerSold = (stock: IStock): ISold | undefined => {
    return stock.orderBook.sold[stock.orderBook.sold.length - 1];
}

const getUserByName = (userName: string): IUser => {
    return users.find(user => user.name === userName);
}

const getStockThatUserSoldById = (user: IUser, stockId: number): IUserStock => {
    return user.stocks.find(stock => stock.id === stockId);
}

const increaseUserAmountOfStocks = (user: IUser, userStocks: IUserStock, price: number, amount: number, stockId: number): void => {
    if (userStocks) {
        userStocks.amount += amount;
        userStocks.price = +(((userStocks.price * userStocks.amount + price * amount) / (amount + userStocks.amount)).toFixed(2));
    } else {
        user.stocks.push({
            price: price,
            amount: amount,
            id: stockId,
            frozenAmount: 0
        })
    }
}


const soldAllStocks = (changedStock: IStock, socket: any, data: soldData, sendToUser: boolean = true): void => {
    //change user info
    const sellerUser: IUser = getUserByName(data.sellerName);
    //increase balance
    sellerUser.balance += data.amount * data.soldByPrice;
    //remove stocks
    const sellerStock: IUserStock = getStockThatUserSoldById(sellerUser, data.stockId);
    sellerStock.amount -= data.amount;
    //if user sold all stocks
    if (sellerStock.amount === 0) {
        sellerUser.stocks = sellerUser.stocks.filter(stock => stock.id !== data.stockId);
    }

    // give stocks for buyers
    let remain = data.amount;
    const maximumStockBuyObj = getTopBuy(changedStock);
    const buyers = JSON.parse(JSON.stringify(maximumStockBuyObj.buyers));
    for (let buyer of buyers) {
        const buyerUser: IUser = getUserByName(buyer.name);
        const buyerStocks: IUserStock | undefined = getStockThatUserSoldById(buyerUser, data.stockId);
        if (buyer.amount <= remain) {
            remain -= buyer.amount;
            buyerUser.balance -= buyer.amount * data.soldByPrice;
            buyerUser.frozenBalance -= buyer.amount * data.soldByPrice;
            buyerUser.readyBuy = buyerUser.readyBuy.filter(order => order.orderId !== buyer.orderId);
            increaseUserAmountOfStocks(buyerUser, buyerStocks, data.soldByPrice, buyer.amount, data.stockId);
            maximumStockBuyObj.buyers.shift()
        } else {
            maximumStockBuyObj.buyers[0].amount -= remain;
            buyerUser.frozenBalance -= remain * data.soldByPrice;
            buyerUser.balance -= remain * data.soldByPrice;
            buyerUser.readyBuy.find(order => order.orderId === buyer.orderId).amount -= remain;
            increaseUserAmountOfStocks(buyerUser, buyerStocks, data.soldByPrice, remain, data.stockId);
            remain = 0;
            io.sockets.emit('newBalance', buyerUser);
            break;
        }
        io.sockets.emit('newBalance', buyerUser);
    }
    if (sendToUser) {
        io.sockets.emit('change order book', {changedStock, user: getUserByName(data.sellerName)});
    }
}

const buyAllStocks = (changedStock: IStock, socket: any, data: buyData, sendToUser: boolean = true): void => {
    //change user info
    const buyerUser: IUser = getUserByName(data.buyerName);
    //decrease balance
    buyerUser.balance -= data.amount * data.buyByPrice;
    //remove stocks
    const buyerStock: IUserStock = getStockThatUserSoldById(buyerUser, data.stockId);
    increaseUserAmountOfStocks(buyerUser, buyerStock, data.buyByPrice, data.amount, data.stockId);

    // give stocks for buyers
    let remain = data.amount;
    const minimumStockSoldObj = getLowerSold(changedStock);
    const sellers = JSON.parse(JSON.stringify(minimumStockSoldObj.sellers));
    for (let seller of sellers) {
        const sellerUser: IUser = getUserByName(seller.name);
        const sellerStocks: IUserStock | undefined = getStockThatUserSoldById(sellerUser, data.stockId);
        if (seller.amount <= remain) {
            remain -= seller.amount;
            sellerUser.balance += seller.amount * data.buyByPrice;
            sellerStocks.amount -= seller.amount;
            sellerStocks.frozenAmount -= seller.amount;
            sellerUser.readySold = sellerUser.readySold.filter(order => order.orderId !== seller.orderId);
            if (sellerStocks.amount === 0) {
                sellerUser.stocks = sellerUser.stocks.filter(stock => stock.id !== data.stockId);
            }
            minimumStockSoldObj.sellers.shift();
        } else {
            minimumStockSoldObj.sellers[0].amount -= remain;
            sellerUser.readySold.find(order => order.orderId === seller.orderId).amount -= remain;
            sellerUser.balance += remain * data.buyByPrice;
            sellerStocks.amount -= remain;
            sellerStocks.frozenAmount -= remain;
            remain = 0;
            io.sockets.emit('newBalance', sellerUser);
            break;
        }
        io.sockets.emit('newBalance', sellerUser);
    }
    if (sendToUser) {
        io.sockets.emit('change order book', {changedStock, user: getUserByName(data.buyerName)});
    }


}

const soldAllAndSetSoldOrder = (changedStock: IStock, socket: any, data: soldData): void => {

    const maxBuyStockObj = getTopBuy(changedStock);
    changedStock.orderBook.totalBuy -= maxBuyStockObj.totalAmount;
    changedStock.price = data.soldByPrice;

    const remainAmount = data.amount - maxBuyStockObj.totalAmount;
    soldAllStocks(changedStock, socket, {
        soldByPrice: data.soldByPrice,
        amount: maxBuyStockObj.totalAmount,
        stockId: data.stockId,
        sellerName: data.sellerName
    }, false);

    changedStock.orderBook.buy.shift();
    if (!remainAmount) {
        io.sockets.emit('change order book', {changedStock, user: getUserByName(data.sellerName)});
        return;
    }

    setSoldOrder(changedStock, {
        amount: remainAmount,
        stockId: data.stockId,
        sellerName: data.sellerName,
        soldByPrice: data.soldByPrice
    });
}

const setSoldOrder = (changedStock: IStock, data: soldData): void => {
    //create id of new order
    const newOrderId = orderId++;
    // add new order
    // to user
    const sellerUser: IUser = getUserByName(data.sellerName);
    //freeze stocks that user want to sold
    const sellerStock: IUserStock = getStockThatUserSoldById(sellerUser, data.stockId);
    sellerStock.frozenAmount += data.amount;
    // push new sold order to user
    sellerUser.readySold.push({
        orderId: newOrderId,
        amount: data.amount,
        price: data.soldByPrice,
        stockName: changedStock.name,
        totalAmount: data.amount
    });
    // add new order to order book
    changedStock.orderBook.totalSold += data.amount;
    // if this price there is in order book
    const soldOrder: ISold | undefined = changedStock.orderBook.sold.find(item => item.price === data.soldByPrice);
    if (soldOrder) {
        soldOrder.totalAmount += data.amount;
        soldOrder.sellers.push({
            amount: data.amount,
            name: data.sellerName,
            orderId: newOrderId
        })
    } else {
        changedStock.orderBook.sold.push({
            sellers: [{
                orderId: newOrderId,
                name: data.sellerName,
                amount: data.amount
            }],
            price: data.soldByPrice,
            totalAmount: data.amount
        });
    }
    //sorting by decrease price
    changedStock.orderBook.sold.sort((a, b) => b.price - a.price);
    io.sockets.emit('change order book', {changedStock, user: sellerUser});
}

const buyAllAndSetBuyOrder = (changedStock: IStock, socket: any, data: buyData): void => {
    const minSoldStockObj = getLowerSold(changedStock);
    changedStock.orderBook.totalSold -= minSoldStockObj.totalAmount;
    changedStock.price = data.buyByPrice;

    const remainAmount = data.amount - minSoldStockObj.totalAmount;
    buyAllStocks(changedStock, socket, {
        buyByPrice: data.buyByPrice,
        amount: minSoldStockObj.totalAmount,
        stockId: data.stockId,
        buyerName: data.buyerName
    }, false);

    changedStock.orderBook.sold.pop();
    if (!remainAmount) {
        io.sockets.emit('change order book', {changedStock, user: getUserByName(data.buyerName)});
        return;
    }

    setBuyOrder(changedStock, {
        amount: remainAmount,
        stockId: data.stockId,
        buyerName: data.buyerName,
        buyByPrice: data.buyByPrice
    });
}

const setBuyOrder = (changedStock: IStock, data: buyData): void => {
    //create id of new order
    const newOrderId = orderId++;
    // add new order
    // to user
    const buyerUser: IUser = getUserByName(data.buyerName);
    //freeze balance that user want to buy
    buyerUser.frozenBalance += data.amount * data.buyByPrice;
    // push new sold order to user
    buyerUser.readyBuy.push({
        orderId: newOrderId,
        amount: data.amount,
        price: data.buyByPrice,
        stockName: changedStock.name,
        totalAmount: data.amount
    });
    // add new order to order book
    changedStock.orderBook.totalBuy += data.amount;
    // if this price there is in order book
    const buyOrder: IBuy | undefined = changedStock.orderBook.buy.find(item => item.price === data.buyByPrice);
    if (buyOrder) {
        buyOrder.totalAmount += data.amount;
        buyOrder.buyers.push({
            amount: data.amount,
            name: data.buyerName,
            orderId: newOrderId
        })
    } else {
        changedStock.orderBook.buy.push({
            buyers: [{
                orderId: newOrderId,
                name: data.buyerName,
                amount: data.amount
            }],
            price: data.buyByPrice,
            totalAmount: data.amount
        });
    }
    //sorting by decrease price
    changedStock.orderBook.sold.sort((a, b) => b.price - a.price);
    io.sockets.emit('change order book', {changedStock, user: buyerUser});
}

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('start', () => {
        io.sockets.emit('start');
    })

    socket.on('sold', (data: soldData) => {
        const changedStock: IStock = findStockById(data.stockId);
        const higherBuyer: IBuy = getTopBuy(changedStock);
        if (higherBuyer && higherBuyer.price === data.soldByPrice) {

            if (higherBuyer.totalAmount > data.amount) {
                changedStock.price = data.soldByPrice;
                higherBuyer.totalAmount -= data.amount;
                changedStock.orderBook.totalBuy -= data.amount;
                soldAllStocks(changedStock, socket, data);
            } else {
                soldAllAndSetSoldOrder(changedStock, socket, data);
            }
            changedStock.orderBook.sold.sort((a, b) => b.price - a.price);
            changedStock.orderBook.buy.sort((a, b) => b.price - a.price);
            io.sockets.emit('update stocks', changedStock);
            io.sockets.emit('admin', {stocks, users});
            return;
        }

        setSoldOrder(changedStock, data);
        changedStock.orderBook.sold.sort((a, b) => b.price - a.price);
        changedStock.orderBook.buy.sort((a, b) => b.price - a.price);
        io.sockets.emit('admin', {stocks, users});
        io.sockets.emit('update stocks', changedStock);
    });

    socket.on('buy', (data: buyData) => {
        const changedStock: IStock = findStockById(data.stockId);
        const lowerSeller: ISold | undefined = getLowerSold(changedStock);
        if (lowerSeller && lowerSeller.price === data.buyByPrice) {
            if (lowerSeller.totalAmount > data.amount) {
                changedStock.price = data.buyByPrice;
                lowerSeller.totalAmount -= data.amount;
                changedStock.orderBook.totalSold -= data.amount;
                buyAllStocks(changedStock, socket, data);
            } else {
                buyAllAndSetBuyOrder(changedStock, socket, data);
            }
            changedStock.orderBook.sold.sort((a, b) => b.price - a.price);
            changedStock.orderBook.buy.sort((a, b) => b.price - a.price);
            io.sockets.emit('admin', {stocks, users});
            io.sockets.emit('update stocks', changedStock);
            return;
        }

        setBuyOrder(changedStock, data);
        changedStock.orderBook.sold.sort((a, b) => b.price - a.price);
        changedStock.orderBook.buy.sort((a, b) => b.price - a.price);
        io.sockets.emit('admin', {stocks, users});
        io.sockets.emit('update stocks', changedStock);
    });
});

server.listen(5000, () => {
    console.log('listening on *:5000');
});