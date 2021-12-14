import './App.css';
import UserPage from "./pages/UserPage";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import StockPage from "./pages/StockPage";
import SoldPage from "./pages/SoldPage";
import BuyPage from "./pages/BuyPage";
import Catalog from "./pages/Catalog";
import OrderPage from "./pages/OrderPage";
import LoginPage from "./pages/LoginPage";
import { fetchUserAC } from "./reducers/userReducer";
import { useEffect } from "react";
import useSocket from "./hooks/useSocket";
import AdminPage from "./pages/AdminPage";
import { setStart } from "./reducers/settingsReducer";

const Container = styled.div`
  width: 70%;
  margin: 100px auto 100px;

`;

function App() {
    const userId = useSelector(({user}) => user.user?.id);
    const dispatch = useDispatch();
    const changeUserData = useSocket('newBalance');
    const startSocket = useSocket('start');

    changeUserData.on(user => {
        if (user.id === userId)
            dispatch(fetchUserAC(user));
    })
    startSocket.on(() => {
        dispatch(setStart());
    })

    useEffect(() => {
        return () => {
            changeUserData.off();
            startSocket.off();
        };
    }, []);

    return (
        <BrowserRouter>
            {userId ?
                <>
                    <Container>
                        <Routes>
                            <Route exact path='/' element={<UserPage/>}/>
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
                        <Route path='/admin' element={<AdminPage/>}/>
                        <Route path='*' element={<Navigate to='/login'/>}/>
                    </Routes>
                </>
            }
        </BrowserRouter>
    );
}

export default App;
