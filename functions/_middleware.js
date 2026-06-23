// functions/_middleware.js
// Pide contraseña antes de dejar ver el sitio.
export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);

  if (url.pathname === '/login' && request.method === 'POST') {
    const form = await request.formData();
    const pass = form.get('password');
    if (pass === env.CLAVE_ACCESO) {
      return new Response(null, {
        status: 302,
        headers: {
          'Set-Cookie': `zbx_auth=${env.CLAVE_ACCESO}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=43200`,
          'Location': '/'
        }
      });
    }
    return pantallaLogin('Contraseña incorrecta. Intenta de nuevo.');
  }

  const cookie = request.headers.get('Cookie') || '';
  const autenticado = cookie.includes(`zbx_auth=${env.CLAVE_ACCESO}`);
  if (autenticado) return next();
  return pantallaLogin('');
}

function pantallaLogin(mensaje) {
  const html = `<!DOCTYPE html><html lang="es"><head>
    <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Acceso · Dashboard Comercial Zubex</title>
    <style>
      body{font-family:system-ui,Segoe UI,Arial,sans-serif;background:#0f172a;color:#e2e8f0;
        display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0}
      .card{background:#1e293b;padding:40px;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,.4);
        width:90%;max-width:360px;text-align:center}
      h1{font-size:20px;margin:0 0 4px} p.sub{color:#94a3b8;font-size:13px;margin:0 0 24px}
      input{width:100%;padding:12px;border-radius:8px;border:1px solid #334155;background:#0f172a;
        color:#e2e8f0;font-size:15px;box-sizing:border-box;margin-bottom:12px}
      button{width:100%;padding:12px;border:0;border-radius:8px;background:#3b82f6;color:#fff;
        font-size:15px;font-weight:600;cursor:pointer}
      button:hover{background:#2563eb}
      .err{color:#f87171;font-size:13px;margin-bottom:12px;min-height:16px}
    </style></head><body>
    <div class="card">
      <h1>Dashboard Comercial Zubex</h1>
      <p class="sub">Acceso restringido</p>
      <div class="err">${mensaje}</div>
      <form method="POST" action="/login">
        <input type="password" name="password" placeholder="Contraseña" autofocus required>
        <button type="submit">Entrar</button>
      </form>
    </div></body></html>`;
  return new Response(html, {
    status: 401,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
