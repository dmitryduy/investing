import styled from "styled-components";


export const SoldContentContainer = styled.div`
  flex: 5;
  margin-right: 20px; 
`;

export const SoldBuyInfo = styled.div`
  display: flex;
  height: 90px;
  padding: 20px;
  align-items: center;
  border: 1px solid #eaecee;
  border-radius: 10px;
  img {
    height: 100%;
    margin-right: 10px;
  }
`;

export const StockName = styled.div`
  display: flex;
  flex-direction: column;
  .ticker {
    font-size: 13px;
    color: rgba(0,0,0,.54);
    margin-bottom: 5px;
  }
  .name {
    font-size: 15px;
  }
`;

export const LastOrder = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;
  
  span:first-child {
    font-size: 13px;
    color: rgba(0,0,0,.54);
    margin-bottom: 5px;
  }
  .last-order {
    font-size: 20px;
  }
`;