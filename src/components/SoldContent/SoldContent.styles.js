import styled from "styled-components";
import { Link } from "react-router-dom";


export const SoldContentContainer = styled.div`
  flex: 5;
  margin-right: 20px;
`;

export const SoldBuyInfo = styled(Link)`
  display: flex;
  height: 90px;
  padding: 20px;
  align-items: center;
  border: 1px solid #eaecee;
  border-radius: 10px;
  margin-bottom: 40px;

  img {
    height: 100%;
    margin-right: 10px;
    border-radius: 50%;
  }
`;

export const StockName = styled.div`
  display: flex;
  flex-direction: column;

  .ticker {
    font-size: 13px;
    color: rgba(0, 0, 0, .54);
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
    color: rgba(0, 0, 0, .54);
    margin-bottom: 5px;
  }

  .last-order {
    font-size: 20px;
  }
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

    &.animate-price {
      background-color: #e7e8ea;
    }

    &.animate-amount {
      background-color: #c40b08;
      opacity: .5;
    }
  }
`;


export const Hint = styled.span`
  color: rgba(0, 0, 0, .54);
  font-size: 11px;
  letter-spacing: -.2px;
  margin-left: 10px;
  transition: .2s;

  &.animate {
    color: #c40b08;
  }
`;