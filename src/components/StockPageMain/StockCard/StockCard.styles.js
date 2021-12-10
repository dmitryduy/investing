import styled from "styled-components";

export const StockCardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  color: #fff;
  background: linear-gradient(235deg,#404040,#000000);
  padding: 20px 40px 20px 20px;
  min-height: 180px;
  max-height: 200px;
  border-radius: 10px;
  margin-bottom: 50px;
`;

export const StockCardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const StockCardName = styled.div`
  display: flex;
  h3 {
    font-weight: 700;
    font-size: 20px;
    margin-right: 5px;
  }
  span {
    letter-spacing: 1px;
    opacity: .54;
    font-weight: 700;
    font-size: 14px;
  }
`;

export const StockCardSector = styled.div`
  h4 {
    opacity: .54;
    font-weight: 300;
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  span {
    font-weight: 700;
    font-size: 20px;
  }
`;

export const StockCardImage = styled.img`
  height: 100px;
  border-radius: 50%;
  margin: auto 0;
`;