import React, { useEffect, useState } from 'react';
import OrderBook from "../components/OrderBook/OrderBook";
import SoldContent from "../components/SoldContent/SoldContent";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAC } from "../reducers/userReducer";
import UserNavbar from "../components/UserNavbar/UserNavbar";
import useSocket from "../hooks/useSocket";


const SoldPage = () => {
    const {id} = useParams();
    const soldSocket = useSocket('change order book');
    const [stock, setStock] = useState(null);
    const dispatch = useDispatch();
    const userId = useSelector(({user}) => user.user.id);

    useEffect(() => {
        soldSocket.on((data) => {
            if (+data.changedStock.id === +id) {
                setStock(data.changedStock);
            }
            if (data.user.id === userId) {
                dispatch(fetchUserAC(data.user));
            }
        })
        fetch(`http://localhost:5000/stock/${id}`)
            .then(response => response.json())
            .then(data => setStock(data));
        return () => {
            soldSocket.off();
        }
    }, []);
    return (
        stock &&
        <>
            <UserNavbar title={`Продажа ${stock.name}`}/>
            <div style={{display: 'flex'}}>
                <SoldContent minSoldPrice={stock.orderBook.buy[0]?.price || 0.01}
                             id={id}
                             lastOrder={stock.price}
                             img={stock.image}
                             name={stock.name}
                             ticker={stock.ticker}/>
                <OrderBook id={id} orderBook={stock.orderBook}/>
            </div>
        </>

    );
};

export default SoldPage;
