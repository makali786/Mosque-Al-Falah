/**
 * Email Service for Donation Receipts and Notifications
 */

import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export interface DonationReceiptData {
  donorEmail: string;
  donorName: string;
  amount: number;
  currency: string;
  donationType: string;
  frequency: string;
  giftAidAmount?: number;
  platformFee?: number;
  totalAmount: number;
  donationId: string;
  date: Date;
  isRecurring: boolean;
  appealTitle?: string;
}

export interface DonorData {
  email: string;
  firstName?: string;
  lastName?: string;
}

/**
 * Send donation receipt email
 */
export async function sendDonationReceipt(
  data: DonationReceiptData
): Promise<boolean> {
  try {
    const html = generateReceiptEmailHTML(data);
    const text = generateReceiptEmailText(data);

    await transporter.sendMail({
      from: `"Masjid Al-Falah" <${process.env.EMAIL_FROM || 'donations@masjid-al-falah.org'}>`,
      to: data.donorEmail,
      subject: `Thank you for your donation - Receipt #${data.donationId}`,
      text,
      html,
    });

    console.log(`✅ Receipt email sent to ${data.donorEmail}`);
    return true;
  } catch (error) {
    console.error('Failed to send receipt email:', error);
    return false;
  }
}

/**
 * Send welcome email to new donor
 */
export async function sendWelcomeEmail(donor: DonorData): Promise<boolean> {
  try {
    const html = generateWelcomeEmailHTML(donor);

    await transporter.sendMail({
      from: `"Masjid Al-Falah" <${process.env.EMAIL_FROM || 'info@masjid-al-falah.org'}>`,
      to: donor.email,
      subject: 'Welcome to Masjid Al-Falah - Thank you for your support!',
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return false;
  }
}

/**
 * Send recurring donation reminder
 */
export async function sendRecurringDonationReminder(data: {
  email: string;
  name: string;
  amount: number;
  currency: string;
  nextPaymentDate: Date;
}): Promise<boolean> {
  try {
    const html = generateReminderEmailHTML(data);

    await transporter.sendMail({
      from: `"Masjid Al-Falah" <${process.env.EMAIL_FROM || 'donations@masjid-al-falah.org'}>`,
      to: data.email,
      subject: `Upcoming donation reminder - ${formatCurrency(data.amount, data.currency)}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send reminder email:', error);
    return false;
  }
}

// Helper function to format currency
function formatCurrency(amount: number, currency: string): string {
  const symbols: Record<string, string> = {
    GBP: '£',
    USD: '$',
    EUR: '€',
  };
  return `${symbols[currency] || currency}${amount.toFixed(2)}`;
}

// Helper function to format date
function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Helper function to get frequency label
function getFrequencyLabel(frequency: string): string {
  const labels: Record<string, string> = {
    'one-time': 'One-off',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
  };
  return labels[frequency] || frequency;
}

// Helper function to get donation type label
function getDonationTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    general: 'General Fund',
    zakat: 'Zakat',
    sadaqah: 'Sadaqah',
    building: 'Building Fund',
    ramadan: 'Ramadan Appeal',
    gaza: 'Gaza Emergency',
    orphan: 'Orphan Support',
    education: 'Education',
  };
  return labels[type] || type;
}

/**
 * Generate HTML email for donation receipt
 */
function generateReceiptEmailHTML(data: DonationReceiptData): string {
  const currencySymbol =
    data.currency === 'GBP' ? '£' : data.currency === 'USD' ? '$' : '€';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Donation Receipt</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0c478a 0%, #004797 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
              <img src="${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}/logo-white.png" alt="Masjid Al-Falah" height="60" style="margin-bottom: 20px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Thank You for Your Donation</h1>
              <p style="color: #e0e0e0; margin: 10px 0 0; font-size: 16px;">JazakAllahu Khairan</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Main Content -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 40px 20px;">
              <p style="margin: 0; font-size: 16px; color: #333;">Assalamu Alaikum ${data.donorName},</p>
              <p style="margin: 15px 0 0; font-size: 16px; color: #555; line-height: 1.6;">
                We have received your ${data.isRecurring ? getFrequencyLabel(data.frequency).toLowerCase() : ''} donation. 
                May Allah reward you abundantly for your generosity and bless you in this life and the hereafter.
              </p>
            </td>
          </tr>

          <!-- Receipt Details -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border-radius: 8px; padding: 24px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 20px; font-size: 18px; color: #333; border-bottom: 1px solid #e5e7eb; padding-bottom: 12px;">
                      Receipt #${data.donationId}
                    </h3>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Date:</td>
                        <td style="padding: 8px 0; color: #333; text-align: right;">${formatDate(data.date)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Donation Type:</td>
                        <td style="padding: 8px 0; color: #333; text-align: right;">${getDonationTypeLabel(data.donationType)}</td>
                      </tr>
                      ${
                        data.appealTitle
                          ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Appeal:</td>
                        <td style="padding: 8px 0; color: #333; text-align: right;">${data.appealTitle}</td>
                      </tr>
                      `
                          : ''
                      }
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Frequency:</td>
                        <td style="padding: 8px 0; color: #333; text-align: right;">${getFrequencyLabel(data.frequency)}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 8px;"></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Donation Amount:</td>
                        <td style="padding: 8px 0; color: #333; text-align: right;">${currencySymbol}${data.amount.toFixed(2)}</td>
                      </tr>
                      ${
                        data.platformFee && data.platformFee > 0
                          ? `
                      <tr>
                        <td style="padding: 8px 0; color: #666;">Platform Support:</td>
                        <td style="padding: 8px 0; color: #333; text-align: right;">${currencySymbol}${data.platformFee.toFixed(2)}</td>
                      </tr>
                      `
                          : ''
                      }
                      <tr>
                        <td style="padding: 12px 0; font-weight: 600; color: #333; font-size: 18px; border-top: 2px solid #0c478a;">Total Paid:</td>
                        <td style="padding: 12px 0; font-weight: 600; color: #0c478a; text-align: right; font-size: 18px; border-top: 2px solid #0c478a;">${currencySymbol}${data.totalAmount.toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          ${
            data.giftAidAmount && data.giftAidAmount > 0
              ? `
          <!-- Gift Aid Section -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #ecfdf5; border-radius: 8px; padding: 20px; border-left: 4px solid #10b981;">
                <tr>
                  <td>
                    <p style="margin: 0; font-weight: 600; color: #059669; font-size: 16px;">
                      🎉 Gift Aid Boost: ${currencySymbol}${data.giftAidAmount.toFixed(2)}
                    </p>
                    <p style="margin: 8px 0 0; color: #047857; font-size: 14px;">
                      Thanks to your Gift Aid declaration, we can claim an extra 25% from HMRC at no cost to you!
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ''
          }

          ${
            data.isRecurring
              ? `
          <!-- Recurring Notice -->
          <tr>
            <td style="padding: 0 40px 20px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #eff6ff; border-radius: 8px; padding: 20px; border-left: 4px solid #3b82f6;">
                <tr>
                  <td>
                    <p style="margin: 0; font-weight: 600; color: #1d4ed8; font-size: 16px;">
                      📅 Recurring Donation Active
                    </p>
                    <p style="margin: 8px 0 0; color: #2563eb; font-size: 14px;">
                      Your ${getFrequencyLabel(data.frequency).toLowerCase()} donation of ${currencySymbol}${data.amount.toFixed(2)} will continue automatically. 
                      You can manage or cancel your subscription at any time.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          `
              : ''
          }

          <!-- Hadith Quote -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 24px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0; font-style: italic; color: #92400e; font-size: 16px; line-height: 1.6;">
                      "The believer's shade on the Day of Resurrection will be his charity."
                    </p>
                    <p style="margin: 12px 0 0; color: #78350f; font-size: 14px;">
                      — Prophet Muhammad ﷺ (Al-Tirmidhi)
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Buttons -->
          <tr>
            <td style="padding: 20px 40px 30px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}/donate" style="display: inline-block; background: #0c478a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-right: 10px;">
                Donate Again
              </a>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}/appeals" style="display: inline-block; background: #e5e7eb; color: #374151; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                View Appeals
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Footer -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px;">
                <strong>Masjid Al-Falah</strong><br>
                123 Islamic Way, London, UK
              </p>
              <p style="margin: 0 0 20px; color: #9ca3af; font-size: 12px;">
                Registered Charity No: 1234567
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}" style="color: #0c478a; text-decoration: none;">Website</a> • 
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}/unsubscribe" style="color: #0c478a; text-decoration: none;">Unsubscribe</a> • 
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}/privacy" style="color: #0c478a; text-decoration: none;">Privacy Policy</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generate plain text email for donation receipt
 */
function generateReceiptEmailText(data: DonationReceiptData): string {
  const currencySymbol =
    data.currency === 'GBP' ? '£' : data.currency === 'USD' ? '$' : '€';

  return `
MASJID AL-FALAH - DONATION RECEIPT
==================================

Assalamu Alaikum ${data.donorName},

Thank you for your generous donation. May Allah reward you abundantly.

RECEIPT DETAILS
---------------
Receipt #: ${data.donationId}
Date: ${formatDate(data.date)}
Donation Type: ${getDonationTypeLabel(data.donationType)}
Frequency: ${getFrequencyLabel(data.frequency)}

Donation Amount: ${currencySymbol}${data.amount.toFixed(2)}
${data.platformFee && data.platformFee > 0 ? `Platform Support: ${currencySymbol}${data.platformFee.toFixed(2)}` : ''}
Total Paid: ${currencySymbol}${data.totalAmount.toFixed(2)}

${
  data.giftAidAmount && data.giftAidAmount > 0
    ? `
GIFT AID
--------
Thanks to your Gift Aid declaration, we can claim an extra ${currencySymbol}${data.giftAidAmount.toFixed(2)} from HMRC!
`
    : ''
}

${
  data.isRecurring
    ? `
RECURRING DONATION
------------------
Your ${getFrequencyLabel(data.frequency).toLowerCase()} donation will continue automatically.
You can manage or cancel at any time.
`
    : ''
}

---

"The believer's shade on the Day of Resurrection will be his charity."
— Prophet Muhammad ﷺ (Al-Tirmidhi)

---

Masjid Al-Falah
123 Islamic Way, London, UK
Registered Charity No: 1234567

Website: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}
`;
}

/**
 * Generate HTML email for welcome
 */
function generateWelcomeEmailHTML(donor: DonorData): string {
  const name = donor.firstName || 'Friend';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Masjid Al-Falah</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0c478a 0%, #004797 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Masjid Al-Falah</h1>
      </td>
    </tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; padding: 40px;">
          <tr>
            <td>
              <p style="font-size: 16px; color: #333;">Assalamu Alaikum ${name},</p>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                Thank you for joining our community of supporters. Your account has been created successfully.
              </p>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                With your account, you can:
              </p>
              <ul style="color: #555; line-height: 1.8;">
                <li>View your donation history</li>
                <li>Manage recurring donations</li>
                <li>Update your Gift Aid declaration</li>
                <li>Download tax receipts</li>
              </ul>
              <p style="text-align: center; margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}/donate" style="display: inline-block; background: #0c478a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  Make a Donation
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generate HTML email for recurring donation reminder
 */
function generateReminderEmailHTML(data: {
  name: string;
  amount: number;
  currency: string;
  nextPaymentDate: Date;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; padding: 40px;">
          <tr>
            <td>
              <h2 style="color: #333; margin: 0 0 20px;">Upcoming Donation Reminder</h2>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                Assalamu Alaikum ${data.name},
              </p>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                This is a friendly reminder that your recurring donation of 
                <strong>${formatCurrency(data.amount, data.currency)}</strong> 
                will be processed on <strong>${formatDate(data.nextPaymentDate)}</strong>.
              </p>
              <p style="font-size: 16px; color: #555; line-height: 1.6;">
                May Allah reward you for your continued support.
              </p>
              <p style="margin-top: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}/account/donations" style="color: #0c478a; text-decoration: none;">
                  Manage your donations →
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export default {
  sendDonationReceipt,
  sendWelcomeEmail,
  sendRecurringDonationReminder,
};
