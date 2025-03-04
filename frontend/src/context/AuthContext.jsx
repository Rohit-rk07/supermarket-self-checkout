import { createContext, useContext, useState } from "react";

// Create Auth Context
const AuthContext = createContext();

// Auth Provider to Wrap the App
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // Fake Login (Replace with API call)
    const login = (email, navigate) => {
        setUser({ name: email.split("@")[0], email });
        navigate("/"); // ✅ Navigate inside the login page, not here
    };

    // Fake Signup (Replace with API call)
    const signup = (email, navigate) => {
        setUser({ name: email.split("@")[0], email });
        navigate("/"); // ✅ Navigate inside the signup page, not here
    };

    // Logout Function
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to Use AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};
