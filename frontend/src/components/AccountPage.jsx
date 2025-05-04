import { useState } from "react";
import { 
    Container, 
    Typography, 
    Paper, 
    Box, 
    Tab, 
    Tabs, 
    Divider, 
    Avatar, 
    List, 
    ListItem, 
    ListItemText, 
    Grid, 
    CircularProgress, 
    Alert, 
    Chip, 
    Button,
    Card,
    CardContent,
    useTheme
} from "@mui/material";
import { 
    Person, 
    History, 
    ReceiptLong, 
    ShoppingBag, 
    DateRange, 
    AttachMoney
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
    const { user, logout } = useAuth();
    const { orders, loading, error } = useOrders();
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    // If user is not logged in, redirect to login
    if (!user) {
        navigate("/login");
        return null;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
            <Grid container spacing={3}>
                {/* Sidebar */}
                <Grid item xs={12} md={4} lg={3}>
                    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                            <Avatar 
                                sx={{ 
                                    width: 80, 
                                    height: 80, 
                                    bgcolor: theme.palette.primary.main,
                                    fontSize: 32,
                                    mb: 2
                                }}
                            >
                                {user.displayName ? user.displayName[0].toUpperCase() : "U"}
                            </Avatar>
                            <Typography variant="h6" fontWeight="bold">
                                {user.displayName || "User"}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user.email}
                            </Typography>
                        </Box>
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Tabs
                            orientation="vertical"
                            value={activeTab}
                            onChange={handleTabChange}
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                        >
                            <Tab 
                                icon={<Person sx={{ mr: 1 }} />} 
                                label="Profile" 
                                iconPosition="start"
                                sx={{ alignItems: "flex-start", textAlign: "left" }}
                            />
                            <Tab 
                                icon={<History sx={{ mr: 1 }} />} 
                                label="Order History" 
                                iconPosition="start"
                                sx={{ alignItems: "flex-start", textAlign: "left" }}
                            />
                        </Tabs>
                        
                        <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            sx={{ mt: 3 }}
                            onClick={handleLogout}
                        >
                            Log Out
                        </Button>
                    </Paper>
                </Grid>
                
                {/* Main Content */}
                <Grid item xs={12} md={8} lg={9}>
                    {/* Profile Tab */}
                    {activeTab === 0 && (
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                                <Person sx={{ mr: 1, verticalAlign: "middle" }} />
                                My Profile
                            </Typography>
                            
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Full Name
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                                        {user.displayName || "Not set"}
                                    </Typography>
                                    
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Email Address
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                                        {user.email}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Account Type
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                                        {user.email.includes("@gmail.com") ? "Google Account" : "Email Account"}
                                    </Typography>
                                    
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Orders
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {loading ? <CircularProgress size={16} /> : orders.length}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    )}
                    
                    {/* Order History Tab */}
                    {activeTab === 1 && (
                        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
                                <ReceiptLong sx={{ mr: 1, verticalAlign: "middle" }} />
                                Order History
                            </Typography>
                            
                            {error && (
                                <Alert severity="error" sx={{ mb: 3 }}>
                                    {error}
                                </Alert>
                            )}
                            
                            {loading ? (
                                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                                    <CircularProgress />
                                </Box>
                            ) : orders.length === 0 ? (
                                <Box sx={{ p: 3, textAlign: "center" }}>
                                    <ShoppingBag sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                                    <Typography variant="h6" gutterBottom>
                                        No Orders Yet
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" paragraph>
                                        You haven't placed any orders yet.
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        onClick={() => navigate("/")} 
                                        sx={{ mt: 1 }}
                                    >
                                        Start Shopping
                                    </Button>
                                </Box>
                            ) : (
                                <List disablePadding>
                                    {orders.map((order, index) => (
                                        <Card key={order.id} sx={{ mb: 3, borderRadius: 2 }}>
                                            <CardContent>
                                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                                    <Typography variant="h6" fontWeight="medium">
                                                        Order #{order.id.slice(-6).toUpperCase()}
                                                    </Typography>
                                                    <Chip 
                                                        label={order.status} 
                                                        color={order.status === "completed" ? "success" : "primary"}
                                                        size="small"
                                                    />
                                                </Box>
                                                
                                                <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <DateRange fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {order.createdAt.toDate().toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <AttachMoney fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            ${order.total.toFixed(2)}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <ShoppingBag fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <List dense>
                                                    {order.items.slice(0, 3).map((item, idx) => (
                                                        <ListItem key={idx} disableGutters>
                                                            <ListItemText
                                                                primary={item.name}
                                                                secondary={`${item.quantity || 1} × $${item.price.toFixed(2)}`}
                                                            />
                                                            <Typography variant="body2" fontWeight="medium">
                                                                ${((item.quantity || 1) * item.price).toFixed(2)}
                                                            </Typography>
                                                        </ListItem>
                                                    ))}
                                                    
                                                    {order.items.length > 3 && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            +{order.items.length - 3} more items
                                                        </Typography>
                                                    )}
                                                </List>
                                                
                                                <Divider sx={{ my: 2 }} />
                                                
                                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle2">Total</Typography>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        ${order.total.toFixed(2)}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default AccountPage;