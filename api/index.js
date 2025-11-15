require('dotenv').config();
const express = require('express');
const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const app = express();
const ses = new SESClient({ region: process.env.AWS_REGION });

app.get('/send-test', async (_req, res) => {
  try {
    const params = {
      Source: process.env.SES_FROM_EMAIL,
      Destination: { ToAddresses: [process.env.TO_EMAIL] },
      Message: {
        Subject: { Data: 'SES Test: GW Swaps' },
        Body: { Text: { Data: 'Hello! This is a test email from your local API.' } }
      }
    };
    await ses.send(new SendEmailCommand(params));
    res.json({ ok: true, sentTo: process.env.TO_EMAIL });
  } catch (err) {
    console.error('SES error:', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

app.listen(process.env.PORT || 4000, () => {
  const port = process.env.PORT || 4000;
  console.log(`API running: http://localhost:${port}`);
  console.log(`Test it: curl http://localhost:${port}/send-test`);
});
