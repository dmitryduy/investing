import React from 'react';
import { LastOrder, SoldBuyInfo, StockName } from "./SoldBuyStockInfo.styles";
const SoldBuyStockInfo = ({id, img, ticker, name, lastOrder}) => {
    return (
        <SoldBuyInfo to={`/stocks/${id}`}>
            <img src={img} alt={name}/>
            <StockName>
                <span className='ticker'>{ticker}</span>
                <span className='name'>{name}</span>
            </StockName>
            <LastOrder>
                <span>Последняя сделка</span>
                <span className='last-order'>{lastOrder} $</span>
            </LastOrder>
        </SoldBuyInfo>
    );
};

export default SoldBuyStockInfo;
