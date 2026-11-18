export async function POST(req) {
  const body = await req.json();
  const r = await fetch(`${process.env.EMPIRE_API_URL}/api/bomb`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': process.env.EMPIRE_API_KEY },
    body: JSON.stringify(body),
  });
  return new Response(await r.text(), { status: r.status, headers: { 'content-type': 'application/json' } });
}
