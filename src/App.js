import './App.css';
import User from "./pages/user";
import styled from "styled-components";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StockPage from "./pages/StockPage";
import SoldPage from "./pages/SoldPage";
import { fetchUser, fetchUserAC } from "./reducers/userReducer";
import socket from "./sockets";
import { useEffect } from "react";

const Container = styled.div`
  width: 70%;
  margin: 100px auto 0;

`;

function App() {
    const dispatch = useDispatch();
    const userId = useSelector(({user}) => user.user?.id);
    socket.on('newBalance', (data => {
        console.log(data, userId)
        if (data.id === userId)
            dispatch(fetchUserAC(data));
    }));

    useEffect(() => {
        dispatch(fetchUser('Alex'));
        return () => {
            socket.off('newBalance');
        };
    }, []);

    return (

        <BrowserRouter>
            <Container>
                <Routes>
                    <Route exact path='/' element={<User/>}/>
                    <Route path='/stocks/:id' element={<StockPage/>}/>
                    <Route path='/sold/:id' element={<SoldPage/>}/>
                </Routes>
            </Container>
        </BrowserRouter>
    );
}

export default App;
