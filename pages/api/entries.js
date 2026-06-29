import prisma from '@/lib/prisma';


export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { url } = req;
    const urlParts = url.split('?');
    if (urlParts.length !== 2) {
      return res.status(400).json({ error: 'Invalid URL' });
    }

    const queryParams = new URLSearchParams(urlParts[1]);
    const mail = queryParams.get('acc');

    const entries = await prisma.entry.findMany({ where: { userId: mail } });

    return res.json(entries);
  }

  if (req.method === 'POST') {
    const { email, password, acc } = req.body;
    const entry = await prisma.entry.create({ data: { email, appPassword: password, userId: acc } });
    return res.json(entry);
  }

  return res.status(405).end();
}
