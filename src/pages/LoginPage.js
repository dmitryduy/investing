import React, { useEffect, useState } from 'react';
import { fetchUser } from "../reducers/userReducer";
import { useDispatch, useSelector } from "react-redux";
import { Button, Input } from "../Styled";
import styled from "styled-components";
import { useNavigate } from "react-router";

const LoginTitle = styled.h1`
  font-size: 40px;
  color: #333;
  font-weight: 300;
  margin-bottom: 40px;
  text-align: center;
`;

const LoginSubTitle = styled.h3`
  font-size: 21px;
  color: #9299a2;
  font-weight: 400;
  margin-bottom: 50px;
  text-align: center;
`;

const LoginContent = styled.div`
  display: flex;
  margin-bottom: 5px;
  div {
    flex: 8;
    input {
      border-radius: 5px 0 0 5px;
      background-color: #e7e8ea;
      height: 100%;
    }
  }
  button {
    flex: 2;
    border-radius: 0 5px 5px 0;
    &:disabled {
      background-color: #ffdd2d;
      opacity: .6;
    }
  }
`;


const LoginPage = () => {
    const [name, setName] = useState('');
    const history = useNavigate();
    const error = useSelector(({user}) => user.error);

    const dispatch = useDispatch();

    const changeName = (e) => {
        setName(e.target.value);
    }

    const sendRequest = () => {
        dispatch(fetchUser(name));
    }

    useEffect(() => {
        return () => {
            history('/');
        }
    }, []);

    return (
        <div style={{ width: '40%', margin: '50px auto'}}>
           <LoginTitle>Вход в приложение</LoginTitle>
            <LoginSubTitle>Введите ваше имя</LoginSubTitle>
            <LoginContent>
                <Input hint='Имя'>
                    <input type="text" value={name} onInput={changeName}/>
                </Input>
                <Button onClick={sendRequest} disabled={!name}>Войти</Button>
            </LoginContent>
            {error && <span style={{color: '#f79494', fontSize: 14}}>Нет такого пользователя</span>}
        </div>
    );
};

export default LoginPage;
