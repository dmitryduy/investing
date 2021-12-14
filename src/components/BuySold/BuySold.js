import React from 'react';
import { BuySoldButton, BuySoldContainer, BuySoldItem } from "./BuySold.styles";
import { useSelector } from "react-redux";
import { Button } from "../../Styled";
import toLocale from "../../toLocale";

const BuySold = ({price, id}) => {
    const stockInUser = useSelector(({user}) => user.user.stocks.find(stock => stock.id === +id)) || false;
    const {soldPrice, buyPrice, start} = useSelector(({settings}) => settings);

    return (
        <BuySoldContainer>
            <BuySoldItem>
                <h5>Покупка</h5>
                <span>{toLocale(buyPrice || price)}</span>
                {start && <BuySoldButton to={`/buy/${id}`}>Купить</BuySoldButton>}
                {!start && <Button disabled>Недоступно</Button>}
            </BuySoldItem>
            <BuySoldItem>
                <h5>Продажа</h5>
                <span>{toLocale(soldPrice || price)}</span>
                {start && stockInUser &&  <BuySoldButton to={`/sold/${id}`}>Продать</BuySoldButton>}
                {(!stockInUser || !start) && <Button disabled>Недоступно</Button>}
            </BuySoldItem>
        </BuySoldContainer>
    );
};

export default BuySold;
