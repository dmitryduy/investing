import React from 'react';
import {
    StockCardContainer,
    StockCardContent,
    StockCardImage,
    StockCardName,
    StockCardSector
} from "./StockCard.styles";

const StockCard = ({ticker, name, img, sector}) => {
    return (
        <StockCardContainer>
            <StockCardContent>
                <StockCardName>
                    <h3>{name}</h3>
                    <span>{ticker}</span>
                </StockCardName>
                <StockCardSector>
                    <h4>Сектор</h4>
                    <span>{sector}</span>
                </StockCardSector>
            </StockCardContent>
            <StockCardImage src={img}/>
        </StockCardContainer>
    );
};

export default StockCard;
