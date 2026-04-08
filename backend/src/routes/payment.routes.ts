import { Router } from 'express';
import Stripe from 'stripe';
import { db } from '../utils/database';
import { authenticate, AuthRequest } from '../middleware/auth.middleware';
import { body } from 'express-validator';
import { validate } from '../middleware/validation.middleware';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Create payment intent
router.post(
  '/create-intent',
  authenticate,
  validate([
    body('bookingId').notEmpty()
  ]),
  async (req: AuthRequest, res, next): Promise<void> => {
    try {
      const booking = db.findById('bookings', req.body.bookingId);

      if (!booking) {
        res.status(404).json({ error: 'Booking not found' });
        return;
      }

      if (booking.userId !== req.user!.id) {
        res.status(403).json({ error: 'Unauthorized' });
        return;
      }

      const payment = db.findOne('payments', { bookingId: booking.id });

      if (payment?.status === 'COMPLETED') {
        res.status(400).json({ error: 'Payment already completed' });
        return;
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(Number(booking.totalPrice) * 100),
        currency: 'usd',
        metadata: {
          bookingId: booking.id,
          userId: req.user!.id,
          vehicleId: booking.vehicleId
        }
      });

      if (payment) {
        db.update('payments', payment.id, {
          stripePaymentId: paymentIntent.id
        });
      }

      res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      next(error);
    }
  }
);

// Confirm payment
router.post(
  '/confirm',
  authenticate,
  validate([
    body('paymentIntentId').notEmpty()
  ]),
  async (req: AuthRequest, res, next) => {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(req.body.paymentIntentId);

      if (paymentIntent.status === 'succeeded') {
        const payments = db.findAll('payments');
        const payment = payments.find(p => p.stripePaymentId === paymentIntent.id);

        if (payment) {
          db.update('payments', payment.id, {
            status: 'COMPLETED',
            paidAt: new Date().toISOString()
          });

          db.update('bookings', payment.bookingId, { status: 'CONFIRMED' });

          const booking = db.findById('bookings', payment.bookingId);

          if (booking) {
            db.create('notifications', {
              userId: booking.userId,
              title: 'Payment Successful',
              message: 'Your payment has been processed successfully. Your booking is confirmed.',
              type: 'PAYMENT',
              isRead: false
            });
          }
        }

        res.json({ success: true, message: 'Payment confirmed' });
      } else {
        res.status(400).json({ error: 'Payment not successful' });
      }
    } catch (error: any) {
      next(error);
    }
  }
);

// Webhook for Stripe events
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const payments = db.findAll('payments');
      const payment = payments.find(p => p.stripePaymentId === paymentIntent.id);

      if (payment && payment.status !== 'COMPLETED') {
        db.update('payments', payment.id, {
          status: 'COMPLETED',
          paidAt: new Date().toISOString()
        });

        db.update('bookings', payment.bookingId, { status: 'CONFIRMED' });
      }
    }

    res.json({ received: true });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
