import prisma from '@/lib/prisma';


export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      const entry = await prisma.entry.findUnique({ where: { id } });
      return res.json(entry);

    case 'PUT':
      const updatedEntry = await prisma.entry.update({ where: { id }, data: req.body });
      return res.json(updatedEntry);

    case 'DELETE':
      await prisma.entry.delete({ where: { id } });
      return res.status(200).end();

    default:
      return res.status(400).end();
  }
}
