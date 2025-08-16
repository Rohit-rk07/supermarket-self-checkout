import { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress,
    Stepper,
    Step,
    StepLabel
} from '@mui/material';
import { Email, Lock, Verified } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const { sendOTP, verifyOTPAndResetPassword, error } = useAuth();
    const navigate = useNavigate();
    
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });

    const steps = ['Enter Email', 'Verify OTP', 'Reset Password'];

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (!formData.email) return;

        setLoading(true);
        try {
            await sendOTP(formData.email);
            setSuccess('OTP sent to your email successfully!');
            setActiveStep(1);
        } catch (error) {
            // Error is handled by context
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyAndReset = async (e) => {
        e.preventDefault();
        
        if (formData.newPassword !== formData.confirmPassword) {
            return;
        }

        if (formData.newPassword.length < 6) {
            return;
        }

        setLoading(true);
        try {
            await verifyOTPAndResetPassword(
                formData.email,
                formData.otp,
                formData.newPassword
            );
            setSuccess('Password reset successfully!');
            setActiveStep(2);
            
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            // Error is handled by context
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (activeStep) {
            case 0:
                return (
                    <Box component="form" onSubmit={handleSendOTP}>
                        <TextField
                            fullWidth
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            margin="normal"
                            InputProps={{
                                startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading || !formData.email}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                        </Button>
                    </Box>
                );

            case 1:
                return (
                    <Box component="form" onSubmit={handleVerifyAndReset}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Enter the 6-digit OTP sent to {formData.email}
                        </Alert>
                        
                        <TextField
                            fullWidth
                            label="OTP Code"
                            name="otp"
                            value={formData.otp}
                            onChange={handleChange}
                            required
                            margin="normal"
                            inputProps={{ maxLength: 6, pattern: '[0-9]{6}' }}
                            InputProps={{
                                startAdornment: <Verified sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            label="New Password"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            required
                            margin="normal"
                            helperText="Password must be at least 6 characters"
                            InputProps={{
                                startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                            }}
                        />
                        
                        <TextField
                            fullWidth
                            label="Confirm New Password"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            margin="normal"
                            error={formData.confirmPassword && formData.newPassword !== formData.confirmPassword}
                            helperText={
                                formData.confirmPassword && formData.newPassword !== formData.confirmPassword
                                    ? "Passwords don't match"
                                    : ""
                            }
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={
                                loading || 
                                !formData.otp || 
                                !formData.newPassword || 
                                !formData.confirmPassword ||
                                formData.newPassword !== formData.confirmPassword ||
                                formData.newPassword.length < 6
                            }
                        >
                            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                        </Button>
                    </Box>
                );

            case 2:
                return (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Verified color="success" sx={{ fontSize: 64, mb: 2 }} />
                        <Typography variant="h5" gutterBottom>
                            Password Reset Successful!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Redirecting to login page...
                        </Typography>
                        <CircularProgress sx={{ mt: 2 }} />
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Reset Password
                </Typography>
                
                <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                {renderStepContent()}

                {activeStep < 2 && (
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Button
                            variant="text"
                            onClick={() => navigate('/login')}
                        >
                            Back to Login
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ForgotPassword;
