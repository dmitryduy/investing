import React, { useEffect } from 'react';
import UserNavbar from "../components/UserNavbar/UserNavbar";
import UserInfoCard from "../components/UserInfoCard/UserInfoCard";
import Stocks from "../components/Stocks/Stocks";
import useSocket from "../hooks/useSocket";
import { updateStockAC } from "../reducers/stockReducer";
import { useDispatch } from "react-redux";

const UserPage = () => {
    const updateStocksSocket = useSocket('update stocks');
    const dispatch = useDispatch();

    updateStocksSocket.on((changedStock) => {
        dispatch(updateStockAC(changedStock));
    })

    useEffect(() => {
        return () => {
            updateStocksSocket.off();
        };
    }, []);


    return (
        <>
            <UserNavbar active='review' title='Брокерский счет'/>
            <UserInfoCard/>
            <Stocks/>
        </>
    );
};

export default UserPage;
