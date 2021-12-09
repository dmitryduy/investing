import styled from "styled-components";

export const UserInfoCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  padding: 40px 30px;
  border-radius: 10px;
  background: linear-gradient(45deg, rgb(77, 77, 81) 5%, rgb(57, 57, 65));
  margin-bottom: 40px;
`;

export const UserInfoCardItem = styled.div`

  h6 {
    color: hsla(0, 0%, 100%, .72);
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 5px;
  }

  p {
    color: #fff;
    font-size: 18px;
    letter-spacing: 1px;
  }
`;

export const UserInfoProfit = styled.p`
  &.positive {
    color: #00a127;
  }

  &.negative {
    color: #e31c1c;
  }
`;