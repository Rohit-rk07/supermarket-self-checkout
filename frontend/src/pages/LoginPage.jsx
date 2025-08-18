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
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: { xs: 2, sm: 3 }
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 0, md: 4 }} sx={{ minHeight: { xs: 'auto', md: '80vh' } }}>
          {/* Left Side - Branding - Hidden on mobile */}
          {!isMobile && (
            <Grid item md={6} sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              p: 4,
              color: '#1e293b'
            }}>
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <ShoppingCartIcon sx={{ fontSize: 80, mb: 2, color: '#10b981' }} />
                <Typography variant="h2" fontWeight="700" gutterBottom sx={{ color: '#1e293b' }}>
                  Smart Checkout
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', maxWidth: 400 }}>
                  Scan, Shop, and Pay with ease. The future of retail shopping is here.
                </Typography>
              </Box>
              
              {/* Features */}
              <Box sx={{ maxWidth: 400, mt: 4 }}>
                {[
                  { icon: <SecurityIcon sx={{ color: '#10b981' }} />, text: 'Secure Phone Authentication' },
                  { icon: <PhoneIcon sx={{ color: '#10b981' }} />, text: 'Multi-Country Support' },
                  { icon: <ShoppingCartIcon sx={{ color: '#10b981' }} />, text: 'Smart Cart Management' }
                ].map((feature, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {feature.icon}
                    <Typography variant="body1" sx={{ ml: 2, color: '#64748b' }}>
                      {feature.text}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
          )}

          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, sm: 4, md: 5 },
                borderRadius: 2,
                backgroundColor: 'white',
                border: '1px solid #f1f5f9',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: { xs: 'auto', md: '600px' },
                maxWidth: { xs: '100%', sm: '480px' },
                mx: 'auto'
              }}
            >
              {/* Mobile header */}
              {isMobile && (
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <ShoppingCartIcon sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
                  <Typography variant="h4" fontWeight="700" sx={{ color: '#1e293b', mb: 1 }}>
                    Smart Checkout
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b' }}>
                    Secure shopping experience
                  </Typography>
                </Box>
              )}

              <Typography variant={{ xs: 'h5', sm: 'h4' }} fontWeight="600" gutterBottom sx={{ textAlign: 'center', color: '#1e293b', mb: 3 }}>
                {step === 1 ? "Welcome" : step === 2 ? "Verify OTP" : step === 3 ? "Complete Registration" : ""}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              {step === 1 ? (
                <Box component="form" onSubmit={handleSendOTP}>
                  <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#64748b' }}>
                    Enter your phone number to receive a secure OTP
                  </Typography>
                  
                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 1 }, mt: 2 }}>
                    <FormControl sx={{ minWidth: { xs: '100%', sm: 140 } }}>
                      <InputLabel>Country</InputLabel>
                      <Select
                        value={countryCode}
                        label="Country"
                        onChange={(e) => setCountryCode(e.target.value)}
                        sx={{ 
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e2e8f0'
                          }
                        }}
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
                        startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#64748b' }} /></InputAdornment>
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          '& fieldset': {
                            borderColor: '#e2e8f0'
                          },
                          '&:hover fieldset': {
                            borderColor: '#10b981'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#10b981'
                          }
                        }
                      }}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ 
                      mt: 3, 
                      py: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      backgroundColor: '#10b981',
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      '&:hover': {
                        backgroundColor: '#059669'
                      }
                    }}
                    disabled={loading || !phoneNumber}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Send OTP"}
                  </Button>

                  {/* Demo User Button for Recruiters */}
                  <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#64748b', mb: 2 }}>
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
                        borderColor: '#e2e8f0',
                        color: '#64748b',
                        py: { xs: 1.5, sm: 2 },
                        fontSize: { xs: '1rem', sm: '1.1rem' },
                        '&:hover': {
                          borderColor: '#10b981',
                          backgroundColor: '#f0fdf4',
                          color: '#10b981'
                        }
                      }}
                    >
                      Continue as Demo User
                    </Button>
                  </Box>
                </Box>
              ) : step === 2 ? (
                <Box component="form" onSubmit={handleVerifyOTP}>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: '#64748b' }}>
                    Enter the 6-digit OTP sent to
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: '#1e293b' }}>
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
                      startAdornment: <InputAdornment position="start"><SecurityIcon sx={{ color: '#64748b' }} /></InputAdornment>
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '& fieldset': {
                          borderColor: '#e2e8f0'
                        },
                        '&:hover fieldset': {
                          borderColor: '#10b981'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981'
                        }
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ 
                      mt: 3, 
                      py: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      backgroundColor: '#10b981',
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      '&:hover': {
                        backgroundColor: '#059669'
                      }
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
                      sx={{ 
                        borderRadius: 2, 
                        color: countdown > 0 ? '#94a3b8' : '#10b981',
                        '&:hover': {
                          backgroundColor: '#f0fdf4'
                        }
                      }}
                    >
                      {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                    </Button>
                  </Box>
                </Box>
              ) : step === 3 ? (
                <Box component="form" onSubmit={handleCompleteRegistration}>
                  <Typography variant="body1" sx={{ mb: 2, textAlign: 'center', color: '#64748b' }}>
                    Complete your profile to get started
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 3, textAlign: 'center', fontWeight: 600, color: '#1e293b' }}>
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
                        '& fieldset': {
                          borderColor: '#e2e8f0'
                        },
                        '&:hover fieldset': {
                          borderColor: '#10b981'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981'
                        }
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
                        '& fieldset': {
                          borderColor: '#e2e8f0'
                        },
                        '&:hover fieldset': {
                          borderColor: '#10b981'
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#10b981'
                        }
                      }
                    }}
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ 
                      mt: 3, 
                      py: { xs: 1.5, sm: 2 },
                      borderRadius: 2,
                      backgroundColor: '#10b981',
                      fontWeight: 600,
                      fontSize: { xs: '1rem', sm: '1.1rem' },
                      '&:hover': {
                        backgroundColor: '#059669'
                      }
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
