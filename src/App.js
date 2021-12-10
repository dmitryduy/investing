import './App.css';
import User from "./pages/user";
import styled from "styled-components";
import { Provider } from "react-redux";
import store from "./store/store";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import StockPage from "./pages/StockPage";
import SoldPage from "./pages/SoldPage";

const Container = styled.div`
  width: 70%;
  margin: 100px auto 0;
  
`;

function App() {
  return (
          <Provider store={store}>
              <BrowserRouter>
              <Container>
                  <Routes>
                      <Route exact path='/' element={<User/>}/>
                      <Route path='/stocks/:id' element={<StockPage/>}/>
                      <Route path='/sold/:id' element={<SoldPage/>}/>
                  </Routes>
              </Container>
              </BrowserRouter>
          </Provider>
  );
}

export default App;
