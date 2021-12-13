import React from 'react';
import { BuySoldButton, BuySoldContainer, BuySoldItem } from "./BuySold.styles";
import { useSelector } from "react-redux";
import { Button } from "../../Styled";
import toLocale from "../../toLocale";

const BuySold = ({price, id}) => {
    const stockInUser = useSelector(({user}) => user.user.stocks.find(stock => stock.id === +id)) || false;
    const {soldPrice, buyPrice} = useSelector(({settings}) => settings);

    return (
        <BuySoldContainer>
            <BuySoldItem>
                <h5>Покупка</h5>
                <span>{toLocale(buyPrice || price)}</span>
                <BuySoldButton to={`/buy/${id}`}>Купить</BuySoldButton>
            </BuySoldItem>
            <BuySoldItem>
                <h5>Продажа</h5>
                <span>{toLocale(soldPrice || price)}</span>
                {stockInUser &&  <BuySoldButton to={`/sold/${id}`}>Продать</BuySoldButton>}
                {!stockInUser && <Button disabled>Недоступно</Button>}
            </BuySoldItem>
        </BuySoldContainer>
    );
};

export default BuySold;
