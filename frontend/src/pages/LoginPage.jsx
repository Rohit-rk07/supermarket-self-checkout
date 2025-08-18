import { useState, useEffect } from "react";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Alert, 
  CircularProgress,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment
} from "@mui/material";
import { 
  Phone as PhoneIcon, 
  Security as SecurityIcon,
  ShoppingCart as ShoppingCartIcon 
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const countryCodes = [
  { code: '+1', country: 'US/Canada', flag: '', digits: 10, pattern: '[2-9]' },
  { code: '+91', country: 'India', flag: '', digits: 10, pattern: '[6-9]' },
  { code: '+86', country: 'China', flag: '', digits: 11, pattern: '1' },
  { code: '+44', country: 'UK', flag: '', digits: 10, pattern: '7' },
  { code: '+81', country: 'Japan', flag: '', digits: 9, pattern: '[7-9]' },
  { code: '+49', country: 'Germany', flag: '', digits: '10-11', pattern: '1' }
];

const LoginPage = () => {
  const { sendPhoneOTP, verifyPhoneOTP, completeRegistration, loginAsDemo, error } = useAuth();
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getSelectedCountry = () => {
    return countryCodes.find(country => country.code === countryCode);
  };

  const getPhonePlaceholder = () => {
    const country = getSelectedCountry();
    if (!country) return "1234567890";
    
    const digitCount = typeof country.digits === 'string' ? country.digits : country.digits;
    const pattern = country.pattern;
    
    switch (country.code) {
      case '+1': return "2123456789"; // US format
      case '+91': return "9876543210"; // India format
      case '+86': return "13812345678"; // China format
      case '+44': return "7123456789"; // UK format
      case '+81': return "912345678"; // Japan format
      case '+49': return "1234567890"; // Germany format
      default: return "1234567890";
    }
  };

  const getPhoneHelperText = () => {
    const country = getSelectedCountry();
    if (!country) return "";
    
    return `Enter ${country.digits} digits starting with ${country.pattern.replace('[', '').replace(']', '')} for ${country.country}`;
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fullPhoneNumber = countryCode + phoneNumber;
    try {
      await sendPhoneOTP(fullPhoneNumber);
      setStep(2);
      setCountdown(30);
    } catch (err) {
      // Error handled by context
    }
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    const fullPhoneNumber = countryCode + phoneNumber;
    try {
      const response = await verifyPhoneOTP(fullPhoneNumber, otp);
      if (response.data && response.data.isNewUser) {
        setStep(3); // New users need to complete registration
      } else {
        navigate('/dashboard'); // Existing users go directly to dashboard
      }
    } catch (err) {
      // Error handled by context
    }
    setLoading(false);
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await completeRegistration(name, email);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      // Error handled by context
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    setLoading(true);
    const fullPhoneNumber = countryCode + phoneNumber;
    try {
      await sendPhoneOTP(fullPhoneNumber);
      setCountdown(30);
    } catch (err) {
      // Error handled by context
    }
    setLoading(false);
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 1, sm: 2 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={0} sx={{ minHeight: '80vh' }}>
          {/* Left Side - Branding */}
          <Grid item xs={12} md={6} sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: { xs: 2, md: 4 },
            color: 'white'
          }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <ShoppingCartIcon sx={{ fontSize: 80, mb: 2, opacity: 0.9 }} />
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Smart Checkout
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 400 }}>
                Scan, Shop, and Pay with ease. The future of retail shopping is here.
              </Typography>
            </Box>
            
            {/* Features */}
            <Box sx={{ maxWidth: 400, mt: 4 }}>
              {[
                { icon: <SecurityIcon />, text: 'Secure Phone Authentication' },
                { icon: <PhoneIcon />, text: 'Multi-Country Support' },
                { icon: <ShoppingCartIcon />, text: 'Smart Cart Management' }
              ].map((feature, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2, opacity: 0.9 }}>
                  {feature.icon}
                  <Typography variant="body1" sx={{ ml: 2 }}>
                    {feature.text}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper
              elevation={24}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: { xs: 2, md: 4 },
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: { xs: 'auto', md: '600px' }
              }}
            >
              {isMobile && (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <ShoppingCartIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    Smart Checkout
                  </Typography>
                </Box>
              )}

              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ textAlign: 'center' }}>
                {step === 1 ? "Welcome" : step === 2 ? "Verify OTP" : step === 3 ? "Complete Registration" : ""}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {step === 1 ? (
                <Box component="form" onSubmit={handleSendOTP}>
                  <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                    Enter your phone number to receive a secure OTP
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <FormControl sx={{ minWidth: 120 }}>
                      <InputLabel>Country</InputLabel>
                      <Select
                        value={countryCode}
                        label="Country"
                        onChange={(e) => setCountryCode(e.target.value)}
                        sx={{ borderRadius: 2 }}
                      >
                        {countryCodes.map((country) => (
                          <MenuItem key={country.code} value={country.code}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <TextField
                      fullWidth
                      label="Phone Number"
                      variant="outlined"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder={getPhonePlaceholder()}
                      required
                      helperText={getPhoneHelperText()}
                      InputProps={{
                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'action.active' }} />
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ 
                      mt: 3, 
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                    }}
                    disabled={loading || !phoneNumber}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                  </Button>

                  {/* Demo User Button for Recruiters */}
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      For Recruiters & Demo
                    </Typography>
                    <Button
                      variant="outlined"
                      fullWidth
                      size="large"
                      onClick={() => {
                        loginAsDemo();
                        navigate('/dashboard');
                      }}
                      sx={{ 
                        borderRadius: 2,
                        borderColor: 'rgba(102, 126, 234, 0.5)',
                        color: 'primary.main',
                        '&:hover': {
                          borderColor: 'primary.main',
                          background: 'rgba(102, 126, 234, 0.05)'
                        }
                      }}
                    >
                      Continue as Demo User
                    </Button>
                  </Box>
                </Box>
              ) : step === 2 ? (
                <Box component="form" onSubmit={handleVerifyOTP}>
                  <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                    Enter the 6-digit OTP sent to
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    {countryCode + phoneNumber}
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="OTP Code"
                    variant="outlined"
                    margin="normal"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' } }}
                    required
                    InputProps={{
                      startAdornment: <SecurityIcon sx={{ mr: 1, color: 'action.active' }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ 
                      mt: 3, 
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                    }}
                    disabled={loading || otp.length !== 6}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Verify & Login"}
                  </Button>

                  <Box sx={{ mt: 3, textAlign: "center" }}>
                    <Button
                      variant="text"
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || loading}
                      sx={{ borderRadius: 2 }}
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                    </Button>
                  </Box>
                </Box>
              ) : step === 3 ? (
                <Box component="form" onSubmit={handleCompleteRegistration}>
                  <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                    Complete your profile to get started
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Phone: {countryCode + phoneNumber}
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />
                  
                  <TextField
                    fullWidth
                    label="Email (Optional)"
                    variant="outlined"
                    margin="normal"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ 
                      mt: 3, 
                      py: 1.5,
                      borderRadius: 2,
                      background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                    }}
                    disabled={loading || !name.trim()}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Complete Registration"}
                  </Button>
                </Box>
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default LoginPage;
