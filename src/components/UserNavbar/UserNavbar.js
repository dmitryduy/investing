import React from 'react';
import { UserNavbarContainer, UserNavbarItem, UserNavbarMenu, UserNavbarTitle } from "./UserNavbar.styles";


const UserNavbar = () => {
    return (
        <UserNavbarContainer>
            <UserNavbarTitle>Брокерский счет</UserNavbarTitle>
            <UserNavbarMenu>
                <UserNavbarItem className='active'>Обзор</UserNavbarItem>
                <UserNavbarItem className='not-active'>Заявки</UserNavbarItem>
                <UserNavbarItem className='not-active'>Стакан</UserNavbarItem>
            </UserNavbarMenu>
        </UserNavbarContainer>
    );
};

export default UserNavbar;
