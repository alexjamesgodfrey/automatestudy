/**
 * MAIN ROUTES
 */
const pool = require("../db.js");
const express = require('express')
const stripe = require('stripe');
 
const log4js = require("log4js");
log4js.configure({
    appenders: {
      everything: { type: 'file', filename: 'log.log' }
    },
    categories: {
      default: { appenders: [ 'everything' ], level: 'trace' }
    }
});
var logger = log4js.getLogger();


module.exports = function (app) {
    app.post('/api/stripewebhook', express.raw({type: '*/*'}), async (request, response) => {
        const sig = request.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(request.body, sig, process.env.STRIPE_SECRET);
        } catch (err) {
            response.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        switch (event.type) {
            case 'customer.created':
                const customer = event.data.object;
                console.log(customer)
                await fetch(`${process.env.BASE_REQUEST_URL}/api/users/stripecustomer`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        stripecustomer: customer,
                        email: customer.email
                    })
                })
                await fetch(`${process.env.BASE_REQUEST_URL}/api/users/stripecustomerid`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        stripecustomerid: customer.id,
                        email: customer.email
                    })
                })
                break;
            case 'customer.updated':
                const customerUpdate = event.data.object;
                console.log(customerUpdate)
                await fetch(`${process.env.BASE_REQUEST_URL}/api/users/stripecustomer`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        stripecustomer: customerUpdate,
                        email: customerUpdate.email
                    })
                })
                break;
            case 'customer.subscription.created':
                const subscription = event.data.object;
                console.log(subscription)
                await fetch(`${process.env.BASE_REQUEST_URL}/api/users/stripesubscription`, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        stripesubscription: subscription
                    })
                })
                const date = new Date()
                await fetch(`${process.env.BASE_REQUEST_URL}/api/history`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        body: JSON.stringify({
                            type: 'subscription',
                            message: `1 month subscription created for ${subscription.customer} at ${date.toISOString().substring(0, 10)}`
                        })
                    }
                })
                // Then define and call a function to handle the event customer.subscription.created
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

        // Return a 200 response to acknowledge receipt of the event
        response.send();
    })
}