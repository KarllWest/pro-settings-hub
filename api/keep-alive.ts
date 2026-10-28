/**
 * Vercel Cron target (see vercel.json): one tiny read a day so the free Supabase project
 * never hits the 7-day inactivity pause.
 */
export async function GET(request: Request) {
  // When CRON_SECRET is set, Vercel sends it as a bearer token; reject anyone else.
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return Response.json({ ok: false, error: 'Supabase env vars missing' }, { status: 500 });

  const res = await fetch(`${url}/rest/v1/teams?select=id&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  return Response.json({ ok: res.ok, status: res.status, at: new Date().toISOString() }, { status: res.ok ? 200 : 502 });
}
