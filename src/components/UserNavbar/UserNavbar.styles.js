import styled from "styled-components";

export const UserNavbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 2px solid #dddfe0;
  align-items: center;
  margin-bottom: 40px;
`;

export const UserNavbarTitle = styled.h2`
  font-weight: 400;
  letter-spacing: 1px;
  font-size: 30px;
`;

export const UserNavbarMenu = styled.nav`
  display: flex;
`;

export const UserNavbarItem = styled.li`
  margin-left: 20px;
  color: rgba(0,0,0,.54);
  font-weight: 400;
  padding-bottom: 12px;
  transform: translateY(12px);
  border-bottom: 3px solid transparent;
  cursor: pointer;
  transition: color .4s;
  &.active {
    border-bottom: 3px solid #666;
    color: rgba(0,0,0,.8);
  }
  &.not-active:hover {
    color: rgba(0,0,0,.8);
    border-bottom: 3px solid #dddfe0;
  }
`;