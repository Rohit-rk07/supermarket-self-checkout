import { createContext, useContext, useState, useEffect, useRef } from "react";
import { db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; // Make sure the path is correct

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const hasFetchedCart = useRef(false); // 🧠 Flag to avoid first write

    // 🔥 Fetch cart from Firestore when user logs in
    

    // 🔥 Save cart to Firestore when cart updates (after first fetch)
    useEffect(() => {
        if (!user || !hasFetchedCart.current) return;
        
        const saveCart = async () => {
            try {
                const cartRef = doc(db, "carts", user.email);
                await setDoc(cartRef, { items: cart }, { merge: true });
            } catch (error) {
                console.error("Error saving cart:", error);
            }
        };
        
        saveCart();
    }, [cart, user]);

    // ✅ Add item to cart
    const addToCart = (product) => {
        // Check if product already exists in cart
        const existingItem = cart.find(item => item.barcode === product.barcode);
        
        if (existingItem) {
            // Update quantity if product already exists
            setCart(prevCart => 
                prevCart.map(item => 
                    item.barcode === product.barcode
                    ? { ...item, quantity: (item.quantity || 1) + 1 } 
                        : item
                )
            );
        } else {
            // Add new product with quantity 1
            setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
            
            
        }
        
    };

    // ✅ Remove item from cart
    const removeFromCart = (barcode) => {
        setCart(prevCart => prevCart.filter(item => item.barcode !== barcode));
    };
    

    // ✅ Update item quantity
    const updateQuantity = (barcode, newQuantity) => {
        if (newQuantity < 1) return;
    
        setCart(prevCart =>
            prevCart.map(item =>
                item.barcode === barcode
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };
    

    // ✅ Clear cart
    const clearCart = () => {
        setCart([]);
    };

    // Calculate total items in cart
    const totalItems = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + ((item.price || 0) * (item.quantity || 1)), 0);

    return (
        <CartContext.Provider value={{ 
            cart, 
            addToCart, 
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems,
            subtotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};

export default CartContext;