// functions/api/datos.js
// Recibe /api/datos, le agrega la clave secreta por detrás y consulta a Google.
export async function onRequest(context) {
  const env = context.env;
  const googleUrl = env.GOOGLE_API_URL
    + '?api=datos&token=' + encodeURIComponent(env.CLAVE_SECRETA);
  const resp = await fetch(googleUrl, { method: 'GET' });
  const texto = await resp.text();
  return new Response(texto, {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store'
    }
  });
}
