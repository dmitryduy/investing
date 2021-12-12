import React, { useEffect } from 'react';
import {
    StocksContainer, StocksTitle,
} from "./Stocks.styles";
import StockRow from "./StockRow/StockRow";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStock } from "../../reducers/stockReducer";


const Stocks = () => {

    const {stockData, loaded} = useSelector(({stock}) => stock);
    const stocks = useSelector(({user}) => user?.user?.stocks);
    const dispatch = useDispatch();
    useEffect(() => {
        if (stocks) {
            dispatch(fetchUserStock(stocks.map(stock => stock.id)));
        }
    }, [stocks]);

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
                {loaded ?
                    stockData.sort((a, b) => a.name < b.name? -1: 0).map(stock => <StockRow key={stock.id} item={stock}/>)
                    :
                    <p style={{margin: '0 auto', padding: '10px'}}>Loading...</p>
                }
            </StocksContainer>
        </>

    );
};

export default Stocks;
