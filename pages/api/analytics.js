import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: 'id parameter is missing.' });
    }
    const trackingData = await prisma.emailTracking.findUnique({ where: { campid: id } });

    if (!trackingData) {
      return res.status(404).json({ error: 'Tracking data not found.' });
    }

    const analyticsData = {
      emailsSent: trackingData.sent,
      emailsOpened: trackingData.opens,
      replies: trackingData.replies,
    };

    res.status(200).json(analyticsData);
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
