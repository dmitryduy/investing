import './App.css';
import User from "./pages/user";
import styled from "styled-components";
import { Provider } from "react-redux";
import store from "./store/store";

const Container = styled.div`
  width: 70%;
  margin: 100px auto 0;
  
`;

function App() {
  return (
      <Provider store={store}>
          <Container>
              <User/>
          </Container>
      </Provider>
  );
}

export default App;
