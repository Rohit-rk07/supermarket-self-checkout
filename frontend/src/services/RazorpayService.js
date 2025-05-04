// frontend/src/services/RazorpayService.js
import Razorpay from 'razorpay';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const initializeRazorpayPayment = async (orderDetails) => {
  // Load the Razorpay script
  const scriptLoaded = await loadRazorpayScript();
  if (!scriptLoaded) {
    throw new Error('Razorpay SDK failed to load');
  }

  // Create payment options
  const options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY', // Replace with your key
    amount: orderDetails.amount * 100, // Razorpay expects amount in paise
    currency: orderDetails.currency || 'INR',
    name: 'Supermarket Checkout',
    description: 'Purchase Payment',
    order_id: orderDetails.orderId, // This comes from the backend
    handler: orderDetails.handler,
    prefill: {
      name: orderDetails.customerName || '',
      email: orderDetails.customerEmail || '',
      contact: orderDetails.customerPhone || ''
    },
    notes: {
      address: 'Self Checkout System'
    },
    theme: {
      color: '#1976d2', // Match your primary color
    }
  };

  // Create Razorpay instance and open payment modal
  const razorpay = new window.Razorpay(options);
  razorpay.open();
  
  return razorpay;
};