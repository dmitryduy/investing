import styled from "styled-components";

export const AboutStock = styled.div`
  margin-bottom: 20px;

  h3 {
    font-weight: 700;
    font-size: 20px;
    color: rgba(0, 0, 0, .8);
    margin-bottom: 30px;
  }

  p {
    font-size: 15px;
    line-height: 24px;
  }
`;

export const StockCardWidget = styled.div`
  margin-bottom: 20px;

  h4 {
    color: rgba(0, 0, 0, .54);
    font-size: 13px;
    margin-bottom: 8px;
  }
`;

export const StockCardWidgetContent = styled.div`
  display: flex;

  img {
    width: 32px;
    border-radius: 50%;
    margin-right: 8px;
  }

  span {
    color: rgba(0, 0, 0, .8);
    align-self: center;
  }
`;