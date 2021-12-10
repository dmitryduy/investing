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


const StockRow = ({item: stock}) => {

    const userStockData = useSelector(({user}) => user.user.stocks.find(stockUser => stockUser.id === stock.id));

    const sign = stock.price >= userStockData.buyFor ? '+' : '-';
    return (
        <StockRowContainer to={`/stocks/${stock.id}`}>
            <StockName>
                <StockImage src={stock.image}/>
                <div>
                    <StockTitle>{stock.name}</StockTitle>
                    <StockTicker>{stock.ticker}</StockTicker>
                </div>
            </StockName>
            <StockPrice><span className='prev'>{userStockData.buyFor.toLocaleString('RU-ru')} $</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                    <path
                        d="M9.589 7.001L8.297 5.706a1 1 0 111.416-1.412l2.29 2.295a2 2 0 01-.001 2.826l-2.29 2.292a1 1 0 11-1.414-1.414l1.29-1.292-5.587.004a1 1 0 01-.002-2L9.59 7z"
                        fill="currentColor"/>
                </svg>
                <span className='current'>{stock.price.toLocaleString('RU-ru')} $</span></StockPrice>
            <StockTotalPrice>
                <span className='price'>{(userStockData.amount * stock.price).toLocaleString('RU-ru')} $</span>
                <span className='amount'>{userStockData.amount} шт.</span>
            </StockTotalPrice>
            <StockProfit className={sign === '+' ? 'positive' : 'negative'}>
                <span className='dollars'>
                    {sign}
                    {Math.abs(userStockData.amount * userStockData.buyFor - stock.price * userStockData.amount).toLocaleString('RU-ru')} $</span>
                <span className='percent'>
                    {sign}
                    {(Math.abs(stock.price - userStockData.buyFor) / userStockData.buyFor * 100).toLocaleString('RU-ru')} %</span>
            </StockProfit>
        </StockRowContainer>
    );
};

export default StockRow;
