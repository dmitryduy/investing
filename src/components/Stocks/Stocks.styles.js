import styled from "styled-components";


export const StocksContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #dddfe0;
  .header {
    display: flex;
    font-weight: 500;
    color: rgba(0, 0, 0, .8);
    border-bottom: 2px solid #dddfe0;
    padding: 20px 40px;
    li:first-child {
      flex: 2;
    }
    li:nth-child(2)  {
      flex: 1;
    }
    li:nth-child(3) {
      flex: 1;
    }
    li:last-child {
      flex: 1;
    }
  }
`;

export const StocksTitle = styled.h2`
  margin-bottom: 20px;
  color: rgba(0, 0, 0, .8);
  font-weight: 400;
`;

