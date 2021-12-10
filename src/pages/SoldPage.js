import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import OrderBook from "../components/OrderBook/OrderBook";
import SoldContent from "../components/SoldContent/SoldContent";
import { useParams } from "react-router";
import BuySoldAbout from "../components/BuySoldAbout/BuySoldAbout";
import socket from "../sockets";

const SoldPageContainer = styled.div`
  display: flex;
`;

const SoldPage = () => {
    const {id} = useParams();
    const [stock, setStock] = useState(null);

    socket.on('sold', (data) => {
        setStock(data);
    })
    useEffect(() => {
        fetch(`http://localhost:5000/stock/${id}`)
            .then(response => response.json())
            .then(data => setStock(data));

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
