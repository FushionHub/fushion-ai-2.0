// Payment processing utilities for Paystack and Flutterwave

export interface PaymentData {
  amount: number;
  currency: 'USD' | 'NGN';
  email: string;
  plan: string;
  userId: string;
}

export interface PaymentResponse {
  success: boolean;
  reference?: string;
  message: string;
  data?: any;
}

// Paystack integration
export class PaystackPayment {
  private publicKey: string;
  private secretKey: string;

  constructor() {
    this.publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '';
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || '';
  }

  async initializePayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          amount: data.amount * 100, // Convert to kobo/cents
          currency: data.currency,
          reference: `fusion_${Date.now()}_${data.userId}`,
          metadata: {
            plan: data.plan,
            userId: data.userId,
          },
        }),
      });

      const result = await response.json();
      
      if (result.status) {
        return {
          success: true,
          reference: result.data.reference,
          message: 'Payment initialized successfully',
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Payment initialization failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  async verifyPayment(reference: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
        },
      });

      const result = await response.json();
      
      if (result.status && result.data.status === 'success') {
        return {
          success: true,
          message: 'Payment verified successfully',
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Verification error occurred',
      };
    }
  }
}

// Flutterwave integration
export class FlutterwavePayment {
  private publicKey: string;
  private secretKey: string;

  constructor() {
    this.publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '';
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || '';
  }

  async initializePayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: `fusion_${Date.now()}_${data.userId}`,
          amount: data.amount,
          currency: data.currency,
          customer: {
            email: data.email,
          },
          customizations: {
            title: 'Fusion AI 2.0',
            description: `Payment for ${data.plan} plan`,
          },
          meta: {
            plan: data.plan,
            userId: data.userId,
          },
        }),
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        return {
          success: true,
          reference: result.data.tx_ref,
          message: 'Payment initialized successfully',
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: result.message || 'Payment initialization failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
      };
    }
  }

  async verifyPayment(transactionId: string): Promise<PaymentResponse> {
    try {
      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transactionId}/verify`, {
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
        },
      });

      const result = await response.json();
      
      if (result.status === 'success' && result.data.status === 'successful') {
        return {
          success: true,
          message: 'Payment verified successfully',
          data: result.data,
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Verification error occurred',
      };
    }
  }
}

// Subscription plans
export const subscriptionPlans = {
  starter: {
    name: 'Starter',
    price: { USD: 9.99, NGN: 4500 },
    tokens: 1000,
    features: [
      'Basic AI Chat',
      'Image Generation (10/day)',
      'Text-to-Speech (Basic)',
      'Document Generation',
      'Email Support'
    ],
  },
  professional: {
    name: 'Professional',
    price: { USD: 29.99, NGN: 13500 },
    tokens: 5000,
    features: [
      'Advanced AI Chat',
      'Unlimited Image Generation',
      'Video Generation (5 min)',
      'Advanced Text-to-Speech',
      'Code Generation',
      'Face Swap Technology',
      'Priority Support'
    ],
    popular: true,
  },
  enterprise: {
    name: 'Enterprise',
    price: { USD: 99.99, NGN: 45000 },
    tokens: 25000,
    features: [
      'Enterprise AI Features',
      'Unlimited Everything',
      'Video Generation (3 hours)',
      'Advanced Voice Cloning',
      'Custom AI Models',
      'API Access',
      'White-label Options',
      '24/7 Support'
    ],
  },
  lifetime: {
    name: 'Lifetime Access',
    price: { USD: 499.99, NGN: 225000 },
    tokens: 100000,
    features: [
      'Lifetime Access',
      'All Enterprise Features',
      'Unlimited Usage',
      'Priority Updates',
      'VIP Support',
      'Custom Integrations'
    ],
  },
};

// Payment utilities
export const paystack = new PaystackPayment();
export const flutterwave = new FlutterwavePayment();

export const getTokensForPlan = (plan: string): number => {
  const planData = subscriptionPlans[plan as keyof typeof subscriptionPlans];
  return planData ? planData.tokens : 0;
};

export const formatCurrency = (amount: number, currency: 'USD' | 'NGN'): string => {
  const formatter = new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-NG', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount);
};