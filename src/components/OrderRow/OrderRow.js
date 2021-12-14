import React from 'react';
import { LeftSide, OrderInfo, OrderRowContainer, OrderTop, OrderTotalPrice } from "./OrderRow.styles";
import toLocale from "../../toLocale";

const OrderRow = ({price, stockName, amount, type, totalAmount}) => {
    return (
        <>
            <OrderTop>{type === 'buy' ? 'Покупка(Ожидание)' : 'Продажа(Ожидание)'}</OrderTop>
            <OrderRowContainer>
                <LeftSide>
                    <span>Брокерский счет, $</span>
                    <OrderInfo>
                        {type === 'buy' ? 'Покупка ' : 'Продажа '}
                        {amount}{totalAmount !== amount && `/${totalAmount}`} акций {stockName}
                    </OrderInfo>
                </LeftSide>
                <OrderTotalPrice className={type}>
                    {type === 'buy' ? '-' : '+'}
                    {toLocale(price * amount)}
                </OrderTotalPrice>
            </OrderRowContainer>
        </>
    );
};

export default OrderRow;
