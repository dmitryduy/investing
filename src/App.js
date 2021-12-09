import './App.css';
import User from "./pages/user";
import styled from "styled-components";

const Container = styled.div`
  width: 70%;
  margin: 100px auto 0;
  
`;

function App() {
  return (
    <Container>
      <User/>
    </Container>
  );
}

export default App;
