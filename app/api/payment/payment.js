// pages/api/payment.js

import { getSession } from 'next-auth/react';
import { stripe } from '../../utils/stripe'; // Initialize Stripe with your API keys
import { createOrder } from '../../../models/orders';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Method not allowed
  }

  const session = await getSession({ req });

  try {
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // Save order details to MongoDB
    const order = await createOrder({
      userId: session?.user?.id,
      amount: paymentIntent.amount,
      paymentIntentId: paymentIntent.id,
      // Add more order details as needed
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret, orderId: order._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment failed' });
  }
};
