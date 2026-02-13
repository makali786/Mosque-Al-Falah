/**
 * Email Service for Donation Receipts and Notifications
 */

import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // true for 465 (SSL), false for other ports like 587 (TLS)
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
  // EHLO hostname - required for HostGator/cPanel shared hosting to relay emails externally
  name: 'masjid-alfalah.org.uk',
  tls: {
    rejectUnauthorized: false,
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

export interface AdminNotificationData {
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  donationType: string;
  frequency: string;
  giftAidAmount?: number;
  totalAmount: number;
  donationId: string;
  date: Date;
  isRecurring: boolean;
}

export interface EventRequestData {
  fullName: string;
  email: string;
  phoneNumber: string;
  comments: string;
  requestId: string;
  date: Date;
}

export interface ServiceRequestData {
  fullName: string;
  email: string;
  phoneNumber: string;
  comments: string;
  requestId: string;
  date: Date;
}

export interface QuestionData {
  name: string;
  email: string;
  topic: string;
  message: string;
  questionId: string;
  date: Date;
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
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org';
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
            <img src="https://i.ibb.co/VYJ3ztwy/footer-logo.png" alt="Masjid Al-Falah" height="52" style="display: block; margin: 0 auto;">

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
                      ${data.appealTitle
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
                      ${data.platformFee && data.platformFee > 0
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

          ${data.giftAidAmount && data.giftAidAmount > 0
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

          ${data.isRecurring
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

${data.giftAidAmount && data.giftAidAmount > 0
      ? `
GIFT AID
--------
Thanks to your Gift Aid declaration, we can claim an extra ${currencySymbol}${data.giftAidAmount.toFixed(2)} from HMRC!
`
      : ''
    }

${data.isRecurring
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
        <img src="https://i.ibb.co/VYJ3ztwy/footer-logo.png" alt="Masjid Al-Falah" height="52" style="display: block; margin: 0 auto 20px;">
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
              <img src="https://i.ibb.co/VYJ3ztwy/footer-logo.png" alt="Masjid Al-Falah" height="52" style="display: block; margin: 0 auto 20px;">
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

/**
 * Send admin notification for new donation
 */
export async function sendAdminNotification(
  data: AdminNotificationData
): Promise<boolean> {
  const adminEmails =
    process.env.ADMIN_NOTIFICATION_EMAILS ||
    process.env.EMAIL_FROM ||
    'admin@masjid-al-falah.org';

  try {
    const html = generateAdminNotificationHTML(data);

    await transporter.sendMail({
      from: `"Masjid Al-Falah Donations" <${process.env.EMAIL_FROM || 'donations@masjid-al-falah.org'}>`,
      to: adminEmails,
      subject: `🎉 New Donation: ${formatCurrency(data.totalAmount, data.currency)} from ${data.donorName}`,
      html,
    });

    console.log(`📧 Admin notification sent for donation ${data.donationId}`);
    return true;
  } catch (error) {
    console.error('Failed to send admin notification:', error);
    return false;
  }
}

/**
 * Generate HTML email for admin notification
 */
function generateAdminNotificationHTML(data: AdminNotificationData): string {
  const currencySymbol =
    data.currency === 'GBP' ? '£' : data.currency === 'USD' ? '$' : '€';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px;">
    <tr>
      <td align="center">
        <img src="https://i.ibb.co/VYJ3ztwy/footer-logo.png" alt="Masjid Al-Falah" height="52" style="display: block; margin: 0 auto 15px;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🎉 New Donation Received!</h1>
      </td>
    </tr>
  </table>

  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; padding: 30px;">
          <tr>
            <td>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; color: #666;">Donor:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right; font-weight: 600;">${data.donorName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${data.donorEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Amount:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right; font-weight: 600; font-size: 18px;">${currencySymbol}${data.amount.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Type:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${getDonationTypeLabel(data.donationType)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Frequency:</td>
                  <td style="padding: 8px 0; color: #333; text-align: right;">${getFrequencyLabel(data.frequency)}</td>
                </tr>
                ${data.giftAidAmount && data.giftAidAmount > 0
      ? `
                <tr>
                  <td style="padding: 8px 0; color: #666;">Gift Aid:</td>
                  <td style="padding: 8px 0; color: #10b981; text-align: right;">+${currencySymbol}${data.giftAidAmount.toFixed(2)}</td>
                </tr>
                `
      : ''
    }
                <tr>
                  <td style="padding: 12px 0; font-weight: 600; color: #333; border-top: 2px solid #10b981;">Total:</td>
                  <td style="padding: 12px 0; font-weight: 600; color: #10b981; text-align: right; font-size: 20px; border-top: 2px solid #10b981;">${currencySymbol}${data.totalAmount.toFixed(2)}</td>
                </tr>
              </table>
              
              <p style="margin-top: 20px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org'}/admin/collections/donations/${data.donationId}" style="display: inline-block; background: #0c478a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  View in Admin Panel
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

// Helper function to get topic label for questions
function getTopicLabel(topic: string): string {
  const labels: Record<string, string> = {
    general: 'General Inquiry',
    'prayer-times': 'Prayer Times',
    events: 'Events & Programs',
    donations: 'Donations',
    madrasah: 'Madrasah',
    services: 'Services',
    'islamic-guidance': 'Islamic Guidance',
    facilities: 'Facilities',
    other: 'Other',
  };
  return labels[topic] || topic;
}

/**
 * Send admin notification for event/lecture request
 */
export async function sendEventRequestNotification(
  data: EventRequestData
): Promise<boolean> {
  const adminEmails =
    process.env.ADMIN_NOTIFICATION_EMAILS ||
    process.env.EMAIL_FROM ||
    'admin@masjid-al-falah.org';

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org';
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 32px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
             <img src="https://i.ibb.co/VYJ3ztwy/footer-logo.png" alt="Masjid Al-Falah" height="52" style="display: block; margin: 0 auto;">

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
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
          <!-- Title -->
          <tr>
            <td style="padding: 32px 40px 24px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #171717;">New Event/Lecture Request</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #71717a;">An event or lecture request has been submitted</p>
            </td>
          </tr>

          <!-- Request Details -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; border-radius: 8px; padding: 24px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #171717;">Request Details</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Name:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-weight: 600; font-size: 14px;">${data.fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Email:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-size: 14px;">${data.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Phone:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-size: 14px;">${data.phoneNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Date:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-size: 14px;">${formatDate(data.date)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Comments -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <div style="padding: 20px; background: #fef9c3; border-radius: 8px; border-left: 4px solid #ca8a04;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #713f12; font-size: 14px;">Comments/Details:</p>
                <p style="margin: 0; color: #854d0e; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.comments}</p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <a href="${siteUrl}/admin/collections/event-requests/${data.requestId}" style="display: inline-block; background: #006fee; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                View in Admin Panel
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Masjid Al-Falah Requests" <${process.env.EMAIL_FROM || 'requests@masjid-al-falah.org'}>`,
      to: adminEmails,
      subject: `New Event/Lecture Request from ${data.fullName}`,
      html,
    });

    console.log(
      `📧 Event request notification sent for request ${data.requestId}`
    );
    return true;
  } catch (error) {
    console.error('Failed to send event request notification:', error);
    return false;
  }
}

/**
 * Send admin notification for service request
 */
export async function sendServiceRequestNotification(
  data: ServiceRequestData
): Promise<boolean> {
  const adminEmails =
    process.env.ADMIN_NOTIFICATION_EMAILS ||
    process.env.EMAIL_FROM ||
    'admin@masjid-al-falah.org';

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org';
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <!-- Header -->
 <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 32px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
          <img src="https://i.ibb.co/VYJ3ztwy/footer-logo.png" alt="Masjid Al-Falah" height="48" style="display: block; margin: 0 auto;">


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
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
          <!-- Title -->
          <tr>
            <td style="padding: 32px 40px 24px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #171717;">New Service Request</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #71717a;">A service request has been submitted</p>
            </td>
          </tr>

          <!-- Request Details -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; border-radius: 8px; padding: 24px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #171717;">Request Details</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Name:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-weight: 600; font-size: 14px;">${data.fullName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Email:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-size: 14px;">${data.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Phone:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-size: 14px;">${data.phoneNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Date:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-size: 14px;">${formatDate(data.date)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Comments -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <div style="padding: 20px; background: #dbeafe; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #1e3a8a; font-size: 14px;">Comments/Details:</p>
                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.comments}</p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <a href="${siteUrl}/admin/collections/service-requests/${data.requestId}" style="display: inline-block; background: #006fee; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                View in Admin Panel
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Masjid Al-Falah Requests" <${process.env.EMAIL_FROM || 'requests@masjid-al-falah.org'}>`,
      to: adminEmails,
      subject: `New Service Request from ${data.fullName}`,
      html,
    });

    console.log(
      `📧 Service request notification sent for request ${data.requestId}`
    );
    return true;
  } catch (error) {
    console.error('Failed to send service request notification:', error);
    return false;
  }
}

/**
 * Send admin notification for question
 */
export async function sendQuestionNotification(
  data: QuestionData
): Promise<boolean> {
  const adminEmails =
    process.env.ADMIN_NOTIFICATION_EMAILS ||
    process.env.EMAIL_FROM ||
    'admin@masjid-al-falah.org';

  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org';
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;">
  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 32px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
           <img src="https://i.ibb.co/VYJ3ztwy/footer-logo.png" alt="Masjid Al-Falah" height="48" style="display: block; margin: 0 auto;">

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
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
          <!-- Title -->
          <tr>
            <td style="padding: 32px 40px 24px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #171717;">New Question Submitted</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #71717a;">A question has been submitted</p>
            </td>
          </tr>

          <!-- Question Details -->
          <tr>
            <td style="padding: 0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f4f4f5; border-radius: 8px; padding: 24px;">
                <tr>
                  <td>
                    <h2 style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #171717;">Question Details</h2>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Name:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-weight: 600; font-size: 14px;">${data.name}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Email:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-size: 14px;">${data.email}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Topic:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-size: 14px;">${getTopicLabel(data.topic)}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Date:</td>
                        <td style="padding: 8px 0; color: #171717; text-align: right; font-size: 14px;">${formatDate(data.date)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <div style="padding: 20px; background: #ffedd5; border-radius: 8px; border-left: 4px solid #f97316;">
                <p style="margin: 0 0 8px; font-weight: 600; color: #9a3412; font-size: 14px;">Message:</p>
                <p style="margin: 0; color: #c2410c; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding: 0 40px 40px; text-align: center;">
              <a href="${siteUrl}/admin/collections/questions/${data.questionId}" style="display: inline-block; background: #006fee; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
                View in Admin Panel
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"Masjid Al-Falah Questions" <${process.env.EMAIL_FROM || 'questions@masjid-al-falah.org'}>`,
      to: adminEmails,
      subject: `New Question: ${getTopicLabel(data.topic)} from ${data.name}`,
      html,
    });

    console.log(
      `📧 Question notification sent for question ${data.questionId}`
    );
    return true;
  } catch (error) {
    console.error('Failed to send question notification:', error);
    return false;
  }
}

/**
 * Newsletter Subscription Data Interface
 */
export interface NewsletterSubscriberData {
  email: string;
  firstName?: string;
  confirmationToken: string;
}

/**
 * Newsletter Campaign Data Interface
 */
export interface NewsletterCampaignData {
  email: string;
  firstName?: string;
  subject: string;
  content: string;
  unsubscribeToken: string;
}

/**
 * Send newsletter subscription welcome email
 */
export async function sendNewsletterWelcomeEmail(
  data: NewsletterSubscriberData
): Promise<boolean> {
  try {
    const html = generateNewsletterWelcomeHTML(data);
    const text = generateNewsletterWelcomeText(data);

    await transporter.sendMail({
      from: `"Masjid Al-Falah" <${process.env.EMAIL_FROM || 'newsletter@masjid-al-falah.org'}>`,
      to: data.email,
      subject: 'Welcome to Masjid Al-Falah Newsletter! 🕌',
      text,
      html,
    });

    console.log(`✅ Newsletter welcome email sent to ${data.email}`);
    return true;
  } catch (error) {
    console.error('Failed to send newsletter welcome email:', error);
    return false;
  }
}

/**
 * Send newsletter campaign email
 */
export async function sendNewsletterCampaign(
  data: NewsletterCampaignData
): Promise<boolean> {
  try {
    const html = generateNewsletterCampaignHTML(data);

    await transporter.sendMail({
      from: `"Masjid Al-Falah" <${process.env.EMAIL_FROM || 'newsletter@masjid-al-falah.org'}>`,
      to: data.email,
      subject: data.subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send newsletter campaign:', error);
    return false;
  }
}

/**
 * Generate HTML for newsletter welcome email
 */
function generateNewsletterWelcomeHTML(data: NewsletterSubscriberData): string {
  const name = data.firstName || 'Friend';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Our Newsletter</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0c478a 0%, #004797 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td align="center">
             <img src="https://i.ibb.co/VYJ3ztwy/footer-logo.png" alt="Masjid Al-Falah" height="52" style="display: block; margin: 0 auto;">

              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Welcome to Our Newsletter!</h1>
              <p style="color: #e0e0e0; margin: 10px 0 0; font-size: 16px;">Assalamu Alaikum wa Rahmatullahi wa Barakatuh</p>
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
              <p style="margin: 0; font-size: 18px; color: #333; font-weight: 600;">Dear ${name},</p>
              <p style="margin: 15px 0 0; font-size: 16px; color: #555; line-height: 1.6;">
                JazakAllah Khair for subscribing to the Masjid Al-Falah newsletter! We're delighted to have you join our community.
              </p>
            </td>
          </tr>

          <!-- What to Expect -->
          <tr>
            <td style="padding: 20px 40px;">
              <h2 style="margin: 0 0 20px; font-size: 20px; color: #0c478a;">What You'll Receive:</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 12px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 12px; vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: #e6f1fe; border-radius: 50%; display: flex; align-items: center; justify-center;">
                            <span style="font-size: 18px;">📅</span>
                          </div>
                        </td>
                        <td>
                          <p style="margin: 0; font-weight: 600; color: #333; font-size: 15px;">Weekly Updates</p>
                          <p style="margin: 4px 0 0; color: #666; font-size: 14px; line-height: 1.5;">Stay informed about mosque activities, programs, and community news</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 12px; vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: #e6f1fe; border-radius: 50%;">
                            <span style="font-size: 18px;">🎉</span>
                          </div>
                        </td>
                        <td>
                          <p style="margin: 0; font-weight: 600; color: #333; font-size: 15px;">Event Notifications</p>
                          <p style="margin: 4px 0 0; color: #666; font-size: 14px; line-height: 1.5;">Be the first to know about upcoming lectures, classes, and special events</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 12px; vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: #e6f1fe; border-radius: 50%;">
                            <span style="font-size: 18px;">🌙</span>
                          </div>
                        </td>
                        <td>
                          <p style="margin: 0; font-weight: 600; color: #333; font-size: 15px;">Ramadan & Special Updates</p>
                          <p style="margin: 4px 0 0; color: #666; font-size: 14px; line-height: 1.5;">Receive timely updates during Ramadan and other important Islamic occasions</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding-right: 12px; vertical-align: top;">
                          <div style="width: 32px; height: 32px; background: #e6f1fe; border-radius: 50%;">
                            <span style="font-size: 18px;">💝</span>
                          </div>
                        </td>
                        <td>
                          <p style="margin: 0; font-weight: 600; color: #333; font-size: 15px;">Donation Appeals</p>
                          <p style="margin: 4px 0 0; color: #666; font-size: 14px; line-height: 1.5;">Learn about ways to support our mosque and community initiatives</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hadith Quote -->
          <tr>
            <td style="padding: 20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 24px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0; font-style: italic; color: #92400e; font-size: 16px; line-height: 1.6;">
                      "The best of you are those who learn the Quran and teach it."
                    </p>
                    <p style="margin: 12px 0 0; color: #78350f; font-size: 14px;">
                      — Prophet Muhammad ﷺ (Sahih al-Bukhari)
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Buttons -->
          <tr>
            <td style="padding: 20px 40px 30px; text-align: center;">
              <p style="margin: 0 0 20px; color: #666; font-size: 14px;">Explore what's happening at Masjid Al-Falah:</p>
              <a href="${siteUrl}/events" style="display: inline-block; background: #0c478a; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0 5px 10px;">
                View Events
              </a>
              <a href="${siteUrl}/prayer-times" style="display: inline-block; background: #10b981; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0 5px 10px;">
                Prayer Times
              </a>
              <a href="${siteUrl}/donate" style="display: inline-block; background: #f59e0b; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; margin: 0 5px 10px;">
                Donate
              </a>
            </td>
          </tr>

          <!-- Manage Preferences -->
          <tr>
            <td style="padding: 0 40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border-radius: 8px; padding: 20px; border-left: 4px solid #0c478a;">
                <tr>
                  <td>
                    <p style="margin: 0; font-weight: 600; color: #333; font-size: 15px;">
                      📧 Manage Your Preferences
                    </p>
                    <p style="margin: 8px 0 0; color: #555; font-size: 14px; line-height: 1.5;">
                      You can update your email preferences or unsubscribe at any time.
                    </p>
                    <p style="margin: 12px 0 0;">
                      <a href="${siteUrl}/newsletter/preferences?token=${data.confirmationToken}" style="color: #0c478a; text-decoration: none; font-weight: 600;">
                        Update Preferences →
                      </a>
                    </p>
                  </td>
                </tr>
              </table>
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
                North Ilford Islamic Centre<br>
                97 Kensington Gardens, Ilford, Essex IG1 3EN
              </p>
              <p style="margin: 0 0 20px; color: #9ca3af; font-size: 12px;">
                Registered Charity No: 1234567
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="${siteUrl}" style="color: #0c478a; text-decoration: none;">Website</a> • 
                <a href="${siteUrl}/newsletter/unsubscribe?token=${data.confirmationToken}" style="color: #0c478a; text-decoration: none;">Unsubscribe</a> • 
                <a href="${siteUrl}/privacy" style="color: #0c478a; text-decoration: none;">Privacy Policy</a>
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
 * Generate plain text for newsletter welcome email
 */
function generateNewsletterWelcomeText(data: NewsletterSubscriberData): string {
  const name = data.firstName || 'Friend';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org';

  return `
WELCOME TO MASJID AL-FALAH NEWSLETTER
=====================================

Assalamu Alaikum wa Rahmatullahi wa Barakatuh

Dear ${name},

JazakAllah Khair for subscribing to the Masjid Al-Falah newsletter! We're delighted to have you join our community.

WHAT YOU'LL RECEIVE:
-------------------
📅 Weekly Updates - Stay informed about mosque activities and community news
🎉 Event Notifications - Be first to know about lectures, classes, and events
🌙 Ramadan & Special Updates - Timely updates during important Islamic occasions
💝 Donation Appeals - Learn about ways to support our community

---

"The best of you are those who learn the Quran and teach it."
— Prophet Muhammad ﷺ (Sahih al-Bukhari)

---

EXPLORE MASJID AL-FALAH:
- Events: ${siteUrl}/events
- Prayer Times: ${siteUrl}/prayer-times
- Donate: ${siteUrl}/donate

MANAGE YOUR PREFERENCES:
You can update your email preferences or unsubscribe at any time:
${siteUrl}/newsletter/preferences?token=${data.confirmationToken}

---

Masjid Al-Falah
North Ilford Islamic Centre
97 Kensington Gardens, Ilford, Essex IG1 3EN
Registered Charity No: 1234567

Website: ${siteUrl}
Unsubscribe: ${siteUrl}/newsletter/unsubscribe?token=${data.confirmationToken}
`;
}

/**
 * Generate HTML for newsletter campaign email
 */
function generateNewsletterCampaignHTML(data: NewsletterCampaignData): string {
  const name = data.firstName || 'Friend';
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.subject}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0c478a 0%, #004797 100%); padding: 30px 20px;">
    <tr>
      <td align="center">
      <img src="https://i.ibb.co/VYJ3ztwy/footer-logo.png" alt="Masjid Al-Falah" height="52" style="display: block; margin: 0 auto;">

      </td>
    </tr>
  </table>

  <!-- Main Content -->
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; font-size: 16px; color: #333;">Assalamu Alaikum ${name},</p>
              
              ${data.content}
              
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
                97 Kensington Gardens, Ilford, Essex IG1 3EN
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="${siteUrl}" style="color: #0c478a; text-decoration: none;">Website</a> • 
                <a href="${siteUrl}/newsletter/unsubscribe?token=${data.unsubscribeToken}" style="color: #0c478a; text-decoration: none;">Unsubscribe</a>
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
  sendAdminNotification,
  sendEventRequestNotification,
  sendServiceRequestNotification,
  sendQuestionNotification,
  sendNewsletterWelcomeEmail,
  sendNewsletterCampaign,
};
