import styled from "styled-components";

export const OrderTop = styled.div`
  color: rgba(0,0,0,.48);
  background-color: #f5f5f6;
  padding: 10px;
  font-size: 13px;
  border-radius: 10px 10px 0 0 ;
  position: relative;
`;


export const OrderRowContainer = styled.div`
  display: flex;
  padding: 20px 10px;
`;

export const LeftSide = styled.div`
flex: 1;
  span {
    font-size: 13px;
    color: rgba(0,0,0,.54);
    margin-bottom: 5px;
  }
`;

export const OrderInfo= styled.p`
  font-size: 15px;
  color: #333;
`;

export const OrderTotalPrice= styled.span`
  color: #333;
  &.sold {
    color: #36a761;
  }
`;