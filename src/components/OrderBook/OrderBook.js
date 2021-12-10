import React, { useEffect, useState } from 'react';
import { OrderBookContainer, OrderBookHeader, OrderBookItem } from "./OrderBook.styles";
import { useParams } from "react-router";

const OrderBook = () => {
    const {id} = useParams();
    const [orderBook, setOrderBook] = useState(null);
    useEffect(() => {
        fetch(`http://localhost:5000/order-book/${id}`)
            .then(response => response.json())
            .then(data => setOrderBook(data))
    }, []);

    return (
        orderBook &&
        <OrderBookContainer>
            <OrderBookHeader>
                <span className='buy'>Покупка</span>
                <span className='price'>Цена, $</span>
                <span className='sold'>Продажа</span>
            </OrderBookHeader>
            {orderBook.sold.map(order => (
                <OrderBookItem className='sold' progressWidth={order.amount / orderBook.totalSold * 100}>
                    <div className='progress'/>
                    <span className='amount'>{order.amount}</span>
                    <span className='price'>{order.price}</span>
                </OrderBookItem>
            ))}
            {orderBook.buy.map(order => (
                <OrderBookItem className='buy' progressWidth={order.amount / orderBook.totalSold * 100}>
                    <div className='progress'/>
                    <span className='amount'>{order.amount}</span>
                    <span className='price'>{order.price}</span>
                </OrderBookItem>
            ))}
        </OrderBookContainer>
    );
};

export default OrderBook;
