export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { api_key, produto_id, documento } = req.body;

    if (!api_key || !produto_id || !documento) {
      return res.status(400).json({ error: 'api_key, produto_id e documento sao obrigatorios' });
    }

    const checkcredResponse = await fetch('https://api.checkcred.com.br/api/v1/consultas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${api_key}`,
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://app.checkcred.com.br',
        'Referer': 'https://app.checkcred.com.br/',
      },
      body: JSON.stringify({
        produtoId: String(produto_id),
        dados: { documento: String(documento).replace(/\D/g, '') },
        aguardar: true,
      }),
    });

    const data = await checkcredResponse.text();

    return res.status(checkcredResponse.status).setHeader('Content-Type', 'application/json').send(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
