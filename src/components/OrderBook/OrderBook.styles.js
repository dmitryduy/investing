import styled from "styled-components";

export const OrderBookContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 3;
  border: 1px solid #e7e8ea;
  border-radius: 6px;
  height: 300px;
  cursor: pointer;
`;

export const OrderBookHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e7e8ea;
  padding: 10px;
  span {
    font-size: 13px;
  }

  .buy {
    color: #178d22;
  }

  .sold {
    color: #c40b08;
  }
`;

export const OrderBookItem = styled.div`
  height: 34px;
  display: flex;
  align-items: center;
  margin: 1px 0;
  position: relative;
  &:last-child {
    margin-bottom: 0;
  }
  
  .amount {
    position: absolute;
    font-size: 13px;
  }
  .price {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    font-size: 13px;
  }
  &.buy {
    .progress {
      border-radius: 0 10px 10px 0;
      background-color: rgba(57,181,74,.08);
      width: ${props => props.progressWidth}%;
      height: 100%;
      transition: 1s;
    }
    .amount {
      left: 6px;
      color: #178d22;
    }
  }
  &.sold {
    transform: rotateZ(180deg);
    .progress {
      border-radius:  0 10px 10px 0;
      background-color: rgba(224,31,25,.08);;
      width: ${props => props.progressWidth}%;
      height: 100%;
    }
    .amount {
      right: 6px;
      color: #c40b08;
      transform: rotateZ(180deg);
    }
    .price {
      transform: rotateZ(180deg) translateX(50%);
    }
  }
`;