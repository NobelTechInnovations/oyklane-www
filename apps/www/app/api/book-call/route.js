import { API_URL } from "../../components/site";

/** The Book a call form → the API (server to server, so the API's
 * browser-origin check doesn't apply), which emails the support inbox. */
export async function POST(request) {
  let body = null;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send the form again." }, { status: 400 });
  }
  try {
    const res = await fetch(`${API_URL}/api/public/setup-call`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json().catch(() => ({}));
    return Response.json(data, { status: res.status });
  } catch {
    return Response.json({ error: "Couldn't send your request. Message us on WhatsApp instead." }, { status: 502 });
  }
}
