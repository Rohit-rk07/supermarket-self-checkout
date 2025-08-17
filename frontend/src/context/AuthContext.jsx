import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext(null);

// Create provider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Check for existing token on app load
    useEffect(() => {
        const checkAuthState = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                try {
                    // Verify token with backend
                    const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/profile`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        setUser({
                            id: data.data._id,
                            name: data.data.name,
                            phoneNumber: data.data.phoneNumber,
                            email: data.data.email,
                            token: token,
                            role: data.data.role
                        });
                    } else {
                        // Token is invalid, remove it
                        localStorage.removeItem('authToken');
                        setUser(null);
                    }
                } catch (error) {
                    console.error('Auth check error:', error);
                    localStorage.removeItem('authToken');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkAuthState();
    }, []);

    // Send OTP to phone number
    const sendPhoneOTP = async (phoneNumber) => {
        try {
            setError("");
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/phone/send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber })
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

    // Verify OTP and login/register
    const verifyPhoneOTP = async (phoneNumber, otp) => {
        try {
            setError("");
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/phone/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ phoneNumber, otp })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            
            // Store token
            localStorage.setItem('authToken', data.data.token);
            
            setUser({
                id: data.data.user._id,
                name: data.data.user.name,
                phoneNumber: data.data.user.phoneNumber,
                email: data.data.user.email,
                token: data.data.token,
                role: data.data.user.role,
                isNewUser: data.data.needsRegistration
            });
            
            return data;
        } catch (error) {
            console.error("Verify OTP error:", error);
            setError(error.message || "Failed to verify OTP");
            throw error;
        }
    };

    // Complete registration for new users
    const completeRegistration = async (name, email) => {
        try {
            setError("");
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/complete-registration`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email })
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            
            setUser({
                ...user,
                name: data.data.name,
                email: data.data.email,
                isNewUser: false
            });
            
            return data;
        } catch (error) {
            console.error("Complete registration error:", error);
            setError(error.message || "Failed to complete registration");
            throw error;
        }
    };

    // Logout
    const logout = async () => {
        try {
            localStorage.removeItem('authToken');
            setUser(null);
        } catch (error) {
            console.error("Logout error:", error.message);
            setError("⚠️ Failed to log out. Please try again.");
        }
    };

    // Update user profile
    const updateProfile = async (profileData) => {
        try {
            setError("");
            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData)
            });
            
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message);
            }
            
            setUser({
                ...user,
                ...data.data
            });
            
            return data;
        } catch (error) {
            console.error("Update profile error:", error);
            setError(error.message || "Failed to update profile");
            throw error;
        }
    };

    // Context value
    const value = {
        user,
        loading,
        error,
        sendPhoneOTP,
        verifyPhoneOTP,
        completeRegistration,
        updateProfile,
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