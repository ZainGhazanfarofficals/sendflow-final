import Entry from '@/models/Entries';
import { connectMongoDB } from '@/lib/mongodb';


export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  await connectMongoDB();

  switch (method) {
    case 'GET':
      const entry = await Entry.findById(id);
      return res.json(entry);

    case 'PUT':
      const updatedEntry = await Entry.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      return res.json(updatedEntry);

    case 'DELETE':
      await Entry.findByIdAndDelete(id);
      return res.status(200).end();

    default:
      return res.status(400).end();
  }
}
