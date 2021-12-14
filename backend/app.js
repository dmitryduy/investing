var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');
var http = require('http');
var server = http.createServer(app);
var io = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
});
app.use(cors());
app.use(bodyParser.json());
var users = JSON.parse(fs.readFileSync('backend/user.json', 'utf8'));
var stocks = JSON.parse(fs.readFileSync('backend/stocks.json', 'utf8'));
var orderId = 0;
app.get('/user/:userName', function (req, res) {
    var userName = req.params.userName;
    var user = users.find(function (user) { return user.name === userName; });
    if (!user) {
        res.status(400);
    }
    res.json(user);
});
app.get('/stock/:id', function (req, res) {
    var stock = stocks.find(function (stock) { return stock.id === +req.params.id; });
    res.json(stock);
});
app.get('/order-book/:id', function (req, res) {
    var orderBook = stocks.find(function (stock) { return stock.id === +req.params.id; }).orderBook;
    res.json(orderBook);
});
app.post('/getStock', function (req, res) {
    var arrOfStock = req.body.map(function (stockId) {
        var stock = stocks.find(function (stock) { return stock.id === stockId; });
        return {
            id: stock.id,
            price: stock.price,
            name: stock.name,
            ticker: stock.ticker,
            image: stock.image
        };
    });
    res.json(arrOfStock);
});
app.get('/stock', function (req, res) {
    res.json(stocks.map(function (stock) { return ({
        id: stock.id,
        image: stock.image,
        name: stock.name,
        ticker: stock.ticker,
        price: stock.price
    }); }));
});
var findStockById = function (stockId) {
    return stocks.find(function (stock) { return stock.id === stockId; });
};
var getTopBuy = function (stock) {
    return stock.orderBook.buy[0];
};
var getLowerSold = function (stock) {
    return stock.orderBook.sold[stock.orderBook.sold.length - 1];
};
var getUserByName = function (userName) {
    return users.find(function (user) { return user.name === userName; });
};
var getStockThatUserSoldById = function (user, stockId) {
    return user.stocks.find(function (stock) { return stock.id === stockId; });
};
var increaseUserAmountOfStocks = function (user, userStocks, price, amount, stockId) {
    if (userStocks) {
        userStocks.amount += amount;
        userStocks.price = +(((userStocks.price * userStocks.amount + price * amount) / (amount + userStocks.amount)).toFixed(2));
    }
    else {
        user.stocks.push({
            price: price,
            amount: amount,
            id: stockId,
            frozenAmount: 0
        });
    }
};
var soldAllStocks = function (changedStock, socket, data, sendToUser) {
    if (sendToUser === void 0) { sendToUser = true; }
    //change user info
    var sellerUser = getUserByName(data.sellerName);
    //increase balance
    sellerUser.balance += data.amount * data.soldByPrice;
    //remove stocks
    var sellerStock = getStockThatUserSoldById(sellerUser, data.stockId);
    sellerStock.amount -= data.amount;
    //if user sold all stocks
    if (sellerStock.amount === 0) {
        sellerUser.stocks = sellerUser.stocks.filter(function (stock) { return stock.id !== data.stockId; });
    }
    // give stocks for buyers
    var remain = data.amount;
    var maximumStockBuyObj = getTopBuy(changedStock);
    var buyers = JSON.parse(JSON.stringify(maximumStockBuyObj.buyers));
    var _loop_1 = function (buyer) {
        var buyerUser = getUserByName(buyer.name);
        var buyerStocks = getStockThatUserSoldById(buyerUser, data.stockId);
        if (buyer.amount <= remain) {
            console.log(buyer, remain);
            remain -= buyer.amount;
            buyerUser.balance -= buyer.amount * data.soldByPrice;
            buyerUser.frozenBalance -= buyer.amount * data.soldByPrice;
            buyerUser.readyBuy = buyerUser.readyBuy.filter(function (order) { return order.orderId !== buyer.orderId; });
            increaseUserAmountOfStocks(buyerUser, buyerStocks, data.soldByPrice, buyer.amount, data.stockId);
            maximumStockBuyObj.buyers.shift();
        }
        else {
            maximumStockBuyObj.buyers[0].amount -= remain;
            buyerUser.frozenBalance -= remain * data.soldByPrice;
            buyerUser.balance -= remain * data.soldByPrice;
            buyerUser.readyBuy.find(function (order) { return order.orderId === buyer.orderId; }).amount -= remain;
            increaseUserAmountOfStocks(buyerUser, buyerStocks, data.soldByPrice, remain, data.stockId);
            remain = 0;
            io.sockets.emit('newBalance', buyerUser);
            return "break";
        }
        io.sockets.emit('newBalance', buyerUser);
    };
    for (var _i = 0, buyers_1 = buyers; _i < buyers_1.length; _i++) {
        var buyer = buyers_1[_i];
        var state_1 = _loop_1(buyer);
        if (state_1 === "break")
            break;
    }
    if (sendToUser) {
        io.sockets.emit('change order book', { changedStock: changedStock, user: getUserByName(data.sellerName) });
    }
};
var buyAllStocks = function (changedStock, socket, data, sendToUser) {
    if (sendToUser === void 0) { sendToUser = true; }
    //change user info
    var buyerUser = getUserByName(data.buyerName);
    //decrease balance
    buyerUser.balance -= data.amount * data.buyByPrice;
    //remove stocks
    var buyerStock = getStockThatUserSoldById(buyerUser, data.stockId);
    increaseUserAmountOfStocks(buyerUser, buyerStock, data.buyByPrice, data.amount, data.stockId);
    // give stocks for buyers
    var remain = data.amount;
    var minimumStockSoldObj = getLowerSold(changedStock);
    var sellers = JSON.parse(JSON.stringify(minimumStockSoldObj.sellers));
    console.log(minimumStockSoldObj);
    var _loop_2 = function (seller) {
        var sellerUser = getUserByName(seller.name);
        var sellerStocks = getStockThatUserSoldById(sellerUser, data.stockId);
        console.log(buyerUser, remain, sellerStocks, data, minimumStockSoldObj, minimumStockSoldObj.sellers);
        if (seller.amount <= remain) {
            remain -= seller.amount;
            sellerUser.balance += seller.amount * data.buyByPrice;
            sellerStocks.amount -= seller.amount;
            sellerStocks.frozenAmount -= seller.amount;
            sellerUser.readySold = sellerUser.readySold.filter(function (order) { return order.orderId !== seller.orderId; });
            if (sellerStocks.amount === 0) {
                sellerUser.stocks = sellerUser.stocks.filter(function (stock) { return stock.id !== data.stockId; });
            }
            minimumStockSoldObj.sellers.shift();
        }
        else {
            console.log(111, minimumStockSoldObj, data, sellerUser, sellerStocks);
            minimumStockSoldObj.sellers[0].amount -= remain;
            sellerUser.readySold.find(function (order) { return order.orderId === seller.orderId; }).amount -= remain;
            sellerUser.balance += remain * data.buyByPrice;
            sellerStocks.amount -= remain;
            sellerStocks.frozenAmount -= remain;
            remain = 0;
            io.sockets.emit('newBalance', sellerUser);
            return "break";
        }
        io.sockets.emit('newBalance', sellerUser);
    };
    for (var _i = 0, sellers_1 = sellers; _i < sellers_1.length; _i++) {
        var seller = sellers_1[_i];
        var state_2 = _loop_2(seller);
        if (state_2 === "break")
            break;
    }
    if (sendToUser) {
        io.sockets.emit('change order book', { changedStock: changedStock, user: getUserByName(data.buyerName) });
    }
};
var soldAllAndSetSoldOrder = function (changedStock, socket, data) {
    var maxBuyStockObj = getTopBuy(changedStock);
    changedStock.orderBook.totalBuy -= maxBuyStockObj.totalAmount;
    changedStock.price = data.soldByPrice;
    var remainAmount = data.amount - maxBuyStockObj.totalAmount;
    soldAllStocks(changedStock, socket, {
        soldByPrice: data.soldByPrice,
        amount: maxBuyStockObj.totalAmount,
        stockId: data.stockId,
        sellerName: data.sellerName
    }, false);
    changedStock.orderBook.buy.shift();
    if (!remainAmount) {
        io.sockets.emit('change order book', { changedStock: changedStock, user: getUserByName(data.sellerName) });
        return;
    }
    setSoldOrder(changedStock, {
        amount: remainAmount,
        stockId: data.stockId,
        sellerName: data.sellerName,
        soldByPrice: data.soldByPrice
    });
};
var setSoldOrder = function (changedStock, data) {
    //create id of new order
    var newOrderId = orderId++;
    // add new order
    // to user
    var sellerUser = getUserByName(data.sellerName);
    //freeze stocks that user want to sold
    var sellerStock = getStockThatUserSoldById(sellerUser, data.stockId);
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
    var soldOrder = changedStock.orderBook.sold.find(function (item) { return item.price === data.soldByPrice; });
    if (soldOrder) {
        soldOrder.totalAmount += data.amount;
        soldOrder.sellers.push({
            amount: data.amount,
            name: data.sellerName,
            orderId: newOrderId
        });
    }
    else {
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
    changedStock.orderBook.sold.sort(function (a, b) { return b.price - a.price; });
    io.sockets.emit('change order book', { changedStock: changedStock, user: sellerUser });
};
var buyAllAndSetBuyOrder = function (changedStock, socket, data) {
    var minSoldStockObj = getLowerSold(changedStock);
    changedStock.orderBook.totalSold -= minSoldStockObj.totalAmount;
    changedStock.price = data.buyByPrice;
    var remainAmount = data.amount - minSoldStockObj.totalAmount;
    buyAllStocks(changedStock, socket, {
        buyByPrice: data.buyByPrice,
        amount: minSoldStockObj.totalAmount,
        stockId: data.stockId,
        buyerName: data.buyerName
    }, false);
    changedStock.orderBook.sold.pop();
    if (!remainAmount) {
        io.sockets.emit('change order book', { changedStock: changedStock, user: getUserByName(data.buyerName) });
        return;
    }
    setBuyOrder(changedStock, {
        amount: remainAmount,
        stockId: data.stockId,
        buyerName: data.buyerName,
        buyByPrice: data.buyByPrice
    });
};
var setBuyOrder = function (changedStock, data) {
    //create id of new order
    var newOrderId = orderId++;
    // add new order
    // to user
    var buyerUser = getUserByName(data.buyerName);
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
    var buyOrder = changedStock.orderBook.buy.find(function (item) { return item.price === data.buyByPrice; });
    if (buyOrder) {
        buyOrder.totalAmount += data.amount;
        buyOrder.buyers.push({
            amount: data.amount,
            name: data.buyerName,
            orderId: newOrderId
        });
    }
    else {
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
    changedStock.orderBook.sold.sort(function (a, b) { return b.price - a.price; });
    io.sockets.emit('change order book', { changedStock: changedStock, user: buyerUser });
};
io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('sold', function (data) {
        var changedStock = findStockById(data.stockId);
        var higherBuyer = getTopBuy(changedStock);
        if (higherBuyer && higherBuyer.price === data.soldByPrice) {
            if (higherBuyer.totalAmount > data.amount) {
                changedStock.price = data.soldByPrice;
                higherBuyer.totalAmount -= data.amount;
                changedStock.orderBook.totalBuy -= data.amount;
                soldAllStocks(changedStock, socket, data);
            }
            else {
                soldAllAndSetSoldOrder(changedStock, socket, data);
            }
            io.sockets.emit('update stocks', changedStock);
            return;
        }
        setSoldOrder(changedStock, data);
        io.sockets.emit('update stocks', changedStock);
    });
    socket.on('buy', function (data) {
        var changedStock = findStockById(data.stockId);
        var lowerSeller = getLowerSold(changedStock);
        if (lowerSeller && lowerSeller.price === data.buyByPrice) {
            if (lowerSeller.totalAmount > data.amount) {
                changedStock.price = data.buyByPrice;
                lowerSeller.totalAmount -= data.amount;
                changedStock.orderBook.totalSold -= data.amount;
                buyAllStocks(changedStock, socket, data);
            }
            else {
                buyAllAndSetBuyOrder(changedStock, socket, data);
            }
            io.sockets.emit('update stocks', changedStock);
            return;
        }
        setBuyOrder(changedStock, data);
    });
});
server.listen(5000, function () {
    console.log('listening on *:5000');
});
