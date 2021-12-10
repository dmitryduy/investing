import React from 'react';
import styled from "styled-components";
import OrderBook from "../components/OrderBook/OrderBook";

const SoldPageContainer = styled.div`
  display: flex;
`;

const SoldPage = () => {
    return (
        <SoldPageContainer>
            <div style={{flex: 5}}></div>
            <OrderBook/>
        </SoldPageContainer>
    );
};

export default SoldPage;
