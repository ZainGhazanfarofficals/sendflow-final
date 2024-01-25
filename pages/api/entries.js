import Entry from '@/models/Entries';
import { connectMongoDB } from '@/lib/mongodb';


export default async function handler(req, res) {


  await connectMongoDB();

  if (req.method === 'GET') {
    let {url} = await req;
    await connectMongoDB();
  
    const urlParts = url.split('?');
    if (urlParts.length !== 2) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }
  
    const queryParams = new URLSearchParams(urlParts[1]);
    const mail = queryParams.get('acc');

    const entries = await Entry.find({userId: mail});

    return res.json(entries);
  }

  if (req.method === 'POST') {
    const { email, password, acc } = req.body;
    const entry = new Entry({ email: email, appPassword: password, userId:acc });
    await entry.save();
    return res.json(entry);
  }
}
