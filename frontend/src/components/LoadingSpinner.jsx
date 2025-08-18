import { Box, CircularProgress, Typography } from "@mui/material";

const LoadingSpinner = ({ message = "Loading..." }) => {
    return (
        <Box 
            sx={{ 
                minHeight: '100vh',
                backgroundColor: '#f8fafc',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2
            }}
        >
            <CircularProgress 
                size={48} 
                sx={{ 
                    color: '#10b981' 
                }} 
            />
            <Typography 
                variant="h6" 
                sx={{ 
                    color: '#1e293b',
                    fontWeight: 500
                }}
            >
                {message}
            </Typography>
        </Box>
    );
};

export default LoadingSpinner;
