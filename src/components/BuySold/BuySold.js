import React from 'react';
import { BuySoldButton, BuySoldContainer, BuySoldItem } from "./BuySold.styles";

const BuySold = ({price, id}) => {
    return (
        <BuySoldContainer>
            <BuySoldItem>
                <h5>Покупка</h5>
                <span>{price} $</span>
                <BuySoldButton to={`/buy/${id}`}>Купить</BuySoldButton>
            </BuySoldItem>
            <BuySoldItem>
                <h5>Продажа</h5>
                <span>{price} $</span>
                <BuySoldButton to={`/sold/${id}`}>Продать</BuySoldButton>
            </BuySoldItem>
        </BuySoldContainer>
    );
};

export default BuySold;
