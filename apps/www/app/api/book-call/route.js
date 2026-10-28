import { API_URL } from "../../components/site";

/** Times already booked — the form greys them out. Never cached. */
export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/public/setup-call/slots`, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    const data = await res.json().catch(() => ({}));
    return Response.json({ taken: Array.isArray(data.taken) ? data.taken : [] }, { headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ taken: [] }, { headers: { "cache-control": "no-store" } });
  }
}

/** The Book a call form → the API (server to server, so the API's
 * browser-origin check doesn't apply), which books the slot and emails the
 * support inbox. */
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
