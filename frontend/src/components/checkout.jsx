import { 
    Container, 
    Typography, 
    List, 
    ListItem, 
    Divider, 
    Button, 
    Box, 
    Paper, 
    Grid,
    CircularProgress,
    Alert,
    ListItemText,
    ListItemSecondaryAction,
    Chip
} from "@mui/material";
import { 
    Payment, 
    ShoppingCartCheckout, 
    CreditCard, 
    LocalAtm, 
    Receipt, 
    CheckCircle,
    AccountBalanceWallet
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { initializeRazorpayPayment } from "../services/RazorpayService";

const CheckoutPage = () => {
    const { cart, clearCart } = useCart();
    const { createOrder } = useOrders();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
    const tax = subtotal * 0.07; // 7% tax
    const total = subtotal + tax;

    // If cart is empty and not in success state, redirect to cart
    useEffect(() => {
        if (cart.length === 0 && !success) {
            navigate("/cart");
        }
    }, [cart, navigate, success]);

    // If user is not logged in, redirect to login
    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handlePayment = async (method) => {
        setPaymentMethod(method);
        
        if (method === "razorpay") {
            handleRazorpayPayment();
        } else {
            // Original payment flow for other methods
            setProcessing(true);
            
            try {
                // Create order in Firestore
                const orderId = await createOrder({
                    items: cart,
                    subtotal,
                    tax,
                    total,
                    paymentMethod: method,
                    paymentStatus: "paid"
                });
                
                // Simulate payment processing
                setTimeout(() => {
                    setProcessing(false);
                    setSuccess(true);
                    
                    // Clear cart and redirect after a delay
                    setTimeout(() => {
                        clearCart();
                        navigate("/account");
                    }, 1500);
                }, 2000);
            } catch (error) {
                console.error("Payment error:", error);
                setProcessing(false);
                setPaymentError("Failed to process payment. Please try again.");
            }
        }
    };

    const handleRazorpayPayment = async () => {
        try {
            setProcessing(true);
            setPaymentError(null);
            
            // 1. Create order on the backend
            const response = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: total,
                    currency: 'INR',
                    receipt: `order_${Date.now()}`,
                    notes: {
                        items: cart.length,
                    }
                }),
            });
            
            if (!response.ok) {
                throw new Error('Failed to create order');
            }
            
            const orderData = await response.json();
            
            // 2. Initialize Razorpay payment
            await initializeRazorpayPayment({
                amount: orderData.amount,
                currency: orderData.currency,
                orderId: orderData.orderId,
                handler: async function (response) {
                    try {
                        // 3. Verify payment on backend
                        const verifyResponse = await fetch('/api/payments/verify-payment', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature
                            }),
                        });
                        
                        if (!verifyResponse.ok) {
                            throw new Error('Payment verification failed');
                        }
                        
                        // 4. Create order in Firestore
                        await createOrder({
                            items: cart,
                            subtotal,
                            tax,
                            total,
                            paymentMethod: "razorpay",
                            paymentStatus: "paid",
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpayOrderId: response.razorpay_order_id
                        });
                        
                        // 5. Show success message
                        setProcessing(false);
                        setSuccess(true);
                        
                        // Clear cart and redirect after a delay
                        setTimeout(() => {
                            clearCart();
                            navigate("/account");
                        }, 1500);
                    } catch (error) {
                        setProcessing(false);
                        setPaymentError('Payment verification failed. Please try again.');
                        console.error('Payment verification error:', error);
                    }
                }
            });
        } catch (error) {
            setProcessing(false);
            setPaymentError('Payment failed. Please try again.');
            console.error('Razorpay payment error:', error);
        }
    };

    if (success) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4, textAlign: "center" }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
                    <Typography variant="h4" gutterBottom>Payment Successful!</Typography>
                    <Typography variant="body1" paragraph>
                        Your payment has been processed successfully.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Please take your receipt from the printer.
                    </Typography>
                    <CircularProgress size={24} sx={{ mt: 2 }} />
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                        Redirecting to your account...
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Review Your Items
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {cart.length === 0 ? (
                            <Typography variant="body1" color="text.secondary" sx={{ py: 3, textAlign: "center" }}>
                                Your cart is empty. Please scan items before checkout.
                            </Typography>
                        ) : (
                            <List disablePadding>
                                {cart.map((item, idx) => (
                                    <Box key={idx}>
                                        <ListItem sx={{ py: 1.5 }}>
                                            <ListItemText
                                                primary={item.name}
                                                secondary={item.category && `Category: ${item.category}`}
                                            />
                                            <ListItemSecondaryAction>
                                                <Box sx={{ textAlign: "right" }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.quantity || 1} × ${item.price.toFixed(2)}
                                                    </Typography>
                                                    <Typography variant="body1" fontWeight="medium">
                                                        ${((item.quantity || 1) * item.price).toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                        {idx < cart.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        )}
                        
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                            <Typography variant="body1">Subtotal</Typography>
                            <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                            <Typography variant="body1">Tax (7%)</Typography>
                            <Typography variant="body1">${tax.toFixed(2)}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography variant="h6" fontWeight="bold">Total</Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                ${total.toFixed(2)}
                            </Typography>
                        </Box>
                    </Paper>
                    
                    <Button
                        variant="outlined"
                        startIcon={<ShoppingCartCheckout />}
                        sx={{ mt: 2 }}
                        onClick={() => navigate("/cart")}
                    >
                        Return to Cart
                    </Button>
                </Grid>
                
                <Grid item xs={12} md={5}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Select Payment Method
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        
                        {paymentError && (
                            <Alert severity="error" sx={{ mb: 2 }}>
                                {paymentError}
                            </Alert>
                        )}
                        
                        {processing ? (
                            <Box sx={{ textAlign: "center", py: 4 }}>
                                <CircularProgress size={48} sx={{ mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Processing Payment
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Please wait while we process your payment...
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    sx={{ 
                                        mb: 2, 
                                        py: 2, 
                                        justifyContent: "flex-start",
                                        border: "1px solid #e0e0e0",
                                        "&:hover": { border: "1px solid #1976d2" }
                                    }}
                                    onClick={() => handlePayment("razorpay")}
                                    disabled={cart.length === 0}
                                >
                                    <AccountBalanceWallet sx={{ mr: 2 }} />
                                    <Box sx={{ textAlign: "left" }}>
                                        <Typography variant="body1" fontWeight="medium">
                                            Pay with Razorpay
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            UPI, Cards, Wallets & more
                                        </Typography>
                                    </Box>
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    sx={{ 
                                        mb: 2, 
                                        py: 2, 
                                        justifyContent: "flex-start",
                                        border: "1px solid #e0e0e0",
                                        "&:hover": { border: "1px solid #1976d2" }
                                    }}
                                    onClick={() => handlePayment("card")}
                                    disabled={cart.length === 0}
                                >
                                    <CreditCard sx={{ mr: 2 }} />
                                    <Box sx={{ textAlign: "left" }}>
                                        <Typography variant="body1" fontWeight="medium">
                                            Pay with Credit/Debit Card
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Insert or tap your card
                                        </Typography>
                                    </Box>
                                </Button>
                                
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    size="large"
                                    sx={{ 
                                        mb: 2, 
                                        py: 2, 
                                        justifyContent: "flex-start",
                                        border: "1px solid #e0e0e0",
                                        "&:hover": { border: "1px solid #1976d2" }
                                    }}
                                    onClick={() => handlePayment("cash")}
                                    disabled={cart.length === 0}
                                >
                                    <LocalAtm sx={{ mr: 2 }} />
                                    <Box sx={{ textAlign: "left" }}>
                                        <Typography variant="body1" fontWeight="medium">
                                            Pay with Cash
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Use the cash machine
                                        </Typography>
                                    </Box>
                                </Button>
                                
                                <Alert severity="info" sx={{ mt: 3 }}>
                                    <Typography variant="body2">
                                        Please follow the instructions on the payment terminal.
                                    </Typography>
                                </Alert>
                            </>
                        )}
                    </Paper>
                    
                    {!processing && (
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mt: 3 }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                <Receipt color="primary" sx={{ mr: 1.5 }} />
                                <Typography variant="h6" fontWeight="medium">
                                    Receipt Options
                                </Typography>
                            </Box>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                                <Chip
                                    label="Print Receipt"
                                    variant="outlined"
                                    clickable
                                    sx={{ px: 1 }}
                                />
                                <Chip
                                    label="Email Receipt"
                                    variant="outlined"
                                    clickable
                                    sx={{ px: 1 }}
                                />
                                <Chip
                                    label="No Receipt"
                                    variant="outlined"
                                    clickable
                                    sx={{ px: 1 }}
                                />
                            </Box>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default CheckoutPage;