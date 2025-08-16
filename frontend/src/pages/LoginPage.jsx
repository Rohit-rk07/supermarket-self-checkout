import { useState, useEffect } from "react";
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    CircularProgress, 
    Alert
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const LoginPage = () => {
    const { login, googleSignIn, error, user } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await login(email, password, navigate);
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        await googleSignIn(navigate);
        setLoading(false);
    };


    return (
        <Container maxWidth="sm" sx={{ mt: 5, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Login
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                />
                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    variant="outlined"
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                    <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                        <Button 
                            variant="text" 
                            color="primary" 
                            size="small"
                        >
                            Forgot Password?
                        </Button>
                    </Link>
                </Box>
                
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 2 }} 
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Login"}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                <Typography sx={{ mx: 2, color: 'text.secondary' }}>OR</Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            </Box>

            <Button
                variant="outlined"
                color="primary"
                fullWidth
                sx={{ mt: 1 }}
                onClick={handleGoogleLogin}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Continue with Google"}
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2">
                    Don't have an account?{" "}
                    <Link to="/signup" style={{ textDecoration: 'none', color: 'primary.main' }}>
                        Sign up
                    </Link>
                </Typography>
            </Box>

        </Container>
    );
};

export default LoginPage;