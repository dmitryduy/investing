import React from 'react';
import { OrderBookContainer, OrderBookHeader, OrderBookItem } from "./OrderBook.styles";
import { useDispatch, useSelector } from "react-redux";
import { changeBuyPriceAC, changeSoldPriceAC } from "../../reducers/settingsReducer";

const OrderBook = ({orderBook}) => {
    const dispatch = useDispatch();
    const changeChoosePrice = (newPrice) => {
        dispatch(changeSoldPriceAC(newPrice));
        dispatch(changeBuyPriceAC(newPrice))
    }
    const userOrders = [];
    const {readyBuy, readySold} = useSelector(({user}) => user.user);

    readySold.concat(readyBuy).forEach(userOrder => {
        const temp = userOrders.find(item => item.price === userOrder.price);
        if (temp) {
            temp.amount+= userOrder.amount;
        }
        else {
            userOrders.push({price: userOrder.price, amount: userOrder.amount});
        }
    });
    return (
        <OrderBookContainer>
            <OrderBookHeader>
                <span className='buy'>Покупка</span>
                <span className='price'>Цена, $</span>
                <span className='sold'>Продажа</span>
            </OrderBookHeader>
            {orderBook.sold.map(order => {
                const showUserOrders = userOrders.find(userOrder => userOrder.price === order.price) || false;
                return (
                    <OrderBookItem onClick={() => changeChoosePrice(order.price)} className='sold' key={order.price}>
                        {showUserOrders &&<span className='user-orders'>{showUserOrders.amount}</span>}
                        <div className='progress' style={{width: `${order.totalAmount / orderBook.totalSold * 100}%`}}/>
                        <span className='amount'>{order.totalAmount.toLocaleString('RU-ru')}</span>
                        <span className='price'>{order.price.toLocaleString('RU-ru')}</span>
                    </OrderBookItem>
                )
            })}
            {orderBook.buy.map(order => {
                const showUserOrders = userOrders.find(userOrder => userOrder.price === order.price) || false;
                return (
                    <OrderBookItem onClick={() => changeChoosePrice(order.price)} className='buy' key={order.price} >
                        {showUserOrders &&<span className='user-orders'>{showUserOrders.amount}</span>}
                        <div className='progress' style={{width: `${order.totalAmount / orderBook.totalBuy * 100}%`}}/>
                        <span className='amount'>{order.totalAmount.toLocaleString('RU-ru')}</span>
                        <span className='price'>{order.price.toLocaleString('RU-ru')}</span>
                    </OrderBookItem>
                )
            })}
        </OrderBookContainer>
    );
};

export default OrderBook;
