import React, { useEffect, useState } from 'react';
import useSocket from "../hooks/useSocket";
import User from "../components/User/User";
import { Button } from "../Styled";
import styled from "styled-components";

const Container = styled.div`
button {
  position: absolute;
  width: 200px;
  bottom: 0;
  right: 0;
}
`;



const AdminPage = () => {
    const adminSocket = useSocket('admin');
    const [stocks, setStocks] = useState(null);
    const [users, setUsers] = useState(null);
    const startSocket = useSocket('start');

    const start = () => {
        startSocket.emit();
    }

    adminSocket.on(({stocks, users}) => {
        setStocks(stocks);
        setUsers(users);
    })

    useEffect(() => {
        fetch('http://localhost:5000/admin')
            .then((response) => response.json())
            .then(({users, stocks}) => {
                setStocks(stocks);
                setUsers(users);
            })
        return () => {
            adminSocket.off();
        };
    }, []);

    return (
        <Container style={{display: 'flex', justifyContent: 'space-between', width: '80%', margin: '50px auto'}}>
            <Button onClick={start}>Начать торги</Button>
            {users && users.map(user => <User key={user.id} user={user} stocks={stocks}/>)}
        </Container>
    );
};

export default AdminPage;
