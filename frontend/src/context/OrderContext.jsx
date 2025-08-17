import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch orders when user changes
    useEffect(() => {
        const fetchOrders = async () => {
            if (!user || !user.token) {
                setOrders([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/orders/my-orders`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data = await response.json();
                setOrders(data.data.orders || []);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Failed to load order history. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    // Create a new order
    const createOrder = async (orderData) => {
        if (!user || !user.token) return null;

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/v1/orders`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    items: orderData.items.map(item => ({
                        barcode: item.barcode,
                        quantity: item.quantity || 1
                    })),
                    notes: orderData.notes || `Payment via ${orderData.paymentMethod}`,
                    deliveryAddress: orderData.deliveryAddress
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const data = await response.json();
            const newOrder = data.data;
            
            setOrders(prevOrders => [newOrder, ...prevOrders]);
            
            return newOrder._id;
        } catch (err) {
            console.error("Error creating order:", err);
            setError("Failed to create order. Please try again.");
            return null;
        }
    };

    return (
        <OrderContext.Provider value={{ 
            orders, 
            loading, 
            error, 
            createOrder 
        }}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrders = () => {
    const context = useContext(OrderContext);
    if (context === undefined) {
        throw new Error("useOrders must be used within an OrderProvider");
    }
    return context;
};

export default OrderContext;