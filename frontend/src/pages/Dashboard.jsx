import { useState } from "react";
import { Container, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Checkout from "../components/checkout";
import BarcodeScanner from "../components/BarcodeScanner";
import { useCart } from "../context/CartContext";
import cartIcon from "../assets/cart.png";
import scanIcon from "../assets/scan.png";
import checkoutIcon from "../assets/checkout.png";
import checkoutBg from "../assets/bg.webp";

const Dashboard = () => {
    
    const [scannerOpen, setScannerOpen] = useState(false);
    const { cart, addToCart } = useCart();
    const navigate = useNavigate();

    const fetchProduct = async (barcode) => {
        try {
            console.log("🔍 Fetching for barcode:", barcode);
            const SERVER_URL = import.meta.env.VITE_SERVER_URL;
            const response = await fetch(`${SERVER_URL}/scan/${barcode}`);

            if (!response.ok) throw new Error("Product not found");

            const product = await response.json();
            console.log("📦 Product Fetched:", product);
            addToCart(product);
        } catch (error) {
            alert("Product not found");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh",
                backgroundImage: `url(${checkoutBg})`, // ✅ Add background image
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
            }}
        >
            <Navbar />
            <Box sx={{ width: "100%", height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Typography variant="h6" color="white"></Typography>
            </Box>
            
            
            {/* Bottom Buttons */}
            <Box sx={{ position: "absolute", bottom: 40, left: "50%", transform: "translateX(-50%)", display: "flex", gap: "50px" }}>
                
                <img src={cartIcon} alt="View Cart" onClick={() => navigate("/cart")} style={{ width: 80, cursor: "pointer" }} />
                <img src={scanIcon} alt="Scan" onClick={() => setScannerOpen(true)} style={{ width: 80, cursor: "pointer" }} />
                <img src={checkoutIcon} alt="Checkout" onClick={() => navigate("/checkout")} 
                     style={{ width: 80, cursor: cart.length > 0 ? "pointer" : "not-allowed", opacity: cart.length > 0 ? 1 : 0.5 }} />
            </Box>

            {scannerOpen && <BarcodeScanner onScan={fetchProduct} closeScanner={() => setScannerOpen(false)} />}
        </Box>
    );
};

export default Dashboard;
