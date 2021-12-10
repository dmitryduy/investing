import React, { useEffect, useState } from 'react';
import { UserInfoCardContainer, UserInfoCardItem, UserInfoProfit } from "./UserInfoCard.styles";
import socket from "../../sockets";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../reducers/userReducer";

const UserInfoCard = () => {

    const [userName, setUserName] = useState(0);
    const [userBalance, setUserBalance] = useState(0);
    const [startBalance, setStartBalance] = useState(0);
    const loaded = useSelector(({user}) => user.loaded);
    const user = useSelector(({user}) => user.user);
    const dispatch = useDispatch();

    const [sign, setSign] = useState('');

    socket.on('del', (price) => {
        setUserBalance(price);
        startBalance <= price ? setSign('+') : setSign('-');
    });
    useEffect(() => {
        dispatch(fetchUser('Alex'));
    }, []);

    useEffect(() => {
        if (loaded) {
            setUserName(user.name);
            setStartBalance(user.startBalance);
            setUserBalance(user.balance);
        }
    }, [loaded]);

    return (
        loaded ?
        <UserInfoCardContainer>
            <UserInfoCardItem>
                <h6>Стоимость портфеля в долларах</h6>
                <p>{userBalance.toLocaleString('ru-RU')}$</p>
            </UserInfoCardItem>
            <UserInfoCardItem>
                <h6>За все время</h6>
                <UserInfoProfit className={sign === '+' ? 'positive' : 'negative'}>
                    {sign}
                    {Math.abs(startBalance - userBalance).toLocaleString('ru-RU')}$
                    ({sign}{(Math.abs(startBalance - userBalance) / startBalance * 100).toLocaleString('ru-RU')}%)
                </UserInfoProfit>
            </UserInfoCardItem>
            <UserInfoCardItem>
                <h6>Имя</h6>
                <p>{userName}</p>
            </UserInfoCardItem>
        </UserInfoCardContainer>
        :
            <p>Loading...</p>

    );
};

export default UserInfoCard;
