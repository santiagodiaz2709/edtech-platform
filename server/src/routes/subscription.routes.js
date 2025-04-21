   const express = require('express');
   const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
   const { auth } = require('../middleware/auth.middleware');

   const router = express.Router();

   // Create a subscription
   router.post('/create', auth, async (req, res) => {
     try {
       const { paymentMethodId, planType } = req.body;

       // Set price based on plan type
       const priceId = planType === 'yearly' 
         ? 'price_yearly_xxx' // Replace with actual Stripe price ID
         : 'price_monthly_xxx'; // Replace with actual Stripe price ID

       let customer;
       
       if (req.user.subscription.stripeCustomerId) {
         customer = await stripe.customers.retrieve(req.user.subscription.stripeCustomerId);
       } else {
         customer = await stripe.customers.create({
           email: req.user.email,
           payment_method: paymentMethodId,
           invoice_settings: {
             default_payment_method: paymentMethodId,
           },
         });

         req.user.subscription.stripeCustomerId = customer.id;
         await req.user.save();
       }

       // Create the subscription
       const subscription = await stripe.subscriptions.create({
         customer: customer.id,
         items: [{ price: priceId }],
         payment_behavior: 'default_incomplete',
         expand: ['latest_invoice.payment_intent'],
       });

       req.user.subscription.stripeSubscriptionId = subscription.id;
       req.user.subscription.status = 'active';
       req.user.subscription.plan = planType;
       await req.user.save();

       res.json({
         subscriptionId: subscription.id,
         clientSecret: subscription.latest_invoice.payment_intent.client_secret,
       });
     } catch (error) {
       console.error('Subscription error:', error);
       res.status(500).json({ message: 'Error creating subscription' });
     }
   });

   // Cancel subscription
   router.post('/cancel', auth, async (req, res) => {
     try {
       if (!req.user.subscription.stripeSubscriptionId) {
         return res.status(400).json({ message: 'No active subscription' });
       }

       const subscription = await stripe.subscriptions.del(
         req.user.subscription.stripeSubscriptionId
       );

       req.user.subscription.status = 'cancelled';
       req.user.subscription.plan = 'none';
       await req.user.save();

       res.json({ message: 'Subscription cancelled' });
     } catch (error) {
       res.status(500).json({ message: 'Error cancelling subscription' });
     }
   });

   // Webhook handler for Stripe events
   router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
     const sig = req.headers['stripe-signature'];

     try {
       const event = stripe.webhooks.constructEvent(
         req.body,
         sig,
         process.env.STRIPE_WEBHOOK_SECRET
       );

       // Handle the event
       switch (event.type) {
         case 'invoice.payment_succeeded':
           const paymentSucceeded = event.data.object;
           // Update subscription status
           break;
         
         case 'invoice.payment_failed':
           const paymentFailed = event.data.object;
           // Handle failed payment
           break;
         
         case 'customer.subscription.deleted':
           const subscriptionDeleted = event.data.object;
           // Update user's subscription status
           break;
       }

       res.json({ received: true });
     } catch (error) {
       console.error('Webhook error:', error);
       res.status(400).send(`Webhook Error: ${error.message}`);
     }
   });

   module.exports = router;
