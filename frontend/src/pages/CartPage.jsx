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
            <Container maxWidth="lg" sx={{ mt: 8, mb: 10 }}>
                <Paper elevation={3} sx={{ p: 6, borderRadius: 2, textAlign: "center" }}>
                    <LocalGroceryStore sx={{ fontSize: 70, color: "text.secondary", mb: 2 }} />
                    <Typography variant="h4" gutterBottom fontWeight="medium">
                        Your cart is empty
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph sx={{ maxWidth: 500, mx: "auto" }}>
                        You haven't scanned any items yet. 
                        Scan product barcodes to add them to your cart.
                    </Typography>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large" 
                        onClick={() => navigate("/")}
                        startIcon={<QrCodeScanner />}
                        sx={{ mt: 2, px: 4, py: 1.2 }}
                    >
                        Go To Dashboard
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 10 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ mb: 4 }}>
                Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </Typography>

            <Grid container spacing={4}>
                {/* Cart Items */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
                        {/* Cart Header */}
                        <Box sx={{ 
                            bgcolor: "#f5f5f5", 
                            p: 2, 
                            borderBottom: "1px solid #e0e0e0"
                        }}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Product
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: "center" }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Price
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: "center" }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Quantity
                                    </Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: "right" }}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Total
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Cart Items */}
                        <Box sx={{ p: 0 }}>
                            {cart.map((item, idx) => (
                                <Box 
                                    key={idx} 
                                    sx={{ 
                                        p: 2, 
                                        borderBottom: idx < cart.length - 1 ? "1px solid #e0e0e0" : "none",
                                        "&:hover": { bgcolor: "#f9f9f9" }
                                    }}
                                >
                                    <Grid container alignItems="center">
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
                                            <Typography variant="body1">
                                                ${item.price.toFixed(2)}
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
                                            <Typography variant="body1" fontWeight="bold">
                                                ${(item.price * (item.quantity || 1)).toFixed(2)}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                        </Box>

                        {/* Cart Actions */}
                        <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                            <Button
                                variant="outlined"
                                startIcon={<QrCodeScanner />}
                                onClick={() => navigate("/")}
                            >
                                Scan More Items
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteSweep />}
                                onClick={clearCart}
                            >
                                Clear Cart
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                {/* Order Summary */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={2} sx={{ borderRadius: 2, p: 3 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Cart Summary
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        {/* Price Details */}
                        <Box sx={{ mb: 3 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                                <Typography variant="body1">Subtotal</Typography>
                                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                            </Box>
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body1">Tax (7%)</Typography>
                                <Typography variant="body1">${tax.toFixed(2)}</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Total */}
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h6" fontWeight="bold">
                                Total
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                ${total.toFixed(2)}
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
                            sx={{ mt: 3, py: 1.5, fontWeight: "bold", boxShadow: 3 }}
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
                        <Paper elevation={2} sx={{ borderRadius: 2, p: 3, mt: 3 }}>
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
        </Container>
    );
};

export default CartPage;