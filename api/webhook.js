import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// La vérification de signature Stripe a besoin des octets bruts de la requête,
// donc on désactive le body parsing automatique de Vercel pour cette route.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const signature = req.headers["stripe-signature"];
  const rawBody = await readRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Signature webhook Stripe invalide", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const { data: lineItems } = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ["data.price"],
    });

    const items = lineItems.map((line) => ({
      color: line.price.metadata.color,
      size: line.price.metadata.size,
      quantity: line.quantity,
    }));

    // TODO: transmettre la commande à 22Carbone (mail, tableau...) une fois le canal choisi.
    console.log("Nouvelle commande merch", {
      items,
      email: session.customer_details?.email,
      shipping:
        session.collected_information?.shipping_details ??
        session.shipping_details ??
        null,
    });
  }

  return res.status(200).json({ received: true });
}
