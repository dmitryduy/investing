import React, { useEffect } from 'react';
import { SoldContainer, SoldContentContainer } from "./SoldContent.styles";
import { useSelector } from "react-redux";
import { Button } from "../../Styled";
import useInput from "../../hooks/useInput";
import useAnimation from "../../hooks/useAnimation";
import toLocale from "../../toLocale";
import useSocket from "../../hooks/useSocket";
import SoldBuyStockInfo from "../SoldBuyStockInfo/SoldBuyStockInfo";
import SoldBuyInput from "../SoldBuyInput/SoldBuyInput";


const SoldContent = ({id, name, img, ticker, lastOrder, minSoldPrice}) => {
    const [amount, setAmount] = useInput(1, /^\d{0,10}$/);
    const [price, setPrice] = useInput(lastOrder, /^\d{0,10}(\.\d{0,2})?$/);

    const soldSocket = useSocket('sold');

    const chooseSoldPrice = useSelector(({settings}) => settings.soldPrice);

    const [isIncorrectPrice, setIncorrectPriceAnimation] = useAnimation(200);
    const [isIncorrectAmount, setIncorrectAmountAnimation] = useAnimation(200);


    const stockAmount = useSelector(({user}) => user.user.stocks.find(stock => stock.id === +id))?.amount || 0;
    const frozenAmount = useSelector(({user}) => user.user.stocks.find(stock => stock.id === +id))?.frozenAmount || 0;
    const userName = useSelector(({user}) => user.user.name);


    const sold = () => {
        if (+amount === 0 || stockAmount - frozenAmount < +amount) {
            setIncorrectAmountAnimation();
            return;
        }
        if (+price < minSoldPrice) {
            setIncorrectPriceAnimation();
            return;
        }
        soldSocket.emit({stockId: +id, soldByPrice: +price, amount: +amount, sellerName: userName});
    }

    useEffect(() => {
        if (chooseSoldPrice) {
            setPrice(chooseSoldPrice, true);
        }
    }, [chooseSoldPrice]);


    return (
        <SoldContentContainer>
            <SoldBuyStockInfo ticker={ticker} img={img} name={name} id={id} lastOrder={lastOrder}/>
            <SoldContainer>
                <SoldBuyInput onInput={setPrice}
                              value={price}
                              hintText={`Минимальная цена продажи: ${toLocale(minSoldPrice)}`}
                              inputHintText='Цена продажи'
                              isAnimate={isIncorrectPrice}/>
                <SoldBuyInput onInput={setAmount}
                              value={amount}
                              hintText={`Количество лотов на продажу: ${stockAmount - frozenAmount}`}
                              inputHintText='Количество лотов'
                              isAnimate={isIncorrectAmount}/>
                <Button onClick={sold}>Продать за: {toLocale(price * amount)}</Button>
            </SoldContainer>
        </SoldContentContainer>
    );
};

export default SoldContent;
