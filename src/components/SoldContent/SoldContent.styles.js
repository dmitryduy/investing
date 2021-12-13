import styled from "styled-components";


export const SoldContentContainer = styled.div`
  flex: 5;
  margin-right: 20px;
`;

export const SoldContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 30px 60px;

  button {
    grid-column: 1/3;
  }

  input {
    margin-bottom: 5px;
    transition: .2s linear;
  }
`;
