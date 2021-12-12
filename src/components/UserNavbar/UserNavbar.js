import React from 'react';
import { Back, UserNavbarContainer, UserNavbarItem, UserNavbarMenu, UserNavbarTitle } from "./UserNavbar.styles";
import { useNavigate } from "react-router";


const UserNavbar = ({active, title}) => {
    const navigate = useNavigate();

    const pushBack = () => {
        navigate(-1);
    }

    return (
            <UserNavbarContainer>
                {active !== 'review'? <Back onClick={pushBack}>Вернуться назад</Back>: ''}
            <UserNavbarTitle>{title}</UserNavbarTitle>
            <UserNavbarMenu>
                <UserNavbarItem to='/' className={active === 'review' ? 'active': 'not-active'}>Обзор</UserNavbarItem>
                <UserNavbarItem to='/order' className={active === 'order' ? 'active': 'not-active'}>Заявки</UserNavbarItem>
                <UserNavbarItem to='/catalog' className={active === 'catalog'? 'active': 'not-active'}>Каталог</UserNavbarItem>
            </UserNavbarMenu>
        </UserNavbarContainer>
    );
};

export default UserNavbar;
