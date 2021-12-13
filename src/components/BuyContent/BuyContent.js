import React, { useEffect } from 'react';
import { useSelector } from "react-redux";
import {
    SoldContainer,
    SoldContentContainer,
} from "../SoldContent/SoldContent.styles";
import { Button } from "../../Styled";
import SoldBuyStockInfo from "../SoldBuyStockInfo/SoldBuyStockInfo";
import toLocale from "../../toLocale";
import SoldBuyInput from "../SoldBuyInput/SoldBuyInput";
import useInput from "../../hooks/useInput";
import useSocket from "../../hooks/useSocket";
import useAnimation from "../../hooks/useAnimation";

const BuyContent = ({id, name, img, ticker, lastOrder, maxBuyPrice}) => {


    const [amount, setAmount] = useInput(1, /^\d{0,10}$/);
    const [price, setPrice] = useInput(lastOrder, /^\d{0,10}(\.\d{0,2})?$/);

    const buySocket = useSocket('buy');

    const chooseBuyPrice = useSelector(({settings}) => settings.buyPrice);

    const [isIncorrectPrice, setIncorrectPriceAnimation] = useAnimation(200);
    const [isIncorrectAmount, setIncorrectAmountAnimation] = useAnimation(200);

    const {name: userName, frozenBalance, balance} = useSelector(({user}) => user.user);

    const buy = () => {
        if (+amount === 0 || (balance - frozenBalance) / price < amount) {
            setIncorrectAmountAnimation();
            return;
        }
        if (price > maxBuyPrice) {
            setIncorrectPriceAnimation();
            return;
        }
        buySocket.emit({id, price, amount: +amount, userName});
    }

    useEffect(() => {
        if (chooseBuyPrice)
            setPrice(chooseBuyPrice, true);
    }, [chooseBuyPrice]);

    return (
        <SoldContentContainer>
            <SoldBuyStockInfo ticker={ticker} img={img} name={name} id={id} lastOrder={lastOrder}/>
            <SoldContainer>
                <SoldBuyInput onInput={setPrice}
                              value={price}
                              hintText={`Максимальная цена покупки: ${toLocale(maxBuyPrice)}`}
                              inputHintText='Цена покупки'
                              isAnimate={isIncorrectPrice}/>
                <SoldBuyInput onInput={setAmount}
                              value={amount}
                              hintText={`Количество лотов на покупку: ${Math.floor((balance - frozenBalance) / price)}`}
                              inputHintText='Количество лотов'
                              isAnimate={isIncorrectAmount}/>
                <Button onClick={buy}>Купить за: {toLocale(price * amount)}</Button>
            </SoldContainer>

        </SoldContentContainer>
    );
};

export default BuyContent;
