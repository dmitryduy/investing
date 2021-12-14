import React from 'react';
import {
    StockImage,
    StockName,
    StockPrice,
    StockProfit, StockRowContainer,
    StockTicker,
    StockTitle,
    StockTotalPrice
} from "./StockRow.styles";
import { useSelector } from "react-redux";
import LockSvg from "../../LockSvg/LockSvg";
import Arrow from "../../Arrow/Arrow";
import toLocale from "../../../toLocale";


const StockRow = ({stock}) => {
    const userStockData = useSelector(({user}) => user.user.stocks.find(stockUser => stockUser.id === stock.id));

    if (!userStockData) {
        return null;
    }
    const sign = stock.price > userStockData.price ? '+' : stock.price < userStockData.price ? '-' : '';

    return (
        <StockRowContainer to={`/stocks/${stock.id}`}>
            <StockName>
                <StockImage src={stock.image}/>
                <div>
                    <StockTitle>{stock.name}</StockTitle>
                    <StockTicker>{stock.ticker}</StockTicker>
                </div>
            </StockName>
            <StockPrice>
                <span className='prev'>{toLocale(userStockData.price)}</span>
                <Arrow/>
                <span className='current'>{toLocale(stock.price)}</span>
            </StockPrice>
            <StockTotalPrice>
                <span className='price'>{toLocale(userStockData.amount * stock.price)}</span>
                <span className='amount'>{userStockData.amount} шт.
                    {userStockData.frozenAmount ?
                        <span>
                            ({<LockSvg color='#000' fontSize={11}/>} {userStockData.frozenAmount} шт.)
                        </span> : ''}
                    </span>
            </StockTotalPrice>
            <StockProfit className={sign === '+' ? 'positive' : sign === '-' ? 'negative' : ''}>
                <span className='dollars'>
                    {sign}
                    {toLocale(userStockData.amount * userStockData.price - stock.price * userStockData.amount)}</span>
                <span className='percent'>
                    {sign}
                    {toLocale((stock.price - userStockData.price) / userStockData.price, true)}</span>
            </StockProfit>
        </StockRowContainer>
    );
};

export default StockRow;
