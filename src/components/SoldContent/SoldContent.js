import React, { useState } from 'react';
import { LastOrder, SoldBuyInfo, SoldContentContainer, StockName } from "./SoldContent.styles";
import socket from "../../sockets";

const SoldContent = ({id, name,  img,  ticker, lastOrder}) => {
    const [amount, setAmount] = useState(0);
    const [price, setPrice] = useState(lastOrder);

    const changePrice = (event) => {
        setPrice(event.target.value);
    }

    const changeAmount = (event) => {
        setAmount(event.target.value);
    }

    const sold = () => {
        if (amount <= 0 && price <=0) {
            return;
        }
       socket.emit('sold', {id, price, amount})
    }

    return (
        <SoldContentContainer>
            <SoldBuyInfo>
                <img src={img}/>
                <StockName>
                    <span className='ticker'>{ticker}</span>
                    <span className='name'>{name}</span>
                </StockName>
                <LastOrder>
                    <span>Последняя сделка</span>
                    <span className='last-order'>{lastOrder} $</span>
                </LastOrder>
            </SoldBuyInfo>
            <input type="number" value={price} onInput={changePrice}/>
            <input type="number" value={amount} onInput={changeAmount}/>
            <button onClick={sold}>send</button>
        </SoldContentContainer>
    );
};

export default SoldContent;
