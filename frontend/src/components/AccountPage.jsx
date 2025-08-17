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
    Badge,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse
} from "@mui/material";
import { 
    Person, 
    History, 
    Receipt, 
    ShoppingCart, 
    DateRange, 
    AttachMoney,
    ArrowBack,
    Phone,
    Logout,
    Print,
    ExpandMore,
    ExpandLess,
    Store,
    QrCode
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";

const AccountPage = () => {
    const { user, logout } = useAuth();
    const { orders, loading, error } = useOrders();
    const [activeTab, setActiveTab] = useState(0);
    const [selectedPurchase, setSelectedPurchase] = useState(null);
    const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
    const [expandedPurchase, setExpandedPurchase] = useState(null);
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

    const handlePurchaseClick = (purchase) => {
        setExpandedPurchase(expandedPurchase === purchase._id ? null : purchase._id);
    };

    const handlePrintReceipt = (purchase) => {
        setSelectedPurchase(purchase);
        setReceiptDialogOpen(true);
    };

    const printReceipt = () => {
        const receiptContent = document.getElementById('receipt-content');
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Purchase Receipt</title>
                    <style>
                        body { font-family: monospace; margin: 20px; }
                        .receipt { max-width: 300px; margin: 0 auto; }
                        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; }
                        .item { display: flex; justify-content: space-between; margin: 5px 0; }
                        .total { border-top: 2px solid #000; padding-top: 10px; font-weight: bold; }
                    </style>
                </head>
                <body>
                    ${receiptContent.innerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
        setReceiptDialogOpen(false);
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
                        <Store sx={{ fontSize: 32, color: 'white' }} />
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
                                        icon={<Receipt sx={{ mr: 1 }} />} 
                                        label="Purchase History" 
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
                        
                        {/* Purchase History Tab */}
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
                                    <Receipt sx={{ mr: 1, verticalAlign: "middle" }} />
                                    Purchase History
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
                                        <ShoppingCart sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
                                        <Typography variant="h6" gutterBottom>
                                            No Purchases Yet
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" paragraph>
                                            You haven't made any purchases yet.
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
                                            <Card key={order._id} sx={{ mb: 3, borderRadius: 2 }}>
                                                <CardContent>
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                                                        <Typography variant="h6" fontWeight="medium">
                                                            Purchase #{order._id.slice(-6).toUpperCase()}
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
                                                            <ShoppingCart fontSize="small" sx={{ mr: 0.5, color: "text.secondary" }} />
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
                                                    
                                                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                                        <Button 
                                                            variant="contained" 
                                                            onClick={() => handlePurchaseClick(order)} 
                                                            startIcon={<ExpandMore />}
                                                        >
                                                            View Details
                                                        </Button>
                                                        <Button 
                                                            variant="contained" 
                                                            onClick={() => handlePrintReceipt(order)} 
                                                            startIcon={<Print />}
                                                        >
                                                            Print Receipt
                                                        </Button>
                                                    </Box>
                                                    
                                                    <Collapse in={expandedPurchase === order._id} timeout="auto" unmountOnExit>
                                                        <CardContent sx={{ p: 2, pt: 0 }}>
                                                            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                                                Purchase Details
                                                            </Typography>
                                                            
                                                            <TableContainer>
                                                                <Table size="small">
                                                                    <TableHead>
                                                                        <TableRow>
                                                                            <TableCell>Item</TableCell>
                                                                            <TableCell align="right">Quantity</TableCell>
                                                                            <TableCell align="right">Price</TableCell>
                                                                            <TableCell align="right">Total</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {order.items.map((item, index) => (
                                                                            <TableRow key={index}>
                                                                                <TableCell>{item.name}</TableCell>
                                                                                <TableCell align="right">{item.quantity}</TableCell>
                                                                                <TableCell align="right">₹{item.price ? item.price.toFixed(2) : '0.00'}</TableCell>
                                                                                <TableCell align="right">₹{((item.quantity || 1) * (item.price || 0)).toFixed(2)}</TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </CardContent>
                                                    </Collapse>
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
                
                {/* Receipt Dialog */}
                <Dialog
                    open={receiptDialogOpen}
                    onClose={() => setReceiptDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Print Receipt</DialogTitle>
                    <DialogContent dividers>
                        {selectedPurchase && (
                            <div id="receipt-content" style={{ width: '300px', margin: '0 auto' }}>
                                <div className="header">
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                        Purchase Receipt
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {selectedPurchase._id.slice(-6).toUpperCase()}
                                    </Typography>
                                </div>
                                
                                <div className="items">
                                    {selectedPurchase.items && selectedPurchase.items.map((item, index) => (
                                        <div key={index} className="item">
                                            <Typography variant="body2">
                                                {item.name}
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                ₹{((item.quantity || 1) * (item.price || 0)).toFixed(2)}
                                            </Typography>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="total">
                                    <Typography variant="h6" fontWeight="bold">
                                        Total: ₹{selectedPurchase.total ? selectedPurchase.total.toFixed(2) : '0.00'}
                                    </Typography>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setReceiptDialogOpen(false)}>Cancel</Button>
                        <Button onClick={printReceipt} disabled={!selectedPurchase}>Print</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
};

export default AccountPage;