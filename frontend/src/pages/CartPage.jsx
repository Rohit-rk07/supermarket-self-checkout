import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    IconButton,
    Grid,
    Divider,
    Avatar,
    Chip,
    Alert,
    useTheme,
    useMediaQuery,
    Fab,
    Card,
    CardContent,
    Stack,
    Badge
} from "@mui/material";
import {
    Add,
    Remove,
    DeleteOutline,
    ShoppingCartCheckout,
    ArrowBack,
    DeleteSweep,
    LocalGroceryStore,
    ShoppingBag,
    QrCodeScanner
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";


const CartPage = () => {
    const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [checkoutInProgress, setCheckoutInProgress] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    // Calculate cart summary
    const itemCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);
    const subtotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const taxRate = 0.18; // 18% GST (more realistic for Indian market)
    const tax = Math.round(subtotal * taxRate * 100) / 100; // Proper rounding to 2 decimals
    const total = Math.round((subtotal + tax) * 100) / 100; // Proper rounding to 2 decimals

    const handleCheckout = () => {
        setCheckoutInProgress(true);
        // Simulate processing payment
        
            navigate("/checkout");
    };

    if (cart.length === 0) {
        return (
            <Box sx={{ 
                minHeight: '100vh', 
                backgroundColor: '#f8fafc',
                py: 4
            }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Card 
                    elevation={0} 
                    sx={{ 
                        p: { xs: 4, md: 6 }, 
                        textAlign: 'center',
                        borderRadius: 2,
                        backgroundColor: 'white',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <LocalGroceryStore sx={{ fontSize: 100, color: '#10b981', mb: 2, opacity: 0.8 }} />
                        <Typography variant="h3" fontWeight="700" gutterBottom sx={{ color: '#1e293b' }}>
                            Your Cart is Empty
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#64748b', maxWidth: 500, mx: "auto", mb: 4 }}>
                            Ready to start shopping? Scan product barcodes to add items to your cart and enjoy a seamless checkout experience.
                        </Typography>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={() => navigate("/dashboard")}
                            startIcon={<QrCodeScanner />}
                            sx={{ 
                                px: 4, py: 1.5,
                                backgroundColor: '#10b981',
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                '&:hover': { 
                                    backgroundColor: '#059669'
                                }
                            }}
                        >
                            Start Shopping
                        </Button>
                        <Button 
                            variant="outlined" 
                            size="large" 
                            onClick={() => navigate("/account")}
                            startIcon={<ShoppingBag />}
                            sx={{ 
                                px: 4, py: 1.5,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderColor: '#e2e8f0',
                                color: '#64748b',
                                '&:hover': { 
                                    borderColor: '#1e293b',
                                    backgroundColor: '#f8fafc'
                                }
                            }}
                        >
                            View Orders
                        </Button>
                    </Stack>
                </Card>
            </Container>
            </Box>
        );
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f8fafc',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                    <Badge badgeContent={cart.length} sx={{ mr: 2, '& .MuiBadge-badge': { backgroundColor: '#10b981', color: 'white' } }}>
                        <LocalGroceryStore sx={{ fontSize: 40, color: '#1e293b' }} />
                    </Badge>
                    <Typography 
                        variant="h3" 
                        fontWeight="700" 
                        sx={{ 
                            color: '#1e293b'
                        }}
                    >
                        Shopping Cart
                    </Typography>
                </Box>

            <Grid container spacing={4}>
                {/* Cart Items */}
                <Grid item xs={12} md={8}>
                    <Card 
                        elevation={0} 
                        sx={{ 
                            borderRadius: 2, 
                            overflow: "hidden",
                            backgroundColor: 'white',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 3, backgroundColor: '#1e293b', color: 'white' }}>
                                <Typography variant="h5" fontWeight="600">
                                    Cart Items ({cart.length})
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={2} sx={{ mb: 2, pb: 2, borderBottom: "1px solid #f1f5f9" }}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#64748b' }}>
                                            Product
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#64748b' }}>
                                            Price
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#64748b' }}>
                                            Quantity
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={{ textAlign: "right" }}>
                                        <Typography variant="subtitle1" fontWeight="600" sx={{ color: '#64748b' }}>
                                            Total
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {/* Cart Items */}
                                {cart.map((item, idx) => (
                                    <Box 
                                        key={idx} 
                                        sx={{ 
                                            p: 2, 
                                            borderBottom: idx < cart.length - 1 ? "1px solid #f1f5f9" : "none",
                                            "&:hover": { bgcolor: "#f8fafc" },
                                            borderRadius: 2,
                                            mb: 1
                                        }}
                                    >
                                        <Grid container alignItems="center" spacing={2}>
                                        {/* Product Info */}
                                        <Grid item xs={6}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Avatar 
                                                    variant="rounded"
                                                    alt={item.name}
                                                    src={item.image || "/api/placeholder/80/80"}
                                                    sx={{ width: 80, height: 80, mr: 2 }}
                                                />
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight="500" sx={{ color: '#1e293b' }}>
                                                        {item.name}
                                                    </Typography>
                                                    {item.category && (
                                                        <Chip 
                                                            label={item.category} 
                                                            size="small" 
                                                            sx={{ mt: 0.5, backgroundColor: '#dcfce7', color: '#166534' }}
                                                        />
                                                    )}
                                                    <Box sx={{ mt: 1 }}>
                                                        <Button
                                                            variant="text"
                                                            size="small"
                                                            startIcon={<DeleteOutline fontSize="small" />}
                                                            onClick={() => removeFromCart(item.barcode)}
                                                            sx={{ px: 0, color: '#ef4444', '&:hover': { backgroundColor: '#fef2f2' } }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {/* Price */}
                                        <Grid item xs={2} sx={{ textAlign: "center" }}>
                                            <Typography variant="body1" fontWeight="500" sx={{ color: '#1e293b' }}>
                                                ₹{item.price.toFixed(2)}
                                            </Typography>
                                        </Grid>

                                        {/* Quantity */}
                                        <Grid item xs={2} sx={{ textAlign: "center" }}>
                                            <Box sx={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                justifyContent: "center",
                                                border: "1px solid #e2e8f0",
                                                borderRadius: 1,
                                                width: "fit-content",
                                                margin: "0 auto"
                                            }}>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => updateQuantity(item.barcode, (item.quantity || 1) - 1)}
                                                    sx={{ color: '#64748b' }}
                                                >
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ mx: 1, minWidth: "24px", textAlign: "center", color: '#1e293b' }}>
                                                    {item.quantity || 1}
                                                </Typography>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => updateQuantity(item.barcode, (item.quantity || 1) + 1)}
                                                    sx={{ color: '#64748b' }}
                                                >
                                                    <Add fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>

                                        {/* Total */}
                                        <Grid item xs={2} sx={{ textAlign: "right" }}>
                                            <Typography variant="body1" fontWeight="700" sx={{ color: '#10b981' }}>
                                                ₹{(item.price * (item.quantity || 1)).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                            </Box>

                            {/* Cart Actions */}
                            <Box sx={{ p: 3, pt: 2, display: "flex", justifyContent: "space-between", gap: 2 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<QrCodeScanner />}
                                    onClick={() => navigate("/dashboard")}
                                    sx={{ 
                                        borderRadius: 2, 
                                        flex: 1,
                                        borderColor: '#e2e8f0',
                                        color: '#64748b',
                                        '&:hover': {
                                            borderColor: '#1e293b',
                                            backgroundColor: '#f8fafc'
                                        }
                                    }}
                                >
                                    Scan More Items
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<DeleteSweep />}
                                    onClick={clearCart}
                                    sx={{ 
                                        borderRadius: 2, 
                                        flex: 1,
                                        borderColor: '#fecaca',
                                        color: '#ef4444',
                                        '&:hover': {
                                            borderColor: '#ef4444',
                                            backgroundColor: '#fef2f2'
                                        }
                                    }}
                                >
                                    Clear Cart
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper 
                        elevation={0} 
                        sx={{ 
                            borderRadius: 2, 
                            p: 3,
                            backgroundColor: 'white',
                            border: '1px solid #f1f5f9',
                            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Typography variant="h6" fontWeight="600" gutterBottom sx={{ color: '#1e293b' }}>
                            Cart Summary
                        </Typography>
                        <Divider sx={{ mb: 2, borderColor: '#f1f5f9' }} />

                        {/* Price Details */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body1" sx={{ color: '#64748b' }}>Subtotal</Typography>
                                <Typography variant="body1" sx={{ color: '#1e293b' }}>₹{subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body1" sx={{ color: '#64748b' }}>Tax (18%)</Typography>
                                <Typography variant="body1" sx={{ color: '#1e293b' }}>₹{tax.toFixed(2)}</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2, borderColor: '#f1f5f9' }} />

                        {/* Total */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h6" fontWeight="600" sx={{ color: '#1e293b' }}>
                                Total
                            </Typography>
                            <Typography variant="h6" fontWeight="700" sx={{ color: '#10b981' }}>
                                ₹{total.toFixed(2)}
                            </Typography>
                        </Box>

                        {/* Checkout Button */}
                        <Button
                            variant="contained"
                            fullWidth
                            size="large"
                            disabled={checkoutInProgress}
                            startIcon={<ShoppingCartCheckout />}
                            sx={{ 
                                mt: 3, 
                                py: 1.5, 
                                fontWeight: "600", 
                                borderRadius: 2,
                                backgroundColor: '#10b981',
                                '&:hover': {
                                    backgroundColor: '#059669'
                                }
                            }}
                            onClick={handleCheckout}
                        >
                            {checkoutInProgress ? "Processing..." : "Complete Checkout"}
                        </Button>

                        {/* Help Info */}
                        <Alert severity="info" sx={{ mt: 3, borderRadius: 2, backgroundColor: '#dbeafe', borderColor: '#bfdbfe' }}>
                            <Typography variant="body2" sx={{ color: '#1e40af' }}>
                                Please verify all items have been scanned before completing checkout
                            </Typography>
                        </Alert>
                    </Paper>

                    {/* Assistance Info */}
                    {!user && (
                        <Paper 
                            elevation={0} 
                            sx={{ 
                                borderRadius: 2, 
                                p: 3, 
                                mt: 3,
                                backgroundColor: 'white',
                                border: '1px solid #f1f5f9',
                                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="500" gutterBottom sx={{ color: '#1e293b' }}>
                                Need Assistance?
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }} paragraph>
                                Press the help button or ask a store employee for assistance with checkout
                            </Typography>
                            <Button
                                variant="outlined"
                                fullWidth
                                onClick={() => alert("Assistance requested")}
                                sx={{
                                    borderColor: '#e2e8f0',
                                    color: '#64748b',
                                    '&:hover': {
                                        borderColor: '#1e293b',
                                        backgroundColor: '#f8fafc'
                                    }
                                }}
                            >
                                Request Help
                            </Button>
                        </Paper>
                    )}
                </Grid>
            </Grid>
            
            {/* Floating Back Button */}
            <Fab
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: 24,
                    backgroundColor: '#1e293b',
                    color: 'white',
                    '&:hover': {
                        backgroundColor: '#334155',
                        transform: 'scale(1.1)'
                    },
                    transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => navigate('/dashboard')}
            >
                <ArrowBack />
            </Fab>
        </Container>
        </Box>
    );
};

export default CartPage;