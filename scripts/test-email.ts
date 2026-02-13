/**
 * Email Test Script
 *
 * Run this script to test if your email configuration is working correctly.
 *
 * Usage: npx tsx scripts/test-email.ts
 */

import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables
dotenv.config();

async function testEmailConfiguration() {
  console.log('🧪 Testing Email Configuration...\n');

  // Check if all required environment variables are set
  const requiredVars = [
    'EMAIL_SERVER_HOST',
    'EMAIL_SERVER_PORT',
    'EMAIL_SERVER_USER',
    'EMAIL_SERVER_PASSWORD',
    'EMAIL_FROM',
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    process.exit(1);
  }

  console.log('✅ All environment variables are set\n');
  console.log('📧 Email Configuration:');
  console.log(`   Host: ${process.env.EMAIL_SERVER_HOST}`);
  console.log(`   Port: ${process.env.EMAIL_SERVER_PORT}`);
  console.log(`   User: ${process.env.EMAIL_SERVER_USER}`);
  console.log(`   From: ${process.env.EMAIL_FROM}\n`);

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: Number(process.env.EMAIL_SERVER_PORT) === 465,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    name: 'masjid-alfalah.org.uk',
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Verify connection
    console.log('🔌 Verifying SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Send test email
    console.log('📨 Sending test email...');
    const info = await transporter.sendMail({
      from: `"Masjid Al-Falah Test" <${process.env.EMAIL_FROM}>`,
      to: "sirajmuneerfsd1@gmail.com", // Send to yourself
      subject: '✅ Email System Test - Masjid Al-Falah',
      text: 'This is a test email from your Masjid Al-Falah email system. If you received this, your email configuration is working correctly!',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0c478a 0%, #004797 100%); padding: 40px 20px;">
            <tr>
              <td align="center">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px;">✅ Email Test Successful!</h1>
              </td>
            </tr>
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td>
                      <h2 style="color: #333; margin: 0 0 20px;">Assalamu Alaikum! 🕌</h2>
                      <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Your email system for <strong>Masjid Al-Falah</strong> is now configured and working correctly!
                      </p>
                      <div style="background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
                        <p style="margin: 0; color: #047857; font-size: 14px;">
                          <strong>✅ Configuration Status:</strong><br>
                          • SMTP Connection: Verified<br>
                          • Email Sending: Working<br>
                          • Templates: Ready<br>
                          • Nodemailer: Active
                        </p>
                      </div>
                      <p style="font-size: 16px; color: #555; line-height: 1.6;">
                        Your system can now send:
                      </p>
                      <ul style="color: #555; line-height: 1.8;">
                        <li>Donation receipts</li>
                        <li>Event request notifications</li>
                        <li>Service request notifications</li>
                        <li>Question notifications</li>
                        <li>Admin notifications</li>
                      </ul>
                      <p style="font-size: 14px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        This is an automated test email from your Masjid Al-Falah backend system.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    console.log('✅ Test email sent successfully!');
    console.log(`   Message ID: ${info.messageId}`);
    console.log(`   Response: ${info.response}\n`);
    console.log('🎉 Email system is fully configured and working!');
    console.log(`📬 Check your inbox at: ${process.env.EMAIL_SERVER_USER}\n`);
  } catch (error) {
    console.error('❌ Email test failed:', error);
    process.exit(1);
  }
}

// Run the test
testEmailConfiguration()
  .then(() => {
    console.log('✅ Test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
