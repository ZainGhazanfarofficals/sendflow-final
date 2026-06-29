import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {

  const { method } = req;

  console.log("POST Request Accepted");

  if (method === 'POST') {
    // Extract only the fields Prisma knows about and map `mail` -> `user`
    const {
      mail,
      schedulingData,
      ...rest
    } = await req.json();

    const data = {
      ...rest,
      user: mail, // store the user identifier under the expected field
      schedulingData: JSON.stringify(schedulingData),
    };
    console.log(data);
    
    try {
      const campaign = await prisma.campaign.create({ data });
      return NextResponse.json({ message: 'Campaign Created', campaign }, { status: 200 });
    } catch (error) {
      console.error('Error creating campaign:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
}



export async function GET(req) {
  let {url} = await req;

  const urlParts = url.split('?');
  if (urlParts.length !== 2) {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
  }

  const queryParams = new URLSearchParams(urlParts[1]);
  const mail = queryParams.get('variableName');
console.log(mail);
    try {

      // Use the userEmail for filtering campaigns
      const campaigns = await prisma.campaign.findMany({ where: { user: mail } });
      console.log(campaigns);
      return NextResponse.json({ campaigns });
    } catch (error) {
      console.error('Error fetching:', error); // Log the error for debugging
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}


export async function DELETE(req) {
  const { method, url } = req;

  if (method === 'DELETE') {
    const urlParts = url.split('?');
    if (urlParts.length !== 2) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const queryParams = new URLSearchParams(urlParts[1]);
    const id = queryParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Campaign ID is required' }, { status: 400 });
    }
    console.log(id);

    try {
      
      await prisma.campaign.delete({ where: { id } });
      return NextResponse.json({ message: 'Campaign deleted' }, { status: 200 });
    } catch (error) {
      console.error('Error deleting campaign:', error); // Log the error for debugging
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }
}
