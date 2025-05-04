import { initializeApp } from "firebase/app";
import { 
    getAuth, 
    GoogleAuthProvider, 
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBVwv78HQm1rYXewVr3AvEudcZt3PIM5PA",
    authDomain: "supermarket-self-checkou-9d876.firebaseapp.com",
    projectId: "supermarket-self-checkou-9d876",
    storageBucket: "supermarket-self-checkou-9d876.firebasestorage.app",
    messagingSenderId: "82635482664",
    appId: "1:82635482664:web:52b97f7b2f49046509371d",
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Configure Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Export all necessary Firebase services and functions
export {
    app,
    auth,
    db,
    storage,
    googleProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    sendEmailVerification
};

// Export a function to get the current user's ID
export const getCurrentUserId = () => {
    return auth.currentUser ? auth.currentUser.uid : null;
};

// Export a function to check if a user is authenticated
export const isAuthenticated = () => {
    return !!auth.currentUser;
};