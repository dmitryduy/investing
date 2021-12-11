import React, { useEffect } from 'react';
import {
    StocksContainer, StocksTitle,
} from "./Stocks.styles";
import StockRow from "./StockRow/StockRow";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStock, fetchUserStockAC } from "../../reducers/stockReducer";


const Stocks = () => {

    const {stockData, loaded} = useSelector(({stock}) => stock);
    const stocks = useSelector(({user}) => user?.user?.stocks);
    const dispatch = useDispatch();
    console.log(stockData, stocks)
    useEffect(() => {
        if (stocks) {
            console.log(40594584095840958409584093)
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
                    stockData.map(stock => <StockRow key={stock.id} item={stock}/>)
                    :
                    <p style={{margin: '0 auto', padding: '10px'}}>Loading...</p>
                }
            </StocksContainer>
        </>

    );
};

export default Stocks;
