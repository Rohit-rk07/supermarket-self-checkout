import { useState } from "react";
import { 
  Container, 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Fab, 
  Badge,
  useTheme,
  useMediaQuery,
  Paper,
  Avatar,
  IconButton
} from "@mui/material";
import { 
  QrCodeScanner as ScanIcon,
  ShoppingCart as CartIcon,
  Payment as CheckoutIcon,
  Person as PersonIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingIcon,
  Speed as SpeedIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BarcodeScanner from "../components/BarcodeScanner";
import { useCart } from "../context/CartContext";
import { gradients, spacing } from "../theme/theme";

const Dashboard = () => {
  const [scannerOpen, setScannerOpen] = useState(false);
  const { cart, addToCart, totalItems, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchProduct = async (barcode) => {
    try {
      console.log("🔍 Fetching for barcode:", barcode);
      const SERVER_URL = import.meta.env.VITE_SERVER_URL;
      const response = await fetch(`${SERVER_URL}/scan/${barcode}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Product not found");
      }

      const result = await response.json();
      console.log("📦 Product Fetched:", result);
      
      // Handle new API response format
      const product = result.success ? result.data : result;
      addToCart(product);
    } catch (error) {
      console.error('Product fetch error:', error);
      alert(error.message || "Product not found");
    }
  };

  const quickActions = [
    {
      title: "Scan Product",
      icon: <ScanIcon sx={{ fontSize: 40 }} />,
      color: "#667eea",
      action: () => setScannerOpen(true),
      description: "Scan barcode to add items"
    },
    {
      title: "View Cart",
      icon: <CartIcon sx={{ fontSize: 40 }} />,
      color: "#f093fb",
      action: () => navigate("/cart"),
      description: `${totalItems} items in cart`,
      badge: totalItems
    },
    {
      title: "Checkout",
      icon: <CheckoutIcon sx={{ fontSize: 40 }} />,
      color: "#4facfe",
      action: () => navigate("/checkout"),
      description: `₹${subtotal.toFixed(2)} total`,
      disabled: cart.length === 0
    }
  ];

  const stats = [
    { label: "Items in Cart", value: totalItems, icon: <InventoryIcon />, color: "#667eea" },
    { label: "Cart Total", value: `₹${subtotal.toFixed(2)}`, icon: <TrendingIcon />, color: "#f093fb" }
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        pb: 4
      }}
    >
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          p: 3,
          borderRadius: 0,
          borderBottomLeftRadius: 24,
          borderBottomRightRadius: 24,
          mb: 3
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
              Smart Checkout
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
              Welcome, {user?.name || 'User'}!
            </Typography>
          </Box>
          <IconButton 
            onClick={() => navigate('/account')}
            sx={{ 
              bgcolor: 'rgba(255,255,255,0.2)', 
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } 
            }}
          >
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
          </IconButton>
        </Box>
      </Paper>

      <Container maxWidth="lg">
        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                elevation={8}
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: stat.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                      color: 'white'
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {stat.label}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h5" fontWeight="bold" color="white" gutterBottom sx={{ mb: 3 }}>
          Quick Actions
        </Typography>
        
        <Grid container spacing={3}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={16}
                sx={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: 4,
                  border: `2px solid ${action.color}`,
                  cursor: action.disabled ? 'not-allowed' : 'pointer',
                  opacity: action.disabled ? 0.6 : 1,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': action.disabled ? {} : { 
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: `0 16px 32px ${action.color}40`,
                    border: `2px solid ${action.color}`,
                    background: 'rgba(255, 255, 255, 1)'
                  }
                }}
                onClick={action.disabled ? undefined : action.action}
              >
                <CardContent sx={{ textAlign: 'center', py: 4 }}>
                  <Box sx={{ position: 'relative', display: 'inline-block', mb: 3 }}>
                    <Box
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: 4,
                        background: `linear-gradient(135deg, ${action.color} 0%, ${action.color}CC 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        mx: 'auto',
                        boxShadow: `0 8px 24px ${action.color}40`
                      }}
                    >
                      {action.badge ? (
                        <Badge badgeContent={action.badge} color="error">
                          {action.icon}
                        </Badge>
                      ) : (
                        action.icon
                      )}
                    </Box>
                  </Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity */}
        {cart.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" fontWeight="bold" color="white" gutterBottom sx={{ mb: 3 }}>
              Recent Items
            </Typography>
            <Card
              elevation={8}
              sx={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderRadius: 3
              }}
            >
              <CardContent>
                {cart.slice(0, 3).map((item, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      py: 2,
                      borderBottom: index < 2 ? '1px solid rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    <Box>
                      <Typography variant="body1" fontWeight="medium">
                        {item.name || item.barcode}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Qty: {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                      ₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Box>
        )}
      </Container>

      {/* Floating Action Button for Quick Scan */}
      <Fab
        color="primary"
        size="large"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
          }
        }}
        onClick={() => setScannerOpen(true)}
      >
        <ScanIcon />
      </Fab>

      {scannerOpen && <BarcodeScanner onScan={fetchProduct} closeScanner={() => setScannerOpen(false)} />}
    </Box>
  );
};

export default Dashboard;
