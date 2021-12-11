import React from 'react';
import UserNavbar from "../components/UserNavbar/UserNavbar";
import UserInfoCard from "../components/UserInfoCard/UserInfoCard";
import Stocks from "../components/Stocks/Stocks";

const User = () => {
    return (
        <>
            <UserNavbar active='review'/>
            <UserInfoCard/>
            <Stocks/>
        </>
    );
};

export default User;
