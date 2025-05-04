import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../config/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp, orderBy } from "firebase/firestore";
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
            if (!user) {
                setOrders([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const q = query(
                    collection(db, "orders"),
                    where("userId", "==", user.uid),
                    orderBy("createdAt", "desc")
                );
                
                const querySnapshot = await getDocs(q);
                const ordersData = [];
                
                querySnapshot.forEach((doc) => {
                    ordersData.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                
                setOrders(ordersData);
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
        if (!user) return null;

        try {
            const orderRef = await addDoc(collection(db, "orders"), {
                ...orderData,
                userId: user.uid,
                userEmail: user.email,
                createdAt: serverTimestamp(),
                status: "completed"
            });
            
            const newOrder = {
                id: orderRef.id,
                ...orderData,
                userId: user.uid,
                userEmail: user.email,
                createdAt: new Date(),
                status: "completed"
            };
            
            setOrders(prevOrders => [newOrder, ...prevOrders]);
            
            return orderRef.id;
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