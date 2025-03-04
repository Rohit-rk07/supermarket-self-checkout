import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext"; 
import Dashboard from "./pages/Dashboard";
import CartPage from "./pages/CartPage";
import Checkout from "./components/checkout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const theme = createTheme({
    palette: {
        mode: "light",
        primary: { main: "#1976d2" },
        secondary: { main: "#ff4081" },
    },
    typography: {
        fontFamily: "Roboto, Arial, sans-serif",
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Router> {/* ✅ Move Router to the top */}
                <AuthProvider> {/* Now inside Router ✅ */}
                    <CartProvider> 
                        <Routes>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/cart" element={<CartPage />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </Router>
        </ThemeProvider>
    );
}

export default App;
