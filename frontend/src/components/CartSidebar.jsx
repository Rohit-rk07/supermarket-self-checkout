import { Drawer, Box, Typography, Button, Divider } from "@mui/material";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import { useCart } from "../context/CartContext"; // Get cart from context ✅

const CartSidebar = ({ isOpen, closeCart }) => {
    const { cart } = useCart(); // Get cart from global state ✅

    return (
        <Drawer anchor="right" open={isOpen} onClose={closeCart}>
            <Box sx={{ width: 300, p: 3, bgcolor: "#f8f9fa" }}>
                {/* Title */}
                <Typography variant="h6" fontWeight="bold" color="#2E3B55">
                    🛍️ Your Cart
                </Typography>
                <Divider sx={{ my: 2 }} />

                {/* Cart Items */}
                {cart?.length === 0 ? ( // ✅ Ensure cart is defined
                    <Typography color="text.secondary">No items added yet.</Typography>
                ) : (
                    cart.map((item, idx) => (
                        <Box key={idx} sx={{ py: 1 }}>
                            <Typography variant="body1">{item.name}</Typography>
                            <Typography fontWeight="bold" color="green">${item.price.toFixed(2)}</Typography>
                            <Divider sx={{ my: 1 }} />
                        </Box>
                    ))
                )}

                {/* Checkout Button */}
                {cart?.length > 0 && ( // ✅ Ensure cart is defined
                    <Button 
                        variant="contained" 
                        color="success" 
                        fullWidth 
                        startIcon={<ShoppingCartCheckoutIcon />}
                        sx={{ mt: 2 }}
                    >
                        Checkout
                    </Button>
                )}

                {/* Close Button */}
                <Button variant="contained" color="error" fullWidth onClick={closeCart} sx={{ mt: 2 }}>
                    ❌ Close Cart
                </Button>
            </Box>
        </Drawer>
    );
};

export default CartSidebar;
