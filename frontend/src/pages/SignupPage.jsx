import { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
    const { signup } = useAuth();
    const [email, setEmail] = useState("");
    const navigate = useNavigate(); // ✅ Use navigate inside the page

    const handleSubmit = (e) => {
        e.preventDefault();
        signup(email, navigate); // ✅ Pass navigate to AuthContext function
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, p: 3, bgcolor: "white", borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Signup
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
                    Signup
                </Button>
            </Box>
        </Container>
    );
};

export default SignupPage;
