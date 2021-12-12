import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import socket from "../sockets";
import { fetchUserAC } from "../reducers/userReducer";
import OrderBook from "../components/OrderBook/OrderBook";
import BuyContent from "../components/BuyContent/BuyContent";
import UserNavbar from "../components/UserNavbar/UserNavbar";

const BuyPage = () => {
    const {id} = useParams();
    const [stock, setStock] = useState(null);
    const dispatch = useDispatch();
    const userId = useSelector(({user}) => user.user.id);
    useEffect(() => {
        socket.on('buy', (data) => {
            setStock(data.changedStock);
            if (data.user.id === userId) {
                dispatch(fetchUserAC(data.user));
            }
        })
        fetch(`http://localhost:5000/stock/${id}`)
            .then(response => response.json())
            .then(data => setStock(data));
        return () => {
            socket.off('buy');
        }
    }, []);

    return (
        <>
            <UserNavbar title={`Покупка ${stock?.name || 'LOADING'}`}/>
            {stock &&
            <>
                <div style={{display:'flex'}}>
                    <BuyContent maxBuyPrice={stock.orderBook.sold[stock.orderBook.sold.length - 1]?.price || 999999}
                                id={id}
                                lastOrder={stock.price}
                                img={stock.image}
                                name={stock.name}
                                ticker={stock.ticker}/>
                    <OrderBook id={id} orderBook={stock.orderBook}/>
                </div>
            </>}
        </>

    );
};

export default BuyPage;
