import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
    onAuthStateChanged,
    updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

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
                setUser({
                    uid: currentUser.uid,
                    displayName: currentUser.displayName || "User",
                    email: currentUser.email,
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    // Signup with Email & Password
    const signup = async (email, password, navigate) => {
        try {
            setError("");
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: email.split("@")[0] });
            navigate("/");
        } catch (error) {
            console.error("Signup error:", error.code);
            setError(getErrorMessage(error.code));
        }
    };

    // Login with Email & Password
    const login = async (email, password, navigate) => {
        try {
            setError("");
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser({
                displayName: userCredential.user.displayName || "User",
                email: userCredential.user.email,
            });
            navigate("/");
        } catch (error) {
            console.error("Login error:", error.code);
            setError(getErrorMessage(error.code));
        }
    };

    // Google Sign-In
    const googleSignIn = async (navigate) => {
        try {
            setError("");
            const provider = new GoogleAuthProvider();
            provider.setCustomParameters({ prompt: "select_account" });
            const result = await signInWithPopup(auth, provider);
            setTimeout(() => navigate("/"), 500);
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

    // Context value
    const value = {
        user,
        loading,
        error,
        signup,
        login,
        googleSignIn,
        logout
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