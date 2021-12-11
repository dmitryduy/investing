import styled from "styled-components";

export const Input = styled.div`
  position: relative;
  &::before {
    position: absolute;
    content: '${props => props.hint}';
    z-index: 100;
    pointer-events: none;
    color: rgba(0,0,0,.54);
    font-size: 11px;
    letter-spacing: -.2px;
    top: 5px;
    left: 10px;
  }
  input {
    width: 100%;
    border-radius: 5px;
    color: rgba(0,0,0,.8);
    padding: 20px 10px 5px;
    font-size: 16px;
    border: 1px solid #e7e8ea;
    outline: none;
    transition: .2s;
    &:focus {
      background-color: #e7e8ea;
    }
  }
`;


export const Button = styled.button`
  background-color: #ffdd2d;
  border-radius: 5px;
  border: none;
  width: 100%;
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