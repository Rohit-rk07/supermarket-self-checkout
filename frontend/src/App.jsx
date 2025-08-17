import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { OrderProvider } from "./context/OrderContext"; 
import Dashboard from "./pages/Dashboard";
import CartPage from "./pages/CartPage";
import Checkout from "./components/checkout";
import LoginPage from "./pages/LoginPage";
import BarcodeScanner from "./components/BarcodeScanner";
import AccountPage from "./components/AccountPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { theme } from "./theme/theme";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router> 
                <AuthProvider> 
                    <CartProvider>
                        <OrderProvider>
                            <Routes>
                                <Route path="/" element={<LoginPage />} />
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                                <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                                <Route path="/BarcodeScanner" element={<ProtectedRoute><BarcodeScanner /></ProtectedRoute>} />
                                <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
                            </Routes>
                        </OrderProvider>
                    </CartProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
