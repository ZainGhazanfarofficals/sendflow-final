import { connectMongoDB } from 'lib/mongodb';
import EmailTracking from 'models/EmailTracking';



export default async function handler(req, res) {
  try {
    const { mail } = req.query;
    console.log(mail)

    if (!mail) {
      return res.status(400).json({ error: 'mail parameter is missing.' });
    }
    await connectMongoDB();
    const trackingData = await EmailTracking.find({user: mail });

    if (!trackingData) {
      return res.status(404).json({ error: 'Tracking data not found.' });
    }

    let totalEmailsSent = 0;
    let totalEmailsOpened = 0;
    let totalReplies = 0;
    
    console.log(trackingData)
    trackingData.forEach((data) => {
        totalEmailsSent += data.sent;
        totalEmailsOpened += data.opens;
        totalReplies += data.replies;
      });

    const analyticsData = {
      totalEmailsSent,
      totalEmailsOpened,
      totalReplies,
    };
    console.log(analyticsData)

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
