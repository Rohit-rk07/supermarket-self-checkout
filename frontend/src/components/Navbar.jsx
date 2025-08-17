import { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Button, Menu, MenuItem, Avatar } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNavigate } from "react-router-dom";
import scanIcon from "../assets/scan.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Import AuthContext 

const Navbar = () => {
    const { cart } = useCart();
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    return (
        <AppBar position="sticky" sx={{ bgcolor: "#2E3B55", p: 1 }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="h6" fontWeight="bold" color="white">
                    Supermarket Checkout
                </Typography>

                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    

                    {user ? (
    <>
        <IconButton onClick={handleMenuOpen}>
            <Avatar>{user.name ? user.name[0] : (user.email ? user.email[0] : 'U')}</Avatar>
              
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={() => navigate("/account")}>Purchase History</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
        </Menu>
        
    </>
) : (
    <>
        <Button variant="outlined" color="inherit" onClick={() => navigate("/login")}>
            Login
        </Button>
        {/* Signup removed: registration handled in phone login flow */}
    </>
)}

               
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
