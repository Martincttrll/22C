import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const COLORS = ["noir", "blanc"];
const SIZES = ["S", "M", "L", "XL"];
const MAX_QUANTITY_PER_ITEM = 10;

const lookupKey = (color, size) => `araignee_${color}_${size.toLowerCase()}`;

function parseItems(items) {
  if (!Array.isArray(items) || items.length === 0) return null;

  const merged = new Map();

  for (const item of items) {
    const { color, size, quantity } = item ?? {};

    if (!COLORS.includes(color) || !SIZES.includes(size)) return null;
    if (!Number.isInteger(quantity) || quantity < 1) return null;

    const key = lookupKey(color, size);
    const total = (merged.get(key)?.quantity ?? 0) + quantity;
    if (total > MAX_QUANTITY_PER_ITEM) return null;

    merged.set(key, { color, size, quantity: total });
  }

  return merged;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const items = parseItems(req.body?.items);

  if (!items) {
    return res.status(400).json({ error: "Panier invalide." });
  }

  const origin = req.headers.origin || `https://${req.headers.host}`;

  try {
    // Stripe accepte 10 lookup_keys max par requête.
    const { data: prices } = await stripe.prices.list({
      lookup_keys: [...items.keys()],
      active: true,
      limit: 10,
    });

    const priceByKey = new Map(prices.map((price) => [price.lookup_key, price]));

    const unavailable = [...items].filter(([key]) => !priceByKey.has(key));
    if (unavailable.length) {
      const labels = unavailable.map(([, { color, size }]) => `${color} / ${size}`);
      return res.status(409).json({
        error: `Plus disponible : ${labels.join(", ")}. Retire-les du panier pour continuer.`,
      });
    }

    const line_items = [...items].map(([key, { quantity }]) => ({
      price: priceByKey.get(key).id,
      quantity,
    }));

    const summary = [...items.values()]
      .map(({ color, size, quantity }) => `${color}/${size} ×${quantity}`)
      .join(", ");

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      shipping_address_collection: {
        allowed_countries: ["FR", "BE", "CH", "LU"],
      },
      custom_text: {
        submit: { message: `Tailles : ${summary}` },
      },
      metadata: { items: summary },
      // Les metadata de la session ne sont pas recopiées sur le PaymentIntent.
      payment_intent_data: {
        description: `T-shirt Araignée — ${summary}`,
        metadata: { items: summary },
      },
      success_url: `${origin}/merch/?success=1`,
      cancel_url: `${origin}/merch/?canceled=1`,
    });

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Erreur création session Stripe", error);
    return res.status(500).json({ error: "Impossible de créer la session de paiement." });
  }
}
