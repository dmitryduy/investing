import React from 'react';
import { UserInfoCardItem } from "./UserCardItem.styles";

const UserCardItem = ({title, children}) => {
    return (
        <UserInfoCardItem>
            <h6>{title}</h6>
            {children}
        </UserInfoCardItem>
    );
};

export default UserCardItem;
