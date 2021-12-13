import React, { useEffect } from 'react';
import {
    StocksContainer, StocksTitle,
} from "./Stocks.styles";
import StockRow from "./StockRow/StockRow";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStock } from "../../reducers/stockReducer";


const Stocks = () => {

    const {stockData, loaded} = useSelector(({stock}) => stock);
    const userStocks = useSelector(({user}) => user.user.stocks);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchUserStock(userStocks.map(stock => stock.id)));
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
                {loaded ?
                    stockData
                        .sort((a, b) => a.name < b.name ? -1 : 0)
                        .map(stock => <StockRow key={stock.id} stock={stock}/>)
                    :
                    <p style={{margin: '0 auto', padding: '10px'}}>Loading...</p>
                }
            </StocksContainer>
        </>

    );
};

export default Stocks;
