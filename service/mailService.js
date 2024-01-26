const nodemailer = require("nodemailer");
const cron = require('node-cron');
const crypto = require('crypto');

// Generate a unique campaign ID
function generateCampaignId() {
  const uniqueString = `${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
  const campaignId = crypto.createHash('sha256').update(uniqueString).digest('hex');
  return campaignId;
}

// Example usage of generateCampaignId
const campaignId = generateCampaignId();
console.log(campaignId);

async function sendMail(subject, toEmail, otpText, email, appPassword, dateInfo, id) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: appPassword,
    },
  });

  const Server =  process.env.NEXT_PUBLIC_URL;
  const htmlBody = '<p>' + otpText + '</p>' + '<img src = "' + Server + '/api/track/?Id=' + id + '" >';
  console.log(htmlBody);

  const { day, month, date, hours, minutes, seconds } = dateInfo;
  console.log(day, month, date, hours, minutes, seconds);

  // Define a cron expression based on the date and time information
  const cronExpression = `${seconds} ${minutes} ${hours} ${date} ${month} ${day}`;

  // Schedule the email to be sent at the specified time
  cron.schedule(cronExpression, function () {
    console.log('---------------------');
    console.log('Running Cron Process');

    var mailOptions = {
      from: email,
      to: toEmail,
      subject: subject,
      html: htmlBody,
    };

    // Delivering mail with sendMail method
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  });
}

// Export the sendMail function if needed
module.exports = { sendMail, generateCampaignId };
