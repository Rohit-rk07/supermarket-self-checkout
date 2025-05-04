import { Drawer, Box, Typography, Button, Divider, IconButton, Badge, Avatar, Stack, Grid } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const CartSidebar = ({ isOpen, closeCart }) => {
    const { cart, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
    const navigate = useNavigate();
    
    const handleCheckout = () => {
        closeCart();
        navigate("/checkout");
    };
    
    const handleContinueShopping = () => {
        closeCart();
    };

    const handleEmptyCart = () => {
        clearCart();
    };

    // Calculate cart summary
    const itemCount = cart.reduce((count, item) => count + (item.quantity || 1), 0);
    const cartTotal = cart.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
    const tax = cartTotal * 0.07; // 7% tax
    const final = cartTotal + tax;

    return (
        <Drawer 
            anchor="right" 
            open={isOpen} 
            onClose={closeCart}
            PaperProps={{
                sx: { 
                    width: { xs: "100%", sm: 400 },
                    bgcolor: "#f8f9fa" 
                }
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Header */}
                <Box sx={{ 
                    p: 2, 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    bgcolor: '#2E3B55',
                    color: 'white'
                }}>
                    <Typography variant="h6" fontWeight="bold" display="flex" alignItems="center">
                        <ShoppingCartCheckoutIcon sx={{ mr: 1 }} />
                        Your Cart {itemCount > 0 && (
                            <Badge badgeContent={itemCount} color="error" sx={{ ml: 1 }}>
                                <Box />
                            </Badge>
                        )}
                    </Typography>
                    <IconButton onClick={closeCart} color="inherit">
                        <CloseIcon />
                    </IconButton>
                </Box>
                
                <Divider />
                
                {/* Cart Items - scrollable area */}
                <Box sx={{ 
                    flexGrow: 1, 
                    overflow: 'auto', 
                    p: 2,
                    bgcolor: '#f8f9fa' 
                }}>
                    {cart?.length === 0 ? (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            height: '100%',
                            p: 4
                        }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                Your cart is empty
                            </Typography>
                            <Typography color="text.secondary" textAlign="center">
                                Add items to your cart to continue shopping
                            </Typography>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                sx={{ mt: 3 }}
                                onClick={handleContinueShopping}
                            >
                                Browse Products
                            </Button>
                        </Box>
                    ) : (
                        <>
                            {cart.map((item, idx) => (
                                <Box 
                                    key={idx}
                                    sx={{ 
                                        py: 2, 
                                        display: 'flex',
                                        borderBottom: '1px solid #eee'
                                    }}
                                >
                                    {/* Product Image */}
                                    <Avatar 
                                        variant="rounded"
                                        alt={item.name}
                                        src={item.image || "/api/placeholder/60/60"}
                                        sx={{ width: 60, height: 60, mr: 2 }}
                                    />
                                    
                                    {/* Details */}
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Typography variant="subtitle1" fontWeight="500">
                                            {item.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            ${item.price.toFixed(2)} each
                                        </Typography>
                                        
                                        {/* Quantity Controls */}
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                                disabled={(item.quantity || 1) <= 1}
                                                color="primary"
                                            >
                                                <RemoveCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                            <Typography>
                                                {item.quantity || 1}
                                            </Typography>
                                            <IconButton 
                                                size="small" 
                                                onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                                color="primary"
                                            >
                                                <AddCircleOutlineIcon fontSize="small" />
                                            </IconButton>
                                            
                                            <Box sx={{ flexGrow: 1 }} />
                                            
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                ${(item.price * (item.quantity || 1)).toFixed(2)}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                    
                                    {/* Remove Button */}
                                    <IconButton 
                                        size="small" 
                                        sx={{ alignSelf: 'flex-start', ml: 1 }}
                                        onClick={() => removeFromCart(item.id)}
                                        color="error"
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                            
                            {/* Empty Cart Button */}
                            <Button
                                variant="text"
                                color="error"
                                startIcon={<DeleteOutlineIcon />}
                                onClick={handleEmptyCart}
                                sx={{ mt: 2 }}
                            >
                                Empty Cart
                            </Button>
                        </>
                    )}
                </Box>
                
                {/* Summary and Actions */}
                {cart.length > 0 && (
                    <Box sx={{ 
                        p: 2, 
                        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                        bgcolor: 'white'
                    }}>
                        {/* Pricing Summary */}
                        <Grid container spacing={1} sx={{ mb: 2 }}>
                            <Grid item xs={6}>
                                <Typography variant="body2">Subtotal:</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" textAlign="right" fontWeight="medium">
                                    ${cartTotal.toFixed(2)}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={6}>
                                <Typography variant="body2">Tax (7%):</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" textAlign="right" fontWeight="medium">
                                    ${tax.toFixed(2)}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Total:
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="subtitle1" fontWeight="bold" textAlign="right" color="primary.main">
                                    ${final.toFixed(2)}
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        {/* Action Buttons */}
                        <Button 
                            variant="contained" 
                            color="primary" 
                            fullWidth 
                            startIcon={<ShoppingCartCheckoutIcon />}
                            sx={{ 
                                mb: 1.5, 
                                py: 1,
                                fontWeight: 'bold',
                                boxShadow: 2,
                                fontSize: '1rem'
                            }}
                            onClick={handleCheckout}
                        >
                            Checkout (${final.toFixed(2)})
                        </Button>
                        
                        <Button 
                            variant="outlined"
                            fullWidth
                            onClick={handleContinueShopping}
                            sx={{ py: 1 }}
                        >
                            Continue Shopping
                        </Button>
                    </Box>
                )}
            </Box>
        </Drawer>
    );
};

export default CartSidebar;