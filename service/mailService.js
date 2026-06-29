const nodemailer = require("nodemailer");
const cron = require('node-cron');

function buildEmailHtml(bodyText, serverUrl, campaignId) {
  // Convert plain newlines to <br> for plain-text bodies; preserve existing HTML.
  const hasHtmlTags = /<[a-z][\s\S]*>/i.test(bodyText);
  const formattedBody = hasHtmlTags ? bodyText : bodyText.replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Expert On Hire</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:32px 0;">
    <tr>
      <td align="center">

        <!-- Email container -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.10);">

          <!-- ── HEADER ── -->
          <tr>
            <td style="background-color:#111111;padding:24px 32px;text-align:center;">
              <img
                src="https://www.expertonhire.com/assets/Logo-Caf-teVO.png"
                alt="Expert On Hire"
                width="160"
                style="display:block;margin:0 auto;max-width:160px;height:auto;"
              />
            </td>
          </tr>

          <!-- ── ORANGE ACCENT BAR ── -->
          <tr>
            <td style="background-color:#F97316;height:4px;font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- ── BODY CONTENT ── -->
          <tr>
            <td style="padding:40px 40px 32px;color:#1a1a1a;font-size:15px;line-height:1.75;">
              ${formattedBody}
            </td>
          </tr>

          <!-- ── DIVIDER ── -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e5e5;margin:0;" />
            </td>
          </tr>

          <!-- ── FOOTER ── -->
          <tr>
            <td style="background-color:#111111;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;color:#F97316;font-weight:bold;letter-spacing:0.05em;">
                EXPERT ON HIRE
              </p>
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                You're receiving this email because someone reached out through Expert On Hire.
              </p>
              <p style="margin:8px 0 0;font-size:12px;color:#6b7280;">
                &copy; ${new Date().getFullYear()} Expert On Hire. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Email container -->

        <!-- Tracking pixel (invisible) -->
        <img src="${serverUrl}api/track/?Id=${campaignId}" width="1" height="1"
             style="display:none;width:1px;height:1px;" alt="" />

      </td>
    </tr>
  </table>

</body>
</html>`;
}

// Normalize dateInfo (UTC-based) and decide whether to send immediately or schedule.
// Expects numeric month (0-11) and day (0-6); also accepts 3-letter names.
function normalizeDateInfo(dateInfo) {
  if (!dateInfo) throw new Error('dateInfo missing for scheduling');

  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const toInt = (val) => (typeof val === 'string' ? parseInt(val, 10) : val);

  let {
    year,
    month,
    date,
    day,
    hours,
    minutes,
    seconds,
  } = dateInfo;

  // Handle month strings (Jan/Feb...) or numbers 1-12
  if (typeof month === 'string') {
    const idx = months.indexOf(month.slice(0,3).toLowerCase());
    month = idx >= 0 ? idx : null;
  } else if (month != null && month >= 1 && month <= 12) {
    month = month - 1; // convert 1-12 to 0-11
  }

  if (month == null || date == null || hours == null || minutes == null || seconds == null) {
    throw new Error('Incomplete dateInfo; expected month, date, hours, minutes, seconds');
  }

  // Convert numeric strings to numbers
  month = Number(month);
  date = toInt(date);
  day = day != null ? toInt(day) : undefined;
  hours = toInt(hours);
  minutes = toInt(minutes);
  seconds = toInt(seconds);
  year = year ? toInt(year) : new Date().getUTCFullYear();

  const targetUtc = Date.UTC(year, month, date, hours, minutes, seconds);
  return { targetUtc, year, month, date, day, hours, minutes, seconds };
}

async function sendMail(subject, toEmail, otpText, email, appPassword, dateInfo, id) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: appPassword,
    },
  });

  const Server = process.env.NEXT_PUBLIC_URL;
  const htmlBody = buildEmailHtml(otpText, Server, id);

  const { targetUtc, year, month, date, hours, minutes, seconds } = normalizeDateInfo(dateInfo);
  const nowUtc = Date.now();

  // If the scheduled time is in the past (or within 5s), send immediately.
  const MASKED_FROM = `"Expert On Hire" <${email}>`;

  if (targetUtc <= nowUtc + 5000) {
    const mailOptions = { from: MASKED_FROM, to: toEmail, subject, html: htmlBody };
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent immediately: ' + info.response);
      }
    });
  }

  // Build cron expression using numeric month (1-12) and UTC timezone.
  const cronExpression = `${seconds} ${minutes} ${hours} ${date} ${month + 1} *`;
  console.log(`Scheduling email for ${new Date(targetUtc).toISOString()} (cron: ${cronExpression} UTC)`);

  cron.schedule(cronExpression, function () {
    console.log('---------------------');
    console.log('Running Cron Process');

    const mailOptions = {
      from: MASKED_FROM,
      to: toEmail,
      subject: subject,
      html: htmlBody,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  }, { timezone: 'UTC' });
}

// Export the sendMail function if needed
module.exports = { sendMail };
