/**
 * Stripe Tool
 *
 * Payment processing and subscription management for:
 * - Client billing
 * - Invoice generation
 * - Payment tracking
 * - Subscription management
 */

import Stripe from 'stripe';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const CustomerSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  phone: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const SubscriptionSchema = z.object({
  customerId: z.string(),
  priceId: z.string(),
  metadata: z.record(z.string()).optional(),
});

export const PaymentIntentSchema = z.object({
  amount: z.number().min(100), // minimum 1 TL (100 kurus)
  currency: z.string().default('try'),
  customerId: z.string().optional(),
  description: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export type Customer = z.infer<typeof CustomerSchema>;
export type Subscription = z.infer<typeof SubscriptionSchema>;
export type PaymentIntent = z.infer<typeof PaymentIntentSchema>;

// Price IDs for services (configure in Stripe dashboard)
export const SERVICE_PRICES = {
  starter_monthly: 'price_starter_monthly',
  growth_monthly: 'price_growth_monthly',
  premium_monthly: 'price_premium_monthly',
  starter_annual: 'price_starter_annual',
  growth_annual: 'price_growth_annual',
  premium_annual: 'price_premium_annual',
} as const;

/**
 * Create a new customer
 */
export async function createCustomer(data: Customer): Promise<Stripe.Customer> {
  const validated = CustomerSchema.parse(data);

  try {
    const customer = await stripe.customers.create({
      email: validated.email,
      name: validated.name,
      phone: validated.phone,
      metadata: validated.metadata,
    });

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
}

/**
 * Get customer by ID
 */
export async function getCustomer(customerId: string): Promise<Stripe.Customer | null> {
  try {
    const customer = await stripe.customers.retrieve(customerId);

    if (customer.deleted) {
      return null;
    }

    return customer as Stripe.Customer;
  } catch (error) {
    console.error('Error getting customer:', error);
    throw error;
  }
}

/**
 * Update customer
 */
export async function updateCustomer(
  customerId: string,
  data: Partial<Customer>
): Promise<Stripe.Customer> {
  try {
    const customer = await stripe.customers.update(customerId, {
      email: data.email,
      name: data.name,
      phone: data.phone,
      metadata: data.metadata,
    });

    return customer;
  } catch (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

/**
 * List customers
 */
export async function listCustomers(
  options: { limit?: number; email?: string } = {}
): Promise<Stripe.Customer[]> {
  try {
    const params: Stripe.CustomerListParams = {
      limit: options.limit || 20,
    };

    if (options.email) {
      params.email = options.email;
    }

    const customers = await stripe.customers.list(params);
    return customers.data as Stripe.Customer[];
  } catch (error) {
    console.error('Error listing customers:', error);
    throw error;
  }
}

/**
 * Create a subscription
 */
export async function createSubscription(
  data: Subscription
): Promise<Stripe.Subscription> {
  const validated = SubscriptionSchema.parse(data);

  try {
    const subscription = await stripe.subscriptions.create({
      customer: validated.customerId,
      items: [{ price: validated.priceId }],
      metadata: validated.metadata,
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    return subscription;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
}

/**
 * Get subscription
 */
export async function getSubscription(
  subscriptionId: string
): Promise<Stripe.Subscription> {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Error getting subscription:', error);
    throw error;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  atPeriodEnd: boolean = true
): Promise<Stripe.Subscription> {
  try {
    let subscription: Stripe.Subscription;

    if (atPeriodEnd) {
      subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });
    } else {
      subscription = await stripe.subscriptions.cancel(subscriptionId);
    }

    return subscription;
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw error;
  }
}

/**
 * Create payment intent
 */
export async function createPaymentIntent(
  data: PaymentIntent
): Promise<{
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  status: string;
}> {
  const validated = PaymentIntentSchema.parse(data);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(validated.amount * 100), // Convert to kurus
      currency: validated.currency,
      customer: validated.customerId,
      description: validated.description,
      metadata: validated.metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret!,
      paymentIntentId: paymentIntent.id,
      amount: validated.amount,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}

/**
 * Confirm payment
 */
export async function confirmPayment(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw error;
  }
}

/**
 * Create invoice
 */
export async function createInvoice(
  customerId: string,
  options: {
    description?: string;
    items?: { priceId: string; quantity?: number }[];
    daysUntilDue?: number;
  } = {}
): Promise<Stripe.Invoice> {
  try {
    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      description: options.description,
      days_until_due: options.daysUntilDue || 7,
      auto_advance: true,
      collection_method: 'send_invoice',
    });

    // Add items if provided
    if (options.items && options.items.length > 0) {
      for (const item of options.items) {
        await stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          price: item.priceId,
          quantity: item.quantity || 1,
        });
      }
    }

    // Finalize and send
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(finalizedInvoice.id);

    return finalizedInvoice;
  } catch (error) {
    console.error('Error creating invoice:', error);
    throw error;
  }
}

/**
 * Get invoice
 */
export async function getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId);
    return invoice;
  } catch (error) {
    console.error('Error getting invoice:', error);
    throw error;
  }
}

/**
 * List invoices for customer
 */
export async function listInvoices(
  customerId: string,
  options: { limit?: number; status?: string } = {}
): Promise<Stripe.Invoice[]> {
  try {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: options.limit || 20,
      status: options.status as Stripe.InvoiceListParams.Status | undefined,
    });

    return invoices.data;
  } catch (error) {
    console.error('Error listing invoices:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_WEBHOOK_SECRET
    );
    return event;
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    throw error;
  }
}

/**
 * Get payment methods for customer
 */
export async function getPaymentMethods(
  customerId: string
): Promise<Stripe.PaymentMethod[]> {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    return paymentMethods.data;
  } catch (error) {
    console.error('Error getting payment methods:', error);
    throw error;
  }
}

/**
 * Create customer portal session
 */
export async function createPortalSession(
  customerId: string,
  returnUrl: string
): Promise<{ url: string }> {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Error creating portal session:', error);
    throw error;
  }
}

export default {
  createCustomer,
  getCustomer,
  updateCustomer,
  listCustomers,
  createSubscription,
  getSubscription,
  cancelSubscription,
  createPaymentIntent,
  confirmPayment,
  createInvoice,
  getInvoice,
  listInvoices,
  verifyWebhookSignature,
  getPaymentMethods,
  createPortalSession,
  SERVICE_PRICES,
};
