// pages/api/payment.js

import { getSession } from 'next-auth/react';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

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

    // Save order details to PostgreSQL
    const order = await prisma.order.create({
      data: {
        userId: session?.user?.id ?? null,
        amount: paymentIntent.amount,
        paymentIntentId: paymentIntent.id,
      },
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret, orderId: order.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Payment failed' });
  }
};
