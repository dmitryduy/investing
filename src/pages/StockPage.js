import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import styled from "styled-components";
import StockPageMain from "../components/StockPageMain/StockPageMain";
import BuySold from "../components/BuySold/BuySold";

const Container = styled.div`
  display: flex;
`;

const StockPage = () => {
    const {id} = useParams();
    const [stock, setStock] = useState(null);
    useEffect(() => {
        fetch(`http://localhost:5000/stock/${id}`)
            .then(response => response.json())
            .then(data => setStock(data));
    }, []);

    return (
        stock &&
        <Container>
            <StockPageMain stock={stock}/>
            <BuySold id={id} price={stock.price}/>
        </Container>
    );
};

export default StockPage;
