import React, { useEffect, useState } from 'react';
import {
    StocksContainer, StocksTitle,
} from "./Stocks.styles";
import StockRow from "./StockRow/StockRow";


const Stocks = () => {

    const [stock, setStock] = useState(null);
    useEffect(() => {
        fetch('http://localhost:5000/getStock')
            .then(response => response.json())
            .then(data => {
                setStock(data);
            });
    }, []);

    return (
        <>
            <StocksTitle>Акции</StocksTitle>
            <StocksContainer>
                <div className='header'>
                    <li>Название</li>
                    <li>Цена</li>
                    <li>Стоимость</li>
                    <li>За сегодня</li>
                </div>
                {stock?.map(stock => <StockRow key={stock.stock.id} item={stock}/>)}
            </StocksContainer>
        </>

    );
};

export default Stocks;
