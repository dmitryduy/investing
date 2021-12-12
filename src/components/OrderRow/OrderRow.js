import React, { useEffect } from 'react';
import {  LeftSide, OrderInfo, OrderRowContainer, OrderTop, OrderTotalPrice } from "./OrderRow.styles";
import socket from "../../sockets";

const OrderRow = ({price, stockName, amount, type, totalAmount, id}) => {



    return (
        <>
            <OrderTop>{type === 'buy' ? 'Покупка(Ожидание)' : 'Продажа(Ожидание)'}
                </OrderTop>
            <OrderRowContainer>
                <LeftSide>
                    <span>Брокерский счет, $</span>
                    <OrderInfo>
                        {type === 'buy' ? 'Покупка' : 'Продажа'} {amount}{totalAmount !== amount && `/${totalAmount}`} акций {stockName}
                    </OrderInfo>
                </LeftSide>
                <OrderTotalPrice className={type}>{type === 'buy' ? '-' : '+'}{(price * amount).toLocaleString('RU-ru')} $</OrderTotalPrice>
            </OrderRowContainer>
        </>
    );
};

export default OrderRow;
