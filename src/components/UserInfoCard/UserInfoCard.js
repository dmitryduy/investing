import React, { useEffect, useState } from 'react';
import { UserInfoCardContainer, UserInfoProfit } from "./UserInfoCard.styles";
import { useSelector } from "react-redux";
import LockSvg from "../LockSvg/LockSvg";
import toLocale from "../../toLocale";
import UserCardItem from "../UserCardItem/UserCardItem";
import round from "../../round";

const UserInfoCard = () => {

    const stockLoaded = useSelector(({stock}) => stock.loaded);
    const user = useSelector(({user}) => user.user);
    const stock = useSelector(({stock}) => stock.stockData);
    const [sign, setSign] = useState('');

    const totalStockPrice = stock && user.stocks.reduce((prev, userStock) => {
        const currentPrice = stock.find(stockItem => stockItem.id === userStock.id)?.price;
        return prev + (currentPrice || userStock.price) * userStock.amount;
    }, 0);


    useEffect(() => {
        console.log(444)
        if (stockLoaded) {
            if (round(user.startBalance) < round(user.balance + totalStockPrice)) {
                setSign('+')
            } else if (round(user.startBalance) > round(user.balance + totalStockPrice)) {
                setSign('-')
            } else {
                setSign('');
            }
        }

    }, [user, stock, totalStockPrice]);

    console.log(totalStockPrice, user.balance, user.startBalance)

    return (
        <UserInfoCardContainer>
            <UserCardItem title='Стоимость портфеля в долларах'>
                <p>{toLocale(user.balance + totalStockPrice)}</p>
            </UserCardItem>
            <UserCardItem title='За все время'>
                <UserInfoProfit className={sign === '+' ? 'positive' : sign === '-' ? 'negative' : ''}>
                    {sign}
                    {toLocale(user.startBalance - user.balance - totalStockPrice)}
                    ({sign}
                    {toLocale((user.startBalance - user.balance - totalStockPrice) / user.startBalance, true)})
                </UserInfoProfit>
            </UserCardItem>
            <UserCardItem title='Имя'>
                <p>{user.name}</p>
            </UserCardItem>
            <UserCardItem title='Осталось денег'>
                <p>{toLocale(user.balance)}{user.frozenBalance ?
                    <span>
                        (<LockSvg color='#fff' fontSize={14}/> {toLocale(user.frozenBalance)})
                    </span> : ''}</p>
            </UserCardItem>
        </UserInfoCardContainer>
    );
};

export default UserInfoCard;
