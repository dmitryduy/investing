import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import socket from "../../sockets";
import {
    Hint,
    LastOrder,
    SoldBuyInfo,
    SoldContainer,
    SoldContentContainer,
    StockName
} from "../SoldContent/SoldContent.styles";
import { Button, Input } from "../../Styled";

const BuyContent = ({id, name, img, ticker, lastOrder, maxBuyPrice}) => {
    const [amount, setAmount] = useState(1);
    const [price, setPrice] = useState(lastOrder);
    const chooseBuyPrice = useSelector(({settings}) => settings.buyPrice);
    const [soldPriceAnimation, setSoldPriceAnimation] = useState(false);
    const [amountAnimation, setAmountAnimation] = useState(false);
    const [maxAmountAnimation, setMaxAmountAnimation] = useState(false);
    const [minPriceAnimation, setMinPriceAnimation] = useState(false);
    const {name: userName, frozenBalance, balance} = useSelector(({user}) => user.user);

    const changePrice = (event) => {
        const regex = /^[1-9]\d{0,9}(\.\d{0,2})?$/;
        if (event.target.value === '' || regex.test(event.target.value)){
            setPrice(event.target.value);
        }
    }

    const changeAmount = (event) => {
        const regex = /^[1-9]\d{0,10}$/;
        if (event.target.value === '' || regex.test(event.target.value)) {
            setAmount(event.target.value);
        }
    }

    const sold = () => {
        if (!amount) {
            setAmountAnimation(true);
            return;
        }
        if ((balance - frozenBalance)/ price < amount) {
            setMaxAmountAnimation(true);
            return;
        }
        if (price > maxBuyPrice) {
            setMinPriceAnimation(true);
            return;
        }
        socket.emit('buy', {id, price, amount, userName});
    }

    useEffect(() => {
        if (amountAnimation) {
            setTimeout(() => setAmountAnimation(false), 200);
        }
    }, [amountAnimation]);

    useEffect(() => {
        if (maxAmountAnimation) {
            setTimeout(() => setMaxAmountAnimation(false), 1000);
        }
    }, [maxAmountAnimation]);
    useEffect(() => {
        if (minPriceAnimation) {
            setTimeout(() => setMinPriceAnimation(false), 1000);
        }
    }, [minPriceAnimation]);
    useEffect(() => {
        if (chooseBuyPrice)
            setPrice(chooseBuyPrice);
        setSoldPriceAnimation(true);
        setTimeout(() => setSoldPriceAnimation(false), 200);
    }, [chooseBuyPrice]);


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
            <SoldContainer>
                <div>
                    <Input hint='Цена покупки'>
                        <input type="text" value={price} onInput={changePrice} className={soldPriceAnimation && 'animate-price'}/>
                        <Hint className={minPriceAnimation && 'animate'}>Максимальная цена покупки: {maxBuyPrice} $</Hint>
                        <br/>
                    </Input>

                </div>
                <div>
                    <Input hint='Количество лотов'>
                        <input type="text" value={amount} onInput={changeAmount} className={amountAnimation && 'animate-amount'}/>
                    </Input>
                    <Hint className={maxAmountAnimation && 'animate'}>Количество лотов на покупку:
                        {' ' + Math.floor((balance - frozenBalance)/ price) }</Hint>
                </div>
                <Button onClick={sold}>Купить за: {(price * amount).toLocaleString('Ru-ru',
                    {
                        style: 'currency', currency: 'USD'
                    }
                )}</Button>
            </SoldContainer>

        </SoldContentContainer>
    );
};

export default BuyContent;
