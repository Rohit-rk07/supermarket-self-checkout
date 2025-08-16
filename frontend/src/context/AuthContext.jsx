import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
} from "firebase/auth";

// Create context
const AuthContext = createContext(null);

// Create provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Auth state listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                try {
                    // Get Firebase ID token
                    const idToken = await currentUser.getIdToken();
                    
                    // Send to backend for JWT token
                    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/firebase/login`, {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${idToken}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        setUser({
                            uid: currentUser.uid,
                            displayName: currentUser.displayName || "User",
                            email: currentUser.email,
                            token: data.data.token,
                            role: data.data.user.role
                        });
                    } else {
                        console.error('Failed to get JWT token');
                        setUser({
                            uid: currentUser.uid,
                            displayName: currentUser.displayName || "User",
                            email: currentUser.email,
                        });
                    }
                } catch (error) {
                    console.error('Auth token error:', error);
                    setUser({
                        uid: currentUser.uid,
                        displayName: currentUser.displayName || "User",
                        email: currentUser.email,
                    });
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Signup with Email & Password
    const signup = async (email, password, displayName, navigate) => {
        try {
            setError("");
            
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    displayName: displayName || email.split("@")[0]
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                setUser({
                    uid: data.data.user.id,
                    displayName: data.data.user.displayName,
                    email: data.data.user.email,
                    token: data.data.token,
                    role: data.data.user.role
                });
                navigate("/");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Registration failed");
            }
        } catch (error) {
            console.error("Signup error:", error);
            setError("Registration failed. Please try again.");
        }
    };

    // Login with Email & Password
    const login = async (email, password, navigate) => {
        try {
            setError("");
            
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (response.ok) {
                const data = await response.json();
                setUser({
                    uid: data.data.user.id,
                    displayName: data.data.user.displayName,
                    email: data.data.user.email,
                    token: data.data.token,
                    role: data.data.user.role
                });
                navigate("/");
            } else {
                const errorData = await response.json();
                setError(errorData.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Login failed. Please try again.");
        }
    };

    // Google Sign-In
    const googleSignIn = async (navigate) => {
        try {
            setError("");
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ 
                prompt: "select_account",
                access_type: "offline"
            });
            
            const result = await signInWithPopup(auth, provider);
            
            // The onAuthStateChanged listener will handle the JWT token exchange
            setTimeout(() => navigate("/"), 1000);
        } catch (error) {
            console.error("Google sign-in error:", error.code);
            setError(getErrorMessage(error.code));
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error.message);
            setError("⚠️ Failed to log out. Please try again.");
        }
    };

    // Centralized Error Handling
    const getErrorMessage = (errorCode) => {
        switch (errorCode) {
            case "auth/invalid-credential":
                return "❌ Incorrect email or password. Try again.";
            case "auth/user-not-found":
                return "⚠️ No user found. Please sign up first.";
            case "auth/email-already-in-use":
                return "⚠️ This email is already registered. Try logging in.";
            case "auth/weak-password":
                return "⚠️ Password should be at least 6 characters.";
            case "auth/popup-closed-by-user":
                return "⚠️ Google sign-in was canceled. Please try again.";
            case "auth/cancelled-popup-request":
                return "⚠️ Google sign-in was interrupted. Try again.";
            case "auth/network-request-failed":
                return "⚠️ Network error. Check your internet connection.";
            default:
                return "⚠️ An unexpected error occurred. Try again.";
        }
    };

    // Send OTP for password reset
    const sendOTP = async (email) => {
        try {
            setError("");
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/otp/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            
            return data;
        } catch (error) {
            console.error("Send OTP error:", error);
            setError(error.message || "Failed to send OTP");
            throw error;
        }
    };
    
    // Verify OTP and reset password
    const verifyOTPAndResetPassword = async (email, otp, newPassword) => {
        try {
            setError("");
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/otp/verify`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, otp, newPassword })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            
            return data;
        } catch (error) {
            console.error("Verify OTP error:", error);
            setError(error.message || "Failed to reset password");
            throw error;
        }
    };

    // Context value
    const value = {
        user,
        loading,
        error,
        signup,
        login,
        googleSignIn,
        logout,
        sendOTP,
        verifyOTPAndResetPassword
    };

    // Return provider
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Export hook
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Default export for the context
export default AuthContext;