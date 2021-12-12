import './App.css';
import User from "./pages/user";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import StockPage from "./pages/StockPage";
import SoldPage from "./pages/SoldPage";
import BuyPage from "./pages/BuyPage";
import Catalog from "./pages/Catalog";
import OrderPage from "./pages/OrderPage";
import LoginPage from "./pages/LoginPage";
import socket from "./sockets";
import { fetchUserAC } from "./reducers/userReducer";
import { useEffect } from "react";

const Container = styled.div`
  width: 70%;
  margin: 100px auto 0;

`;

function App() {
    const userId = useSelector(({user}) => user.user?.id);
    const dispatch = useDispatch();

    socket.on('newBalance', (data => {
        console.log(data)
        if (data.id === userId)
            dispatch(fetchUserAC(data));
    }));

    useEffect(() => {
        return () => {
            socket.off('newBalance');
        };
    }, []);

    return (

        <BrowserRouter>
            {userId ?
                <>
                    <Container>
                        <Routes>
                            <Route exact path='/' element={<User/>}/>
                            <Route path='/stocks/:id' element={<StockPage/>}/>
                            <Route path='/sold/:id' element={<SoldPage/>}/>
                            <Route path='/buy/:id' element={<BuyPage/>}/>
                            <Route path='/catalog/' element={<Catalog/>}/>
                            <Route path='/order/' element={<OrderPage/>}/>
                        </Routes>
                    </Container>
                </>
                :
                <>
                    <Routes>
                        <Route path='/login' element={<LoginPage/>}/>
                        <Route path='*' element={<Navigate to='/login'/>}/>
                    </Routes>
                </>
            }

        </BrowserRouter>
    );
}

export default App;
