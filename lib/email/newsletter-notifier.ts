/**
 * Newsletter Notifier Engine
 *
 * Sends email notifications to active newsletter subscribers when new content
 * is published. Respects subscriber preferences and runs asynchronously.
 */

import { getPayload } from 'payload';
import configPromise from '@payload-config';
import nodemailer from 'nodemailer';

// ─── Types ───────────────────────────────────────────────────────────────────

export type ContentType =
    | 'event'
    | 'notice'
    | 'blog'
    | 'sermon'
    | 'service'
    | 'donation-appeal';

export interface ContentNotification {
    type: ContentType;
    title: string;
    description?: string;
    slug?: string;
    date?: string;
    imageUrl?: string;
}

// Maps content types to their subscriber preference field
const PREFERENCE_MAP: Record<ContentType, string> = {
    event: 'receiveEventNotifications',
    notice: 'receiveWeeklyUpdates',
    blog: 'receiveWeeklyUpdates',
    sermon: 'receiveWeeklyUpdates',
    service: 'receiveWeeklyUpdates',
    'donation-appeal': 'receiveDonationAppeals',
};

// Maps content types to their frontend URL path
const URL_PATH_MAP: Record<ContentType, string> = {
    event: '/events',
    notice: '/',
    blog: '/blog',
    sermon: '/sermons',
    service: '/services',
    'donation-appeal': '/donate',
};

// Maps content types to a human-readable label
const LABEL_MAP: Record<ContentType, string> = {
    event: '📅 New Event',
    notice: '📢 New Notice',
    blog: '📝 New Blog Post',
    sermon: '🎙 New Sermon',
    service: '🕌 New Service',
    'donation-appeal': '💝 New Donation Appeal',
};

// ─── Email Transporter ──────────────────────────────────────────────────────

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_SERVER_PORT) || 587,
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

// ─── Core ────────────────────────────────────────────────────────────────────

/**
 * Notify all relevant newsletter subscribers about new content.
 * Runs fire-and-forget so it doesn't block the admin save.
 */
export function notifySubscribers(content: ContentNotification): void {
    // Fire-and-forget — don't await
    _sendNotifications(content).catch((err) => {
        console.error(`[Newsletter] Failed to send notifications for "${content.title}":`, err);
    });
}

