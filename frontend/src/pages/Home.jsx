import { useState } from "react";
import axios from "axios";
import { Container, Box, Typography, Paper, Alert } from "@mui/material";
import BarcodeScanner from "../components/BarcodeScanner";
import ProductDisplay from "../components/ProductDisplay";

const Home = () => {
    const [barcode, setBarcode] = useState("");
    const [product, setProduct] = useState(null);
    const [error, setError] = useState("");

    const fetchProduct = async (scannedBarcode) => {
        setBarcode(scannedBarcode);
        try {
            const response = await axios.get(`http://localhost:8000/scan/${scannedBarcode}`);
            setProduct(response.data);
            setError("");
        } catch (err) {
            setError("Product not found");
            setProduct(null);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Supermarket Self-Checkout
                </Typography>

                <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }}>
                    <BarcodeScanner onScan={fetchProduct} />

                    {barcode && (
                        <Typography variant="h6" sx={{ mt: 2 }}>
                            Scanned Barcode: <strong>{barcode}</strong>
                        </Typography>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                </Paper>

                <ProductDisplay product={product} />
            </Box>
        </Container>
    );
};

export default Home;
