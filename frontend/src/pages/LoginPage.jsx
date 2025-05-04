import { useState, useEffect } from "react";
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Box, 
    CircularProgress, 
    Alert,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../config/firebase";

const LoginPage = () => {
    const { login, googleSignIn, error, user } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetOpen, setResetOpen] = useState(false);
    const [resetMessage, setResetMessage] = useState({ type: "", message: "" });
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

    const handleResetPassword = async () => {
        if (!resetEmail) {
            setResetMessage({ type: "error", message: "Please enter your email address" });
            return;
        }

        try {
            await sendPasswordResetEmail(auth, resetEmail);
            setResetMessage({ 
                type: "success", 
                message: "Password reset email sent! Check your inbox." 
            });
            setTimeout(() => setResetOpen(false), 3000);
        } catch (error) {
            setResetMessage({ 
                type: "error", 
                message: "Failed to send reset email. Please check if the email is correct." 
            });
        }
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
                    <Button 
                        variant="text" 
                        color="primary" 
                        size="small"
                        onClick={() => setResetOpen(true)}
                    >
                        Forgot Password?
                    </Button>
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

            {/* Password Reset Dialog */}
            <Dialog open={resetOpen} onClose={() => setResetOpen(false)}>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter your email address and we'll send you a link to reset your password.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                    />
                    {resetMessage.message && (
                        <Alert 
                            severity={resetMessage.type} 
                            sx={{ mt: 2 }}
                        >
                            {resetMessage.message}
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setResetOpen(false)}>Cancel</Button>
                    <Button onClick={handleResetPassword}>Send Reset Link</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default LoginPage;