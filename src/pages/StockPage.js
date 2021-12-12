import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import styled from "styled-components";
import StockPageMain from "../components/StockPageMain/StockPageMain";
import BuySold from "../components/BuySold/BuySold";
import { useDispatch } from "react-redux";
import { changeBuyPriceAC, changeSoldPriceAC } from "../reducers/settingsReducer";
import UserNavbar from "../components/UserNavbar/UserNavbar";

const Container = styled.div`
  display: flex;
`;

const StockPage = () => {
    const {id} = useParams();
    const [stock, setStock] = useState(null);
    const dispatch = useDispatch();
    useEffect(() => {
        fetch(`http://localhost:5000/stock/${id}`)
            .then(response => response.json())
            .then(data => {
                setStock(data);
                dispatch(changeSoldPriceAC(data.orderBook.buy[0]?.price));
                dispatch(changeBuyPriceAC(data.orderBook.sold[data.orderBook.sold.length - 1]?.price))
            });
    }, []);

    return (
        <>
            <UserNavbar title={stock?.name || 'LOADING'}/>
            {stock &&
            <Container>
                <StockPageMain stock={stock}/>
                <BuySold id={id} price={stock.price}/>
            </Container>}
        </>
    );
};

export default StockPage;
