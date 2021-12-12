import React from 'react';
import UserNavbar from "../components/UserNavbar/UserNavbar";
import { useSelector } from "react-redux";
import OrderRow from "../components/OrderRow/OrderRow";

const OrderPage = () => {
    let {readyBuy, readySold} = useSelector(({user}) => user.user);
    readyBuy = readyBuy.map(item => ({...item, type: 'buy'}));
    readySold = readySold.map(item => ({...item, type: 'sold'}));
    const orderList = readyBuy.concat(readySold).sort((a, b) => b.orderId - a.orderId);
    return (
        <div>
            <UserNavbar title='Активные заявки' active='order'/>
            {orderList.map(orderItem => <OrderRow key={orderItem.orderId} id={orderItem.orderId}
                                                  totalAmount={orderItem.totalAmount}
                                                  type={orderItem.type} price={orderItem.price}
                                                  stockName={orderItem.stockName} amount={orderItem.amount}/>)}
        </div>
    );
};

export default OrderPage;
