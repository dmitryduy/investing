import React, { useEffect, useState } from 'react';
import { UserInfoCardContainer, UserInfoCardItem, UserInfoProfit } from "./UserInfoCard.styles";
import socket from "../../sockets";

const UserInfoCard = () => {

    const [userName, setUserName] = useState(0);
    const [userBalance, setUserBalance] = useState(0);
    const [startBalance, setStartBalance] = useState(0);
    const [sign, setSign] = useState('');

    socket.on('del', (price) => {
        setUserBalance(price);
        startBalance <= price ? setSign('+'): setSign('-');
    });
    useEffect(() => {
        fetch('http://localhost:5000/user/1')
            .then((response) => response.json())
            .then(data => {
                setUserBalance(data.balance);
                setUserName(data.name);
                setStartBalance(data.startBalance);
            });
    }, []);

    return (
        <UserInfoCardContainer>
            <UserInfoCardItem>
                <h6>Стоимость портфеля в долларах</h6>
                <p>{userBalance.toLocaleString('ru-RU')}$</p>
            </UserInfoCardItem>
            <UserInfoCardItem>
                <h6>За все время</h6>
                <UserInfoProfit className={sign === '+' ? 'positive': 'negative'}>
                    {sign}
                    {Math.abs(startBalance - userBalance).toLocaleString('ru-RU')}$
                    ({sign}{(Math.abs(startBalance - userBalance)/startBalance*100).toLocaleString('ru-RU')}%)
                </UserInfoProfit>
            </UserInfoCardItem>
            <UserInfoCardItem>
                <h6>Имя</h6>
                <p>{userName}</p>
            </UserInfoCardItem>
        </UserInfoCardContainer>
    );
};

export default UserInfoCard;
