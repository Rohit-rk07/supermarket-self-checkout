import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const navigate = useNavigate(); // ✅ Use navigate inside the page

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, navigate); // ✅ Pass navigate to AuthContext function
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, p: 3, bgcolor: "white", borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
                <TextField 
                    fullWidth 
                    label="Email" 
                    variant="outlined" 
                    margin="normal" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                    Login
                </Button>
            </Box>
        </Container>
    );
};

export default LoginPage;
