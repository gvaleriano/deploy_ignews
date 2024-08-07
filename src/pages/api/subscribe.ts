import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from 'next-auth/client';

import { query as q } from 'faunadb';
import { fauna } from '../../services/fauna';
//import { stripe } from '../../services/stripe';

interface User {
  ref: {
    id: string;
  },
  data: { stripe_customer_id: string };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (request: NextApiRequest, response: NextApiResponse) => {
  if (request.method === 'POST') {
    const session = await getSession({ req: request });

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          q.Casefold(session.user.email)
        )
      )
    )

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = {id: "cus_NffrFeUfNV2Hib", email : "jennyrosen@example.com"}/*await stripe.customers.create({
        email: session.user.email,
      })*/

      await fauna.query(
        q.Update(
          q.Ref(
            q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id,
            },
          })
      );

      customerId = stripeCustomer.id;
    }

    const stripeCheckoutSession = {
      id: "cs_test_a11YYufWQzNY63zpQ6QSNRQhkUpVph4WRmzW0zWJO2znZKdVujZ0N0S22u",
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1JdL3qHZMnT8Ufl5y8o9tysR',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    } /*await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      line_items: [
        {
          price: 'price_1JdL3qHZMnT8Ufl5y8o9tysR',
          quantity: 1,
        },
      ],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });*/

    return response.status(200).json({ sessionId: stripeCheckoutSession.id });

  } else {
    response.setHeader('Allow', 'POST')
    response.status(405).end('Method Not Allowed')
  }
};

