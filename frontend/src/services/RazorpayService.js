// frontend/src/services/RazorpayService.js
// Note: Razorpay is loaded via the Checkout.js script and accessed as window.Razorpay

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
    key: orderDetails.key || (import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY'), // Prefer backend-provided key
    amount: orderDetails.amount, // Amount should already be in paise
    currency: orderDetails.currency || 'INR',
    name: 'Supermarket Checkout',
    description: 'Purchase Payment',
    order_id: orderDetails.orderId, // This comes from the backend
    handler: orderDetails.handler,
    modal: {
      ondismiss: function() {
        if (orderDetails.onFailure) {
          orderDetails.onFailure({ error: { description: 'Payment cancelled by user' } });
        }
      }
    },
    prefill: {
      name: orderDetails.customerName || '',
      email: orderDetails.customerEmail || '',
      contact: orderDetails.customerPhone || ''
    },
    notes: {
      address: 'Self Checkout System'
    },
    theme: {
      color: '#10b981', // Match your primary green color
    }
  };

  // Create Razorpay instance and open payment modal
  const razorpay = new window.Razorpay(options);
  
  // Handle payment failure
  razorpay.on('payment.failed', function (response) {
    if (orderDetails.onFailure) {
      orderDetails.onFailure(response);
    }
  });
  
  razorpay.open();
  
  return razorpay;
};