import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import OrderBook from "../components/OrderBook/OrderBook";
import SoldContent from "../components/SoldContent/SoldContent";
import { useParams } from "react-router";
import BuySoldAbout from "../components/BuySoldAbout/BuySoldAbout";
import socket from "../sockets";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserAC } from "../reducers/userReducer";

const SoldPageContainer = styled.div`
  display: flex;
`;

const SoldPage = () => {
    const {id} = useParams();
    const [stock, setStock] = useState(null);
    const dispatch = useDispatch();
    const userId = useSelector(({user}) => user.user.id);

    useEffect(() => {
        socket.on('sold', (data) => {
            setStock(data.changedStock);
            if (data.user.id === userId) {
                dispatch(fetchUserAC(data.user));
            }
        })
        fetch(`http://localhost:5000/stock/${id}`)
            .then(response => response.json())
            .then(data => setStock(data));
        return () => {
            socket.off('sold');
        }
    }, []);
    return (
        stock &&
            <>
                <BuySoldAbout title='Продажа'/>
                <SoldPageContainer>
                    <SoldContent id={id} lastOrder={stock.price} img={stock.image} name={stock.name} ticker={stock.ticker}/>
                    <OrderBook id={id} orderBook={stock.orderBook}/>
                </SoldPageContainer>
            </>
    );
};

export default SoldPage;
