const API_URL = 'http://localhost:3000/api';

async function verify() {
  console.log('--- Iniciando Verificación de Endpoints ---');

  try {
    // 1. Health check
    let res = await fetch(`${API_URL}/health`);
    let data = await res.json();
    console.log('[1/5] Health Check:', data.status === 'OK' ? '✅' : '❌', data.message);

    // 2. Login
    res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: 'demo@aloe.ulima.edu.pe', password: '123456' })
    });
    data = await res.json();
    console.log('[2/5] Login Demo User:', res.ok ? '✅' : '❌', data.message || data.error);
    if (!res.ok) throw new Error('Login falló');
    const demoUser = data.user;

    // 3. Obtener Posts
    res = await fetch(`${API_URL}/posts`);
    data = await res.json();
    console.log('[3/5] Obtener Posts:', res.ok ? '✅' : '❌', `${Array.isArray(data) ? data.length : 0} posts encontrados`);

    // 4. Obtener Grupos
    res = await fetch(`${API_URL}/groups`);
    data = await res.json();
    console.log('[4/5] Obtener Grupos:', res.ok ? '✅' : '❌', `${Array.isArray(data) ? data.length : 0} grupos encontrados`);

    // 5. Obtener Amigos del Demo User
    res = await fetch(`${API_URL}/friends/${demoUser.id}`);
    data = await res.json();
    console.log('[5/5] Obtener Amigos:', res.ok ? '✅' : '❌', 
      `${data.friends?.length || 0} amigos, ${data.sentRequests?.length || 0} enviadas, ${data.receivedRequests?.length || 0} recibidas`);

    console.log('--- Verificación Completada Exitosamente ---');
  } catch (err) {
    console.error('❌ Error durante la verificación:', err.message);
  }
}

verify();
