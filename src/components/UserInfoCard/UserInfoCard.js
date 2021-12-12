import React, { useEffect, useState } from 'react';
import { UserInfoCardContainer, UserInfoCardItem, UserInfoProfit } from "./UserInfoCard.styles";
import { useSelector } from "react-redux";
import LockSvg from "../LockSvg/LockSvg";

const UserInfoCard = () => {

    const loaded = useSelector(({user}) => user.loaded);
    const stockLoaded = useSelector(({stock}) => stock.loaded);
    const user = useSelector(({user}) => user.user);
    const stock = useSelector(({stock}) => stock.stockData);
    const totalStockPrice = stock && user.stocks.reduce((prev, userStock) => {
        const currentPrice = stock.find(stockItem => stockItem.id === userStock.id)?.price;
        return prev + (currentPrice || userStock.price) * userStock.amount;
    }, 0);

    const [sign, setSign] = useState('');

    useEffect(() => {
        if (stockLoaded) {
            console.log(user.startBalance, user.balance + totalStockPrice, totalStockPrice, user.balance)
            if (Math.floor(user.startBalance*100)/100 < Math.floor((user.balance + totalStockPrice) * 100) / 100) {
                setSign('+')
            }
            else if (Math.floor(user.startBalance*100)/100 > Math.floor((user.balance + totalStockPrice) * 100) / 100) {
                setSign('-')
            }
            else {
                setSign('');
            }
        }

    },[user]);


    return (
        loaded ?
        <UserInfoCardContainer>
            <UserInfoCardItem>
                <h6>Стоимость портфеля в долларах</h6>
                <p>{(user.balance + totalStockPrice).toLocaleString('ru-RU')}$</p>
            </UserInfoCardItem>
            <UserInfoCardItem>
                <h6>За все время</h6>
                <UserInfoProfit className={sign === '+' ? 'positive': sign === '-'? 'negative': '' }>
                    {sign}
                    {Math.abs(user.startBalance - user.balance - totalStockPrice).toLocaleString('ru-RU')}$
                    ({sign}{(Math.abs(user.startBalance - user.balance - totalStockPrice) / user.startBalance * 100).toLocaleString('ru-RU')}%)
                </UserInfoProfit>
            </UserInfoCardItem>
            <UserInfoCardItem>
                <h6>Имя</h6>
                <p>{user.name}</p>
            </UserInfoCardItem>
            <UserInfoCardItem>
                <h6>Осталось денег:</h6>
                <p>{user.balance.toLocaleString('RU-ru')}${user.frozenBalance ? <span>
                    (<LockSvg color='#fff' fontSize={14}/> {user.frozenBalance.toLocaleString('RU-ru')} $)
                </span>: ''}</p>
            </UserInfoCardItem>
        </UserInfoCardContainer>
        :
            <p>Loading...</p>

    );
};

export default UserInfoCard;
