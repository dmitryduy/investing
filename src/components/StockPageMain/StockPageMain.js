import React from 'react';
import StockCard from "./StockCard/StockCard";
import { AboutStock, StockCardWidget, StockCardWidgetContent } from "./StockPageMain.styles";

const StockPageMain = ({stock}) => {
    return (
        <div style={{flex: '3', marginRight: '20px'}}>
           <StockCard img={stock.image} sector={stock.sector} name={stock.name} ticker={stock.ticker}/>
            <AboutStock>
                <h3>О компании</h3>
                <p>{stock.about}</p>
            </AboutStock>
            <StockCardWidget>
                <h4>Страна</h4>
                <StockCardWidgetContent>
                    <img src={stock.countryInfo.countryImage} alt={stock.countryInfo.counryName}/>
                    <span>{stock.countryInfo.countryName}</span>
                </StockCardWidgetContent>
            </StockCardWidget>
            <StockCardWidget>
                <h4>Биржа торгов</h4>
                <StockCardWidgetContent>
                    <img src={stock.stockExchangeInfo.stockExchangeImage} alt={stock.stockExchangeInfo.stockExchangeName}/>
                    <span>{stock.stockExchangeInfo.stockExchangeName}</span>
                </StockCardWidgetContent>
            </StockCardWidget>
        </div>
    );
};

export default StockPageMain;
