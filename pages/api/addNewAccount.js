import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


export default async function handler(req, res) {

      const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: ['openid', 'email', 'profile', 'https://www.googleapis.com/auth/gmail.readonly'],
        prompt: 'consent', // Force consent to ensure we always get a refresh token
      });
      console.log("4")
      res.status(200).json({ url: authUrl });
    
}
