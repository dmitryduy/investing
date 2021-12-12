import React from 'react';
import { UserNavbarContainer, UserNavbarItem, UserNavbarMenu, UserNavbarTitle } from "./UserNavbar.styles";


const UserNavbar = ({active, title}) => {
    return (
        <UserNavbarContainer>
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
