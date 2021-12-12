import React, { useEffect, useState } from 'react';
import UserNavbar from "../components/UserNavbar/UserNavbar";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Header = styled.div`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #eaecee;
  color: #5485b8;
  margin-top: 100px;
  span:first-child {
    flex: 1;
  }
`;

const StocksContainer = styled.div`
    margin-top: -30px;
`;

const StockItem = styled(Link)`
  display: flex;
  padding: 16px;
  border-bottom: 1px solid #eaecee;
  transition: .2s;
  &:hover {
    background-color: #e7e8ea;
  }
`;

const StockImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const StockName = styled.div`
  display: flex;
  color: #333;
  flex: 1;
  div {
    display: flex;
    flex-direction: column;
    span:first-child {
      margin-bottom: 5px;
    }
    span:last-child {
      color: #666;
    }
  }
`;

const StockPrice = styled.span`
  display: flex;
  align-items: center;
  font-size: 17px;
  color: #333;
`;

const Catalog = () => {

    const [stocks, setStocks] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/stock')
            .then(response => response.json())
            .then(data => setStocks(data));
    }, []);

    return (
        <div>
            <UserNavbar active='catalog' title='Каталог акций'/>
            <StocksContainer>
                <Header>
                    <span>Название</span>
                    <span>Цена</span>
                </Header>
                {stocks &&
                stocks.map(stock => <StockItem to={`/stocks/${stock.id}`} key={stock.id}>
                    <StockName>
                        <StockImage src={stock.image}/>
                        <div>
                            <span>{stock.name}</span>
                            <span>{stock.ticker}</span>
                        </div>
                    </StockName>
                    <StockPrice>{stock.price} $</StockPrice>
                </StockItem>)
                }
            </StocksContainer>

        </div>
    );
};

export default Catalog;
