import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Correspondance taille -> Price Stripe. Jamais faire confiance à un prix envoyé par le
// client : seul ce mapping côté serveur décide du montant facturé.
const PRICE_IDS_BY_SIZE = {
  S: process.env.STRIPE_PRICE_TSHIRT_S,
  M: process.env.STRIPE_PRICE_TSHIRT_M,
  L: process.env.STRIPE_PRICE_TSHIRT_L,
  XL: process.env.STRIPE_PRICE_TSHIRT_XL,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { size } = req.body ?? {};
  const priceId = PRICE_IDS_BY_SIZE[size];

  if (!priceId) {
    return res.status(400).json({ error: "Taille invalide ou indisponible." });
  }

  const origin = req.headers.origin || `https://${req.headers.host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU"],
      },
      metadata: { size },
      success_url: `${origin}/merch/?success=1`,
      cancel_url: `${origin}/merch/?canceled=1`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Erreur création session Stripe", error);
    return res.status(500).json({ error: "Impossible de créer la session de paiement." });
  }
}
