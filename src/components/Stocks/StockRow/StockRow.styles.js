import styled from "styled-components";

export const StockRowContainer = styled.div`
  display: flex;
  padding: 10px 40px;
  cursor: pointer;
  transition: .2s;
  border-bottom: 2px solid #dddfe0;
  &:hover {
    background-color: #f6f7f8;
  }
`;

export const StockName = styled.div`
  flex: 2;
  display: flex;
`;

export const StockTitle = styled.h4`
color: #333;
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 5px;
`;

export const StockTicker = styled.p`
  text-transform: uppercase;
  color: rgba(0,0,0,.54);
  font-size: 12px;
`;

export const StockImage = styled.img`
    width: 40px;
  margin-right: 10px;
  border-radius: 50%;
`;

export const StockPrice = styled.div`
  flex: 1;
  display: flex;
  
  svg {
    height: 20px;
    color: rgba(0,0,0,.54);
  }
  span.prev {
    color: rgba(0,0,0,.54);;
  }
  span.current {
    color: #000;
  }
`;

export const StockTotalPrice = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  span.price {
    color: #000;
  }
  span.amount {
    color: rgba(0,0,0,.54);
    font-size: 12px;
  }
`;

export const StockProfit = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  
  span.percent {
    font-size: 12px;
  }
  &.positive {
    color: #00a127;
  }

  &.negative {
    color: #e31c1c;
  }
`;