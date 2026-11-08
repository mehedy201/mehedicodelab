---
title: Braintree Payment Integration: A Developer's Walkthrough
description: How a Braintree card payment works end to end: client token, Drop-in or Hosted Fields, server-side sale, webhooks and the mistakes to avoid. Includes a Node.js example.
date: 2026-10-06
category: Full-Stack
tags: Braintree, Payments, Node.js, Security
---
Adding card payments to a custom registration or checkout form sounds simple until you hit the details: tokens, nonces, errors, refunds and security. This is the flow I use for Braintree, and the places where projects most often go wrong.

> **Key takeaways**
> - Card data should never touch your server. Use Drop-in or Hosted Fields.
> - Create the charge **on the server**, never in the browser.
> - Handle failures and webhooks, not only the happy path.

## How the flow works

1. Your server asks Braintree for a **client token**.
2. The browser uses that token to load Drop-in UI or Hosted Fields.
3. The customer enters card details. They go straight to Braintree, and the browser receives a **payment method nonce**.
4. The browser sends only the nonce (and your own form data) to your server.
5. Your server creates the **transaction** with that nonce and tells the browser the result.

Because the card number never reaches your server, your compliance burden is much lower than if you handled raw card data. Confirm the exact requirements for your setup with your payment provider.

## Server code (Node.js)

```js
const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,   // use Production when you go live
  merchantId: process.env.BT_MERCHANT_ID,
  publicKey: process.env.BT_PUBLIC_KEY,
  privateKey: process.env.BT_PRIVATE_KEY,
});

// 1) give the browser a client token
app.get("/api/payments/token", async (req, res) => {
  const { clientToken } = await gateway.clientToken.generate({});
  res.json({ clientToken });
});

// 5) create the charge
app.post("/api/payments/checkout", async (req, res) => {
  const result = await gateway.transaction.sale({
    amount: "49.00",                       // calculate the amount on the server, never trust the browser
    paymentMethodNonce: req.body.nonce,
    options: { submitForSettlement: true },
  });
  if (!result.success) return res.status(402).json({ error: result.message });
  res.json({ id: result.transaction.id });
});
```

Keep keys in environment variables and out of your repository.

## Customizing a registration form

A common request is to combine sign-up and payment in one step. A reliable order is:

1. Validate the form fields.
2. Request the nonce from Braintree.
3. Create the user and the transaction in one server action.
4. If payment fails, do not leave a half-created account. Roll back or mark it as unpaid.

## Mistakes to avoid

- **Trusting the amount from the browser.** Always calculate it on the server.
- **Double charges.** Disable the button while processing and use a unique order reference.
- **Ignoring webhooks.** Settlements, disputes and subscription events arrive asynchronously.
- **Vague errors.** Show the customer a clear message and log the real reason on the server.
- **Skipping the sandbox.** Test successful, declined and error cases before going live.

## Test checklist

- Successful payment, declined card and expired card.
- Page refresh and double-click during payment.
- Slow network and a failed server response.
- Refund and, if needed, subscription cancellation.

Payment code is the last place for shortcuts. If you need Braintree, Stripe or another gateway integrated safely into a WordPress or React site, I can build and document it for you.
