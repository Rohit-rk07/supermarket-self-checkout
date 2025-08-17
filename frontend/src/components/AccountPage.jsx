import { useState } from "react";
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Grid,
    Divider,
    Avatar,
    Chip,
    Tab,
    Tabs,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton,
    useTheme,
    useMediaQuery,
    Fab,
    Stack,
    Badge
} from "@mui/material";
import { 
    Person, 
    History, 
    ReceiptLong, 
    ShoppingBag, 
    DateRange, 
    AttachMoney,
    ArrowBack,
    Phone,
    Logout
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
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
        <Box sx={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4
        }}>
            <Container maxWidth="lg">
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', mr: 2, width: 56, height: 56 }}>
                        <Person sx={{ fontSize: 32, color: 'white' }} />
                    </Avatar>
                    <Typography 
                        variant="h3" 
                        fontWeight="bold" 
                        sx={{ 
                            color: 'white',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        My Account
                    </Typography>
                </Box>
                <Grid container spacing={3}>
                    {/* Sidebar */}
                    <Grid item xs={12} md={4} lg={3}>
                        <Card 
                            elevation={24}
                            sx={{ 
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                                <Avatar 
                                    sx={{ 
                                        width: 80, 
                                        height: 80, 
                                        bgcolor: theme.palette.primary.main,
                                        fontSize: 32,
                                        mb: 2,
                                        mx: 'auto'
                                    }}
                                >
                                    {user.name ? user.name[0].toUpperCase() : "U"}
                                </Avatar>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {user.name || "User"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    {user.email || user.phoneNumber}
                                </Typography>
                                
                                <Divider sx={{ my: 2 }} />
                                
                                <Tabs
                                    orientation="vertical"
                                    value={activeTab}
                                    onChange={handleTabChange}
                                    sx={{ 
                                        '& .MuiTab-root': {
                                            alignItems: 'flex-start',
                                            textAlign: 'left',
                                            minHeight: 48
                                        }
                                    }}
                                >
                                    <Tab 
                                        icon={<Person sx={{ mr: 1 }} />} 
                                        label="Profile" 
                                        iconPosition="start"
                                    />
                                    <Tab 
                                        icon={<History sx={{ mr: 1 }} />} 
                                        label="Order History" 
                                        iconPosition="start"
                                    />
                                </Tabs>
                                
                                <Button
                                    variant="contained"
                                    color="error"
                                    fullWidth
                                    startIcon={<Logout />}
                                    onClick={handleLogout}
                                    sx={{ 
                                        mt: 3,
                                        borderRadius: 2,
                                        py: 1.2
                                    }}
                                >
                                    Logout
                                </Button>
                            </CardContent>
                        </Card>
                </Grid>
                
                {/* Main Content */}
                <Grid item xs={12} md={8} lg={9}>
                    {/* Profile Tab */}
                    {activeTab === 0 && (
                        <Card 
                            elevation={24} 
                            sx={{ 
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
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
                                        {user.name || "Not set"}
                                    </Typography>
                                    
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Phone Number
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                                        <Phone sx={{ mr: 1, fontSize: 16, verticalAlign: 'middle' }} />
                                        {user.phoneNumber}
                                    </Typography>
                                    
                                    {user.email && (
                                        <>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Email Address
                                            </Typography>
                                            <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                                                {user.email}
                                            </Typography>
                                        </>
                                    )}
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Account Type
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium" sx={{ mb: 2 }}>
                                        Phone Authentication
                                    </Typography>
                                    
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Total Orders
                                    </Typography>
                                    <Typography variant="body1" fontWeight="medium">
                                        {loading ? <CircularProgress size={16} /> : orders.length}
                                    </Typography>
                                </Grid>
                            </Grid>
                            </CardContent>
                        </Card>
                    )}
                    
                    {/* Order History Tab */}
                    {activeTab === 1 && (
                        <Card 
                            elevation={24} 
                            sx={{ 
                                borderRadius: 4,
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                            }}
                        >
                            <CardContent sx={{ p: 4 }}>
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
                                                        Order #{order.orderNumber ? order.orderNumber : (order._id ? order._id.slice(-6).toUpperCase() : 'N/A')}
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
                                                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <AttachMoney fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            ₹{order.total ? order.total.toFixed(2) : '0.00'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                                        <ShoppingBag fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {order.items ? order.items.length : 0} {(order.items && order.items.length === 1) ? "item" : "items"}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                
                                                <Divider sx={{ mb: 2 }} />
                                                
                                                <List dense>
                                                    {(order.items || []).slice(0, 3).map((item, idx) => (
                                                        <ListItem key={idx} disableGutters>
                                                            <ListItemText
                                                                primary={item.name}
                                                                secondary={`${item.quantity || 1} × ₹${item.price ? item.price.toFixed(2) : '0.00'}`}
                                                            />
                                                            <Typography variant="body2" fontWeight="medium">
                                                                ₹{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                                                            </Typography>
                                                        </ListItem>
                                                    ))}
                                                    
                                                    {(order.items && order.items.length > 3) && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                            +{order.items.length - 3} more items
                                                        </Typography>
                                                    )}
                                                </List>
                                                
                                                <Divider sx={{ my: 2 }} />
                                                
                                                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                                    <Typography variant="subtitle2">Total</Typography>
                                                    <Typography variant="subtitle1" fontWeight="bold">
                                                        ₹{order.total ? order.total.toFixed(2) : '0.00'}
                                                    </Typography>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </List>
                            )}
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
            
            {/* Floating Back Button */}
            <Fab
                color="secondary"
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    left: 24,
                    background: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': {
                        background: 'rgba(255, 255, 255, 1)',
                    }
                }}
                onClick={() => navigate('/dashboard')}
            >
                <ArrowBack />
            </Fab>
        </Container>
        </Box>
    );
};

export default AccountPage;