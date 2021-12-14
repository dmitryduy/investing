import React from 'react';
import { StockAmount, UserBalance, UserName, UserStock, UserStocks, StockName, UserOrders, Order } from "./User.styles";
import toLocale from "../../toLocale";


const User = ({user, stocks}) => {
    const orders = user.readySold.concat(user.readyBuy);
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <UserName>Имя: {user.name}</UserName>
            <UserBalance>Баланс: {toLocale(user.balance)}</UserBalance>
            <UserStocks>
                <h2>Акции</h2>
                {user.stocks.map(stock => <UserStock id={stock.id}>
                    <StockName>{stocks.find(s => s.id === stock.id).name}</StockName>
                    <StockAmount>{stock.amount} шт</StockAmount>
                </UserStock>)}
                {!user.stocks.length && <p>Нет акций</p>}
            </UserStocks>
            <UserOrders>
                <h2>Ордера</h2>
                {orders.map(order => <Order key={order.orderId}>
                    <StockName>{order.stockName}</StockName>
                    <StockAmount>{order.amount} шт</StockAmount>
                </Order>)}
                {!orders.length && <p>Нет Ордеров</p>}
            </UserOrders>
        </div>
    );
};

export default User;