async function _sendNotifications(content: ContentNotification): Promise<void> {
    const preferenceField = PREFERENCE_MAP[content.type];

    try {
        const payload = await getPayload({ config: configPromise });

        // Fetch all active subscribers who opted into this content type
        const { docs: subscribers } = await payload.find({
            collection: 'newsletter-subscribers' as any,
            where: {
                status: { equals: 'active' },
                [`preferences.${preferenceField}`]: { equals: true },
            },
            limit: 1000, // Process up to 1000 subscribers
            depth: 0,
        });

        if (subscribers.length === 0) {
            console.log(`[Newsletter] No subscribers opted into ${content.type}. Skipping.`);
            return;
        }

        console.log(
            `[Newsletter] Sending "${content.title}" (${content.type}) to ${subscribers.length} subscribers...`
        );

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://masjid-al-falah.org';
        const contentUrl = content.slug
            ? `${siteUrl}${URL_PATH_MAP[content.type]}/${content.slug}`
            : `${siteUrl}${URL_PATH_MAP[content.type]}`;

        let successCount = 0;
        let failCount = 0;

        for (const subscriber of subscribers) {
            try {
                const email = (subscriber as any).email;
                const firstName = (subscriber as any).firstName;
                const token = (subscriber as any).confirmationToken;

                const html = generateNotificationHTML({
                    content,
                    recipientName: firstName || 'Friend',
                    contentUrl,
                    unsubscribeUrl: `${siteUrl}/newsletter/unsubscribe?token=${token || ''}`,
                    siteUrl,
                });

                await transporter.sendMail({
                    from: `"Masjid Al-Falah" <${process.env.EMAIL_FROM || 'masjid@masjid-alfalah.org.uk'}>`,
                    to: email,
                    subject: `${LABEL_MAP[content.type]}: ${content.title}`,
                    html,
                });

                successCount++;

                // Rate limiting — 100ms between emails to avoid overwhelming the SMTP server
                await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (emailErr) {
                failCount++;
                console.error(
                    `[Newsletter] Failed to send to ${(subscriber as any).email}:`,
                    emailErr
                );
            }
        }

        // Update the emailsSent count for all successfully notified subscribers
        console.log(
            `[Newsletter] ✅ Done: ${successCount} sent, ${failCount} failed for "${content.title}"`
        );
    } catch (err) {
        console.error('[Newsletter] Error fetching subscribers:', err);
    }
}

// ─── Payload Hook Helper ─────────────────────────────────────────────────────

/**
 * Creates an afterChange hook for a Payload collection.
 * Only triggers notification when content is newly created as published
 * or when `publishField` changes from false → true.
 */
export function createNewsletterHook(
    contentType: ContentType,
    publishField: 'isPublished' | 'isActive',
    options?: {
        getSlug?: (doc: any) => string | undefined;
        getDescription?: (doc: any) => string | undefined;
        getDate?: (doc: any) => string | undefined;
    }
) {
    return async ({
        doc,
        previousDoc,
        operation,
    }: {
        doc: any;
        previousDoc?: any;
        operation: 'create' | 'update';
    }) => {
        const isNowPublished = doc[publishField] === true;
        const wasPreviouslyPublished = previousDoc?.[publishField] === true;

        // Notify only when:
        // 1. New content created as published
        // 2. Existing content flipped from unpublished → published
        const shouldNotify =
            (operation === 'create' && isNowPublished) ||
            (operation === 'update' && isNowPublished && !wasPreviouslyPublished);

        if (!shouldNotify) return doc;

        const title = doc.title || doc.name || 'Untitled';
        const slug = options?.getSlug?.(doc) || doc.slug;
        const description = options?.getDescription?.(doc) || doc.subtitle || doc.description || doc.excerpt || '';
        const date = options?.getDate?.(doc) || doc.startDate || doc.date || doc.noticeDate;

        notifySubscribers({
            type: contentType,
            title,
            slug,
            description: typeof description === 'string' ? description.substring(0, 200) : '',
            date,
        });

        return doc;
    };
}

// ─── Email Template ──────────────────────────────────────────────────────────

function generateNotificationHTML(opts: {
    content: ContentNotification;
    recipientName: string;
    contentUrl: string;
    unsubscribeUrl: string;
    siteUrl: string;
}): string {
    const { content, recipientName, contentUrl, unsubscribeUrl, siteUrl } = opts;
    const label = LABEL_MAP[content.type];
    const dateStr = content.date
        ? new Date(content.date).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        })
        : '';

    // Badge color based on content type
    const badgeColors: Record<ContentType, { bg: string; text: string }> = {
        event: { bg: '#dbeafe', text: '#1d4ed8' },
        notice: { bg: '#fef3c7', text: '#92400e' },
        blog: { bg: '#e0e7ff', text: '#4338ca' },
        sermon: { bg: '#d1fae5', text: '#065f46' },
        service: { bg: '#f3e8ff', text: '#6b21a8' },
        'donation-appeal': { bg: '#fce7f3', text: '#9d174d' },
    };

    const badge = badgeColors[content.type];

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <!-- Header -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #0c478a 0%, #004797 100%); padding: 32px 20px;">
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
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 32px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);">
          <!-- Greeting -->
          <tr>
            <td style="padding: 32px 40px 16px;">
              <p style="margin: 0; font-size: 16px; color: #333;">Assalamu Alaikum ${recipientName},</p>
            </td>
          </tr>

          <!-- Content Type Badge -->
          <tr>
            <td style="padding: 8px 40px;">
              <span style="display: inline-block; background: ${badge.bg}; color: ${badge.text}; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 600;">
                ${label}
              </span>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding: 16px 40px 8px;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #171717; line-height: 1.3;">
                ${content.title}
              </h1>
            </td>
          </tr>

          ${dateStr ? `
          <!-- Date -->
          <tr>
            <td style="padding: 4px 40px 8px;">
              <p style="margin: 0; font-size: 14px; color: #71717a;">
                📅 ${dateStr}
              </p>
            </td>
          </tr>
          ` : ''}

          ${content.description ? `
          <!-- Description -->
          <tr>
            <td style="padding: 8px 40px 16px;">
              <p style="margin: 0; font-size: 15px; color: #555; line-height: 1.6;">
                ${content.description}
              </p>
            </td>
          </tr>
          ` : ''}

          <!-- CTA Button -->
          <tr>
            <td style="padding: 16px 40px 32px;">
              <a href="${contentUrl}" style="display: inline-block; background: #0c478a; color: #ffffff; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
                View Details →
              </a>
            </td>
          </tr>

          <!-- Hadith -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 8px; padding: 20px; text-align: center;">
                <tr>
                  <td>
                    <p style="margin: 0; font-style: italic; color: #92400e; font-size: 14px; line-height: 1.5;">
                      "Whoever guides someone to goodness will have a reward like the one who did it."
                    </p>
                    <p style="margin: 8px 0 0; color: #78350f; font-size: 12px;">
                      — Prophet Muhammad ﷺ (Sahih Muslim)
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
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 0 20px 32px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align: center; padding: 20px;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 13px;">
                <strong>Masjid Al-Falah</strong><br>
                North Ilford Islamic Centre, 97 Kensington Gardens, Ilford IG1 3EN
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                <a href="${siteUrl}" style="color: #0c478a; text-decoration: none;">Website</a> •
                <a href="${unsubscribeUrl}" style="color: #0c478a; text-decoration: none;">Unsubscribe</a> •
                <a href="${siteUrl}/privacy" style="color: #0c478a; text-decoration: none;">Privacy</a>
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
