import React from 'react';
import { OrderBookContainer, OrderBookHeader, OrderBookItem } from "./OrderBook.styles";

const OrderBook = ({orderBook}) => {
    return (
        <OrderBookContainer>
            <OrderBookHeader>
                <span className='buy'>Покупка</span>
                <span className='price'>Цена, $</span>
                <span className='sold'>Продажа</span>
            </OrderBookHeader>
            {orderBook.sold.map(order => (
                <OrderBookItem className='sold' key={order.price}>
                    <div className='progress' style={{width: `${order.totalAmount / orderBook.totalSold * 100}%`}}/>
                    <span className='amount'>{order.totalAmount.toLocaleString('RU-ru')}</span>
                    <span className='price'>{order.price.toLocaleString('RU-ru')}</span>
                </OrderBookItem>
            ))}
            {orderBook.buy.map(order => (
                <OrderBookItem className='buy' key={order.price} >
                    <div className='progress' style={{width: `${order.totalAmount / orderBook.totalSold * 100}%`}}/>
                    <span className='amount'>{order.totalAmount.toLocaleString('RU-ru')}</span>
                    <span className='price'>{order.price.toLocaleString('RU-ru')}</span>
                </OrderBookItem>
            ))}
        </OrderBookContainer>
    );
};

export default OrderBook;
