import React, { useEffect, useState } from 'react';
import OrderBook from "../components/OrderBook/OrderBook";
import SoldContent from "../components/SoldContent/SoldContent";
import { useParams } from "react-router";
import socket from "../sockets";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAC } from "../reducers/userReducer";
import UserNavbar from "../components/UserNavbar/UserNavbar";


const SoldPage = () => {
    const {id} = useParams();
    const [stock, setStock] = useState(null);
    const dispatch = useDispatch();
    const userId = useSelector(({user}) => user.user.id);

    useEffect(() => {
        socket.on('change order book', (data) => {
            console.log(data)
            setStock(data.changedStock);
            if (data.user.id === userId) {
                dispatch(fetchUserAC(data.user));
            }
        })
        fetch(`http://localhost:5000/stock/${id}`)
            .then(response => response.json())
            .then(data => setStock(data));
        return () => {
            socket.off('change order book');
        }
    }, []);
    return (
        <>
            <UserNavbar title={`Продажа ${stock?.name || 'LOADING'}`}/>
            {stock &&
            <>
                <div style={{display: 'flex'}}>
                    <SoldContent minSoldPrice={stock.orderBook.buy[0]?.price || 0.01}
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

export default SoldPage;
