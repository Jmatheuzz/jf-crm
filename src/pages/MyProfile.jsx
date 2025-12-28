import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { getUsuario, updateUsuario } from '../network/api';

const MyProfile = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = (await getUsuario()).data.user;
                setUser(userData);
                setName(userData.name);
                setEmail(userData.email);
                setPhone(userData.telefone);
            } catch (error) {
                setError('Failed to fetch user data');
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = { nome: name, email, telefone: phone };
            if (password) {
                updatedUser.senha = password;
            }
            await updateUsuario(localStorage.getItem('userId'), updatedUser);
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    if (!user) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Meu perfil
                </Typography>
                {error && <Typography color="error">{error}</Typography>}
                {success && <Typography color="success">{success}</Typography>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Nome"
                        fullWidth
                        margin="normal"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <TextField
                        label="Telefone"
                        fullWidth
                        margin="normal"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Salvar
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default MyProfile;
