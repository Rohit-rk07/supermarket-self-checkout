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
            const response = await fetch('/api/v1/payments/create-order', {
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
                        const verifyResponse = await fetch('/api/v1/payments/verify-payment', {
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
            <Box sx={{ 
                minHeight: '100vh', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4
            }}>
                <Container maxWidth="sm" sx={{ textAlign: "center" }}>
                    <Paper 
                        elevation={24} 
                        sx={{ 
                            p: 6, 
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <CheckCircle color="success" sx={{ fontSize: 80, mb: 3 }} />
                        <Typography variant="h3" fontWeight="bold" gutterBottom>Payment Successful!</Typography>
                        <Typography variant="h6" paragraph color="text.secondary">
                            Your payment has been processed successfully.
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
                            Please take your receipt from the printer.
                        </Typography>
                        <CircularProgress size={32} sx={{ mt: 2 }} />
                        <Typography variant="body1" display="block" sx={{ mt: 2, fontWeight: 500 }}>
                            Redirecting to your account...
                        </Typography>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
    <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
    }}>
        <Container maxWidth="lg">
            <Typography 
                variant="h3" 
                fontWeight="bold" 
                gutterBottom 
                sx={{ 
                    textAlign: 'center', 
                    color: 'white',
                    mb: 4,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
            >
                💳 Checkout
            </Typography>
            
            <Grid container spacing={4}>
                <Grid item xs={12} md={7}>
                    <Paper 
                        elevation={24} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}
                    >
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
                        <Typography variant="body1">Total</Typography>
                        <Typography variant="body1" fontWeight="bold">${total.toFixed(2)}</Typography>
                    </Box>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={5}>
                    <Paper 
                        elevation={24} 
                        sx={{ 
                            p: 4, 
                            borderRadius: 4,
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Payment Options
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
                                        borderRadius: 3,
                                        border: "2px solid #667eea",
                                        "&:hover": { 
                                            border: "2px solid #5a6fd8",
                                            background: 'rgba(102, 126, 234, 0.05)'
                                        }
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
                                        borderRadius: 3,
                                        border: "2px solid #f093fb",
                                        "&:hover": { 
                                            border: "2px solid #e081f5",
                                            background: 'rgba(240, 147, 251, 0.05)'
                                        }
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
                                        borderRadius: 3,
                                        border: "2px solid #4facfe",
                                        "&:hover": { 
                                            border: "2px solid #3d9bfe",
                                            background: 'rgba(79, 172, 254, 0.05)'
                                        }
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
                            <Paper 
                                elevation={24} 
                                sx={{ 
                                    p: 3, 
                                    borderRadius: 4, 
                                    mt: 3,
                                    background: 'rgba(255, 255, 255, 0.95)',
                                    backdropFilter: 'blur(20px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                                }}
                            >
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
                                        sx={{ px: 1, borderRadius: 2 }}
                                    />
                                    <Chip
                                        label="Email Receipt"
                                        variant="outlined"
                                        clickable
                                        sx={{ px: 1, borderRadius: 2 }}
                                    />
                                    <Chip
                                        label="No Receipt"
                                        variant="outlined"
                                        clickable
                                        sx={{ px: 1, borderRadius: 2 }}
                                    />
                                </Box>
                            </Paper>
                        )}
                </Grid>
            </Grid>
        </Container>
    </Box>
);
};

export default CheckoutPage;