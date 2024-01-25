
import Campaign from '@/models/campaign';
import { connectMongoDB } from '@/lib/mongodb';

export async function PUT(request, { params }) {
  const { id } = params;
  const { email, appPassword, subject, body } = await request.json();

  await connectMongoDB();

  try {
    // Assuming you have a Campaign model
    await Campaign.findByIdAndUpdate(id, { email, appPassword, subject, body });
    return { message: "Email updated" };
  } catch (error) {
    console.error("Error updating email:", error);
    return { error: "Internal Server Error" };
  }
}


export async function GET(req) {
  let {url} = await req;

  const urlParts = url.split('?');
  if (urlParts.length !== 2) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const queryParams = new URLSearchParams(urlParts[1]);
  const id = queryParams.get('campaignid');
  console.log("id",id);

  await connectMongoDB();

  try {
    // Assuming you have a Campaign model
    const emailData = await Campaign.findById(id);

    if (!emailData) {
      return { error: "Email not found" };
    }

    return emailData ;
  } catch (error) {
    console.error("Error fetching email:", error);
    return { error: "Internal Server Error" };
  }
}
