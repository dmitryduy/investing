import styled from "styled-components";
import { Link } from "react-router-dom";


export const BuySoldContainer = styled.div`
  display: flex;
  flex: 1;
  border: 1px solid #e7e8ea;
  padding: 24px 20px 20px;
  height: 180px;
  border-radius: 10px;
`;

export const BuySoldItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  h5 {
    font-size: 13px;
    color:rgba(0,0,0,.54);
    font-weight: 400;
    margin-bottom: 10px;
  }
  span {
    color: #333;
    font-weight: 700;
    font-size: 20px;
    margin-bottom: 40px;
  }
`;

export const BuySoldButton = styled(Link)`
  background-color: #ffdd2d;
  border-radius: 5px;
  border: none;
  padding: 15px 23px;
  text-align: center;
  font-size: 15px;
  margin-right: 5px;
  cursor: pointer;
  transition: .3s;
  color: #000;
  &:hover {
    background-color: #fcc521;
  }
`;