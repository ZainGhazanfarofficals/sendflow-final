
import { connectMongoDB } from 'lib/mongodb';
import EmailTracking from 'models/EmailTracking';

await connectMongoDB();

export default async function handler(req, res) {
  try {
    // Log the request
    console.log(req.method, req.url);

    // Log the tracking event (email opened) based on the unique_email_id parameter
    const Id = req.url.split('=')[1];
    console.log(`id sent from ${Id} opened at ${new Date()}`);

        // Find or create a tracking record for the email
        let trackingRecord = await EmailTracking.findOne({ campid: Id });

        if (!trackingRecord) {
          // Create a new tracking record if it doesn't exist
          trackingRecord = new EmailTracking({ campid: Id, opens: 0 });
        }
    
        // Increment the opens count
        trackingRecord.opens += 1;
    
        // Save the tracking record
        await trackingRecord.save();

    // Respond with a 1x1 pixel image
    res.writeHead(200, { 'Content-Type': 'image/gif' });
    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=', 
      'base64'
    );
    res.end(pixel, 'binary');
  } catch (error) {
    console.error('Error handling tracking request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
