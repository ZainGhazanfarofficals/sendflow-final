import { simpleParser } from 'mailparser';
import Imap from 'imap';
import prisma from '@/lib/prisma';
import crypto from 'crypto';
import cron from 'node-cron';

// Maintain a Set to store processed email message IDs
const processedEmails = new Set();
let processingEmail = false; // Variable to track email processing

export default async function incomingEmailHandler(req, res) {

  try {
    // Retrieve email accounts and appPasswords from the Campaign model based on the req.query.mail (an array of email addresses)
    const { mail } = req.query;
    const mailList = Array.isArray(mail) ? mail : [mail];
    console.log(mailList);
    const campaigns = await prisma.campaign.findMany({
      where: { user: { in: mailList } },
    });


    if (!campaigns || campaigns.length === 0) {
      console.error('No campaigns found for the specified email addresses.');
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('No campaigns found for the specified email addresses');
      return;
    }

    const imapClients = [];

    // Configure IMAP clients for each email account
    campaigns.forEach((campaign) => {
      const { email, appPassword } = campaign;

      // IMAP configuration for each email account
      const imapConfig = {
        user: email,
        password: appPassword,
        host: 'imap.gmail.com',
        port: 993, // Use SSL port (993)
        tls: true,
        tlsOptions: {
          rejectUnauthorized: false, // Trust self-signed certificates
        },
        maxConnections: 1,
        // Enable TLS/SSL
      };

      // Create an IMAP client for each email account
      const imap = new Imap(imapConfig);

      imap.once('ready', () => {
        imap.openBox('INBOX', false, (err, mailbox) => {
          if (err) {
            console.error('Error opening mailbox for', email, err);
            return;
          }
          console.log(`Connected to mailbox for ${email}. Listening for incoming emails.`);

          // Handle new email messages with a delay
          imap.on('mail', () => {
            if (processingEmail) {
              return;
            }
            processingEmail = true;
            setTimeout(async () => {
              console.log(`Received a mail event for ${email}.`);
              const fetch = imap.seq.fetch(`${mailbox.messages.total}:${mailbox.messages.total}`, { bodies: '', struct: true, });

              fetch.on('message', (msg) => {
                msg.on('body', (stream) => {
                  simpleParser(stream, async (err, parsed) => {
                    if (err) {
                      console.error('Error parsing email:', err);
                      return;
                    }
                    const senderEmail = parsed.from.text;
                    const content = parsed.text;
                    const recipients = parsed.to.text;
                    const subject = parsed.subject; 

                    const cleanedSubject = subject.replace(/^Re:\s*/i, '');
                    const recipientMatch = recipients.match(/<([^>]+)>/);
                    const recipientEmail = recipientMatch ? recipientMatch[1] : recipients;

                    // Find the corresponding campaign using cleanedSubject and recipient's email
                    const campaign = await prisma.campaign.findFirst({
                      where: {
                        user: { in: mailList },
                        subject: cleanedSubject,
                        email: recipientEmail,
                      },
                    });
                  
                    if (!campaign) {
                      console.error(`Campaign not found for subject "${cleanedSubject}" and senderEmail "${recipientEmail}".`);
                      return;
                    }
                  
                    // Use the campaign._id as the campaignId
                    const campId = campaign.id;

                    // Generate a unique identifier (content hash) for the email content
                    const contentHash = crypto
                      .createHash('md5') // You can use a different hash algorithm if needed
                      .update(content)
                      .digest('hex');

                    // Combine sender email and content hash to create a unique identifier
                    const emailIdentifier = `${senderEmail}_${contentHash}`;

                    // Check if this email has already been processed
                    if (!processedEmails.has(emailIdentifier)) {

                        processedEmails.add(emailIdentifier);
                        console.log(processedEmails)
                      // If it doesn't exist, then store the reply in the database
                      const reply = await prisma.reply.create({
                        data: {
                          senderEmail,
                          content,
                          recipients,
                          user: mailList.join(","),
                        },
                      });
                      try {
                        console.log(`Email reply saved to the database for ${email}.`);
                        
                        await prisma.emailTracking.upsert({
                          where: { campid: campId },
                          update: { replies: { increment: 1 } },
                          create: { campid: campId, user: mailList[0] ?? "unknown", replies: 1, sent: 0, opens: 0 },
                        });
                        
                      } catch (error) {
                        console.error(`Error saving email reply to the database for ${email}:`, error);
                      }

                    } else {
                      console.log(`Email with the same sender, content, and userMail already exists for ${email}. Skipping save.`);
                    }
                  });
                });
              });

              fetch.once('end', () => {
                console.log(`No more emails to fetch for ${email}.`);
                processingEmail = false; // Reset email processing flag
              });
            }, 150000); // Adjust the delay (in milliseconds) as needed
          });

          imap.on('error', (error) => {
            console.error(`IMAP error for ${email}:`, error);
            setTimeout(() => {
                console.log(`Reconnecting to mailbox for ${email} after error.`);
                imap.connect();
              }, 3000); 
          });
        });
      });

      // Connect the IMAP client
      imap.connect();
      imapClients.push(imap);
    });

    if (req.method === 'GET') {
      try {
        // Retrieve replies for all specified email accounts
        const replies = await prisma.reply.findMany({ where: { user: { contains: mailList[0] ?? "" } } });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(replies));
      } catch (error) {
        console.error('Error retrieving email replies from the database:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
      }
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  } catch (error) {
    console.error('Error retrieving email accounts from the database:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
}
