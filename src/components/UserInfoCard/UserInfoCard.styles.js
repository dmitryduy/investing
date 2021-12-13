import styled from "styled-components";

export const UserInfoCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  padding: 40px 30px;
  border-radius: 10px;
  background: linear-gradient(235deg,#404040,#000000);
  margin-bottom: 40px;
`;


export const UserInfoProfit = styled.p`
  color: #333;
  &.positive {
    color: #00a127;
  }

  &.negative {
    color: #e31c1c;
  }
`;