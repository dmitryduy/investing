import React from 'react';
import { BuySoldButton, BuySoldContainer, BuySoldItem } from "./BuySold.styles";
import { useSelector } from "react-redux";
import { Button } from "../../Styled";

const BuySold = ({price, id}) => {
    const stockInUser = useSelector(({user}) => user.user.stocks.find(stock => stock.id === +id)) || false;
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
                {stockInUser &&  <BuySoldButton to={`/sold/${id}`}>Продать</BuySoldButton>}
                {!stockInUser && <Button disabled>Недоступно</Button>}
            </BuySoldItem>
        </BuySoldContainer>
    );
};

export default BuySold;
