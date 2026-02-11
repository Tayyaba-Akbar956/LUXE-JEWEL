// Mock payment service for LuxeJewel e-commerce platform
// This simulates payment processing without integrating with real payment gateways

interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  receipt_email?: string;
}

interface PaymentResult {
  id: string;
  status: 'succeeded' | 'failed' | 'processing';
  amount: number;
  currency: string;
  receipt_url?: string;
  error?: string;
}

// Simulate payment processing
export async function processMockPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate a mock payment ID
  const paymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
  
  // For demo purposes, we'll simulate a successful payment
  // In a real implementation, you might want to allow users to simulate failures too
  const isSuccess = Math.random() > 0.1; // 90% success rate for demo
  
  if (isSuccess) {
    return {
      id: paymentId,
      status: 'succeeded',
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      receipt_url: `https://example.com/receipt/${paymentId}`,
    };
  } else {
    return {
      id: paymentId,
      status: 'failed',
      amount: paymentDetails.amount,
      currency: paymentDetails.currency,
      error: 'Insufficient funds',
    };
  }
}

// Mock function to create a payment intent (similar to Stripe)
export async function createMockPaymentIntent(
  amount: number, 
  currency: string, 
  receipt_email?: string
): Promise<{ client_secret: string; id: string }> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const paymentIntentId = `pi_${Math.random().toString(36).substr(2, 9)}`;
  const clientSecret = `${paymentIntentId}_secret_${Math.random().toString(36).substr(2, 24)}`;
  
  return {
    id: paymentIntentId,
    client_secret: clientSecret,
  };
}

// Mock function to confirm a payment
export async function confirmMockPayment(
  paymentIntentId: string,
  paymentMethodId: string
): Promise<PaymentResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate a mock payment ID
  const paymentId = `pay_${Math.random().toString(36).substr(2, 9)}`;
  
  // Simulate success/failure
  const isSuccess = Math.random() > 0.05; // 95% success rate
  
  if (isSuccess) {
    return {
      id: paymentId,
      status: 'succeeded',
      amount: 0, // Would normally get from payment intent
      currency: 'usd',
      receipt_url: `https://example.com/receipt/${paymentId}`,
    };
  } else {
    return {
      id: paymentId,
      status: 'failed',
      amount: 0,
      currency: 'usd',
      error: 'Payment declined by issuer',
    };
  }
}