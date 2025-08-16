import { useState } from "react";
import { Container, TextField, Button, Typography, Box, CircularProgress, Alert } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const SignupPage = () => {
    const { signup, googleSignIn, error } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const navigate = useNavigate();

    const validateForm = () => {
        setFormError("");
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setFormError("Please enter a valid email address");
            return false;
        }
        
        // Password validation
        if (password.length < 6) {
            setFormError("Password must be at least 6 characters long");
            return false;
        }
        
        // Password confirmation
        if (password !== confirmPassword) {
            setFormError("Passwords don't match");
            return false;
        }
        
        return true;
    };

    // Handle Email/Password Signup
    const handleSignup = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        
        setLoading(true);
        await signup(email, password, displayName, navigate);
        setLoading(false);
    };

    // Handle Google Signup
    const handleGoogleSignup = async () => {
        setLoading(true);
        await googleSignIn(navigate);
        setLoading(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Create Account
            </Typography>
            
            {(error || formError) && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {formError || error}
                </Alert>
            )}
            
            <Box component="form" onSubmit={handleSignup}>
                <TextField 
                    fullWidth 
                    label="Display Name" 
                    variant="outlined" 
                    margin="normal" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)} 
                    placeholder="Your full name"
                />
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
                    type="password" 
                    label="Password" 
                    variant="outlined" 
                    margin="normal" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    helperText="Password must be at least 6 characters"
                />
                <TextField 
                    fullWidth 
                    type="password" 
                    label="Confirm Password" 
                    variant="outlined" 
                    margin="normal" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    required 
                />
                
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 2 }}
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Sign Up"}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
                <Typography sx={{ mx: 2, color: 'text.secondary' }}>OR</Typography>
                <Box sx={{ flex: 1, height: '1px', bgcolor: 'divider' }} />
            </Box>

            <Button 
                onClick={handleGoogleSignup} 
                variant="outlined" 
                color="primary" 
                fullWidth 
                sx={{ mt: 1 }}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : "Continue with Google"}
            </Button>
            
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2">
                    Already have an account?{" "}
                    <Link to="/login" style={{ textDecoration: 'none', color: 'primary.main' }}>
                        Log in
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SignupPage;