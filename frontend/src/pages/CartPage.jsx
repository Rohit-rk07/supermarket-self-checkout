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
    const tax = subtotal * 0.07; // 7% tax
    const total = subtotal + tax;

    const handleCheckout = () => {
        setCheckoutInProgress(true);
        // Simulate processing payment
        
            navigate("/checkout");
    };

    if (cart.length === 0) {
        return (
            <Box sx={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4
            }}>
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Card 
                    elevation={24} 
                    sx={{ 
                        p: { xs: 4, md: 6 }, 
                        textAlign: 'center',
                        borderRadius: 4,
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <Box sx={{ mb: 4 }}>
                        <LocalGroceryStore sx={{ fontSize: 100, color: 'primary.main', mb: 2, opacity: 0.8 }} />
                        <Typography variant="h3" fontWeight="bold" gutterBottom color="text.primary">
                            Your Cart is Empty
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 500, mx: "auto", mb: 4 }}>
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
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                borderRadius: 3,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
                                '&:hover': { 
                                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                                    boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)'
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
                                borderRadius: 3,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderWidth: 2,
                                '&:hover': { 
                                    borderWidth: 2,
                                    background: 'rgba(102, 126, 234, 0.05)'
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                py: 4,
            }}
        >
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                    <Badge badgeContent={cart.length} color="secondary" sx={{ mr: 2 }}>
                        <LocalGroceryStore sx={{ fontSize: 40, color: 'white' }} />
                    </Badge>
                    <Typography 
                        variant="h3" 
                        fontWeight="bold" 
                        sx={{ 
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        Shopping Cart
                    </Typography>
                </Box>

            <Grid container spacing={4}>
                {/* Cart Items */}
                <Grid item xs={12} md={8}>
                    <Card 
                        elevation={24} 
                        sx={{ 
                            borderRadius: 4, 
                            overflow: "hidden",
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <CardContent sx={{ p: 0 }}>
                            <Box sx={{ p: 3, background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)', color: 'white' }}>
                                <Typography variant="h5" fontWeight="bold">
                                    Cart Items ({cart.length})
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={2} sx={{ mb: 2, pb: 2, borderBottom: "1px solid #e0e0e0" }}>
                                    <Grid item xs={6}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                                            Product
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                                            Price
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={{ textAlign: "center" }}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
                                            Quantity
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={{ textAlign: "right" }}>
                                        <Typography variant="subtitle1" fontWeight="bold" color="text.secondary">
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
                                            borderBottom: idx < cart.length - 1 ? "1px solid #e0e0e0" : "none",
                                            "&:hover": { bgcolor: "#f9f9f9" },
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
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {item.name}
                                                    </Typography>
                                                    {item.category && (
                                                        <Chip 
                                                            label={item.category} 
                                                            size="small" 
                                                            sx={{ mt: 0.5 }}
                                                        />
                                                    )}
                                                    <Box sx={{ mt: 1 }}>
                                                        <Button
                                                            variant="text"
                                                            color="error"
                                                            size="small"
                                                            startIcon={<DeleteOutline fontSize="small" />}
                                                            onClick={() => removeFromCart(item.barcode)}
                                                            sx={{ px: 0 }}
                                                        >
                                                            Remove
                                                        </Button>
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </Grid>

                                        {/* Price */}
                                        <Grid item xs={2} sx={{ textAlign: "center" }}>
                                            <Typography variant="body1" fontWeight="medium">
                                                ₹{item.price.toFixed(2)}
                                            </Typography>
                                        </Grid>

                                        {/* Quantity */}
                                        <Grid item xs={2} sx={{ textAlign: "center" }}>
                                            <Box sx={{ 
                                                display: "flex", 
                                                alignItems: "center", 
                                                justifyContent: "center",
                                                border: "1px solid #e0e0e0",
                                                borderRadius: 1,
                                                width: "fit-content",
                                                margin: "0 auto"
                                            }}>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => updateQuantity(item.barcode, (item.quantity || 1) - 1)}
                                                    
                                                >
                                                    <Remove fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ mx: 1, minWidth: "24px", textAlign: "center" }}>
                                                    {item.quantity || 1}
                                                </Typography>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={() => updateQuantity(item.barcode, (item.quantity || 1) + 1)}
                                                >
                                                    <Add fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Grid>

                                        {/* Total */}
                                        <Grid item xs={2} sx={{ textAlign: "right" }}>
                                            <Typography variant="body1" fontWeight="bold" color="primary.main">
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
                                    sx={{ borderRadius: 2, flex: 1 }}
                                >
                                    Scan More Items
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    startIcon={<DeleteSweep />}
                                    onClick={clearCart}
                                    sx={{ borderRadius: 2, flex: 1 }}
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
                        elevation={8} 
                        sx={{ 
                            borderRadius: 3, 
                            p: 3,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Cart Summary
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* Price Details */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body1">Subtotal</Typography>
                                <Typography variant="body1">₹{subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body1">Tax (7%)</Typography>
                                <Typography variant="body1">₹{tax.toFixed(2)}</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Total */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h6" fontWeight="bold">
                                Total
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                ₹{total.toFixed(2)}
                            </Typography>
                        </Box>

                        {/* Checkout Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={checkoutInProgress}
                            startIcon={<ShoppingCartCheckout />}
                            sx={{ 
                                mt: 3, 
                                py: 1.5, 
                                fontWeight: "bold", 
                                boxShadow: 3,
                                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                                }
                            }}
                            onClick={handleCheckout}
                        >
                            {checkoutInProgress ? "Processing..." : "Complete Checkout"}
                        </Button>

                        {/* Help Info */}
                        <Alert severity="info" sx={{ mt: 3 }}>
                            <Typography variant="body2">
                                Please verify all items have been scanned before completing checkout
                            </Typography>
                        </Alert>
                    </Paper>

                    {/* Assistance Info */}
                    {!user && (
                        <Paper 
                            elevation={8} 
                            sx={{ 
                                borderRadius: 3, 
                                p: 3, 
                                mt: 3,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                                Need Assistance?
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                Press the help button or ask a store employee for assistance with checkout
                            </Typography>
                            <Button
                                variant="outlined"
                                fullWidth
                                color="secondary"
                                onClick={() => alert("Assistance requested")}
                            >
                                Request Help
                            </Button>
                        </Paper>
                    )}
                </Grid>
            </Grid>
            
            {/* Floating Back Button */}
            <Fab
                color="secondary"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: 24,
                    background: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                        background: 'rgba(255, 255, 255, 1)',
                    }
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