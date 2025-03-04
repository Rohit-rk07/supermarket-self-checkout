import { Container, Typography, List, ListItem, Divider, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartPage = () => {
    const { cart, clearCart } = useCart();
    const navigate = useNavigate();
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <Container maxWidth="sm" sx={{ mt: 4, p: 3, bgcolor: "white", borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="bold">🛒 Your Cart</Typography>

            {cart.length === 0 ? (
                <Typography variant="body1" color="textSecondary" sx={{ textAlign: "center", mt: 3 }}>
                    Your cart is empty. Add products before checking out.
                </Typography>
            ) : (
                <List>
                    {cart.map((item, idx) => (
                        <div key={idx}>
                            <ListItem>
                                <Typography variant="body1">{item.name} - <strong>${item.price.toFixed(2)}</strong></Typography>
                            </ListItem>
                            {idx < cart.length - 1 && <Divider />}
                        </div>
                    ))}
                </List>
            )}

            <Typography variant="h6" fontWeight="bold" sx={{ mt: 3 }}>
                Total: <span style={{ color: "#1976d2" }}>${total.toFixed(2)}</span>
            </Typography>

            <Button variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={cart.length === 0}
                    onClick={() => navigate("/checkout")}>
                Proceed to Checkout
            </Button>

            <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 2 }} onClick={() => navigate("/")}>
                ⬅️ Continue Shopping
            </Button>
        </Container>
    );
};

export default CartPage;
