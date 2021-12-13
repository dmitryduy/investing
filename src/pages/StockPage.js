import React, { useEffect, useState } from 'react';
import { useParams } from "react-router";
import StockPageMain from "../components/StockPageMain/StockPageMain";
import BuySold from "../components/BuySold/BuySold";
import { useDispatch } from "react-redux";
import { changeBuyPriceAC, changeSoldPriceAC } from "../reducers/settingsReducer";
import UserNavbar from "../components/UserNavbar/UserNavbar";


const StockPage = () => {
    const {id} = useParams();
    const [stock, setStock] = useState(null);
    const dispatch = useDispatch();
    console.log(stock)
    useEffect(() => {
        fetch(`http://localhost:5000/stock/${id}`)
            .then(response => response.json())
            .then(data => {
                setStock(data);
                dispatch(changeBuyPriceAC(data.orderBook.buy[0]?.price));
                dispatch(changeSoldPriceAC(data.orderBook.sold[data.orderBook.sold.length - 1]?.price))
            });
    }, []);

    return (
        <>
            {stock &&
            <>
                <UserNavbar title={stock?.name}/>
                <div style={{display: 'flex'}}>
                    <StockPageMain stock={stock}/>
                    <BuySold id={id} price={stock.price}/>
                </div>
            </>
            }
        </>
    );
};

export default StockPage;
