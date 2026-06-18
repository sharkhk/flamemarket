const ZIINA_BASE = "https://api.ziina.com/api";

export interface ZiinaPaymentIntent {
  amount: number;
  currency_code: "AED";
  message: string;
  success_url: string;
  cancel_url: string;
  test: boolean;
}

export interface ZiinaPaymentData {
  id: string;
  checkout_url: string;
  status: string;
}

export async function createPaymentIntent(
  payload: ZiinaPaymentIntent
): Promise<ZiinaPaymentData> {
  // Dev mock: skip Ziina and redirect straight to success
  if (process.env.USE_MOCK_DB === "true") {
    const mockId = `mock_pay_${Date.now()}`;
    // Simulate instant payment confirmation via success_url
    return {
      id: mockId,
      checkout_url: payload.success_url,
      status: "pending",
    };
  }

  const res = await fetch(`${ZIINA_BASE}/payment_intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.ZIINA_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Ziina error ${res.status}: ${err}`);
  }

  const json = await res.json();
  return json.data as ZiinaPaymentData;
}

export async function verifyWebhookSignature(
  body: string,
  signature: string
): Promise<boolean> {
  // In dev mode, always accept
  if (process.env.USE_MOCK_DB === "true") return true;

  const secret = process.env.ZIINA_WEBHOOK_SECRET!;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  );
  const sigBuffer = Buffer.from(signature, "hex");
  return crypto.subtle.verify("HMAC", key, sigBuffer, encoder.encode(body));
}
