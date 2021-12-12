import React, { useEffect, useState } from 'react';
import { Hint, LastOrder, SoldBuyInfo, SoldContainer, SoldContentContainer, StockName } from "./SoldContent.styles";
import socket from "../../sockets";
import { useSelector } from "react-redux";
import { Button, Input } from "../../Styled";


const SoldContent = ({id, name, img, ticker, lastOrder, minSoldPrice}) => {
    const [amount, setAmount] = useState(1);
    const [price, setPrice] = useState(lastOrder);
    const chooseSoldPrice = useSelector(({settings}) => settings.soldPrice);
    const [soldPriceAnimation, setSoldPriceAnimation] = useState(false);
    const [amountAnimation, setAmountAnimation] = useState(false);
    const [maxAmountAnimation, setMaxAmountAnimation] = useState(false);
    const [minPriceAnimation, setMinPriceAnimation] = useState(false);

    const stockAmount = useSelector(({user}) => user.user.stocks.find(stock => stock.id === +id))?.amount || 0;
    const frozenAmount = useSelector(({user}) => user.user.stocks.find(stock => stock.id === +id))?.frozenAmount || 0;
    const userName = useSelector(({user}) => user.user.name);

    const changePrice = (event) => {
        const regex = /^\d{0,10}(\.\d{0,2})?$/;
        if ( regex.test(event.target.value)){
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
        if (stockAmount - frozenAmount < amount) {
            setMaxAmountAnimation(true);
            return;
        }
        if (price < minSoldPrice) {
            setMinPriceAnimation(true);
            return;
        }
        console.log(price, lastOrder)
        socket.emit('sold', {id, price, amount, userName});
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
        if (chooseSoldPrice)
            setPrice(chooseSoldPrice);
        setSoldPriceAnimation(true);
        setTimeout(() => setSoldPriceAnimation(false), 200);
    }, [chooseSoldPrice]);


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
                    <Input hint='Цена продажи'>
                        <input type="text" value={price} onInput={changePrice} className={soldPriceAnimation && 'animate-price'}/>
                        <Hint className={minPriceAnimation && 'animate'}>Минимальная цена продажи: {minSoldPrice} $</Hint>
                        <br/>
                    </Input>

                </div>
                <div>
                    <Input hint='Количество лотов'>
                        <input type="text" value={amount} onInput={changeAmount} className={amountAnimation && 'animate-amount'}/>
                    </Input>
                    <Hint className={maxAmountAnimation && 'animate'}>Количество лотов на продажу: {stockAmount - frozenAmount}</Hint>
                </div>
                <Button onClick={sold}>Продать за: {(price * amount).toLocaleString('Ru-ru',
                    {
                        style: 'currency', currency: 'USD'
                    }
                )}</Button>
            </SoldContainer>

        </SoldContentContainer>
    );
};

export default SoldContent;
