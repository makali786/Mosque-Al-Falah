import nodemailer from 'nodemailer';

const config = {
    host: 'mail.masjid-alfalah.org.uk',
    port: 465,
    secure: true,
    auth: {
        user: 'masjid@masjid-alfalah.org.uk',
        pass: 'siraj123FSD$',
    },
    tls: {
        rejectUnauthorized: false,
    },
    // IMPORTANT: Set proper EHLO hostname instead of default [127.0.0.1]
    // This can affect email delivery as the server may filter based on EHLO
    name: 'masjid-alfalah.org.uk',
};

async function sendTestEmail() {
    const transporter = nodemailer.createTransport(config);

    console.log('📧 Sending test email to sirajmuneerfsd1@gmail.com...');
    console.log('   Using EHLO hostname: masjid-alfalah.org.uk');

    try {
        await transporter.verify();
        console.log('✅ Connection verified');

        const info = await transporter.sendMail({
            from: '"Masjid Al Falah" <masjid@masjid-alfalah.org.uk>',
            to: 'sirajmuneerfsd1@gmail.com',
            replyTo: 'masjid@masjid-alfalah.org.uk',
            subject: 'Test from Masjid Al Falah - ' + new Date().toLocaleTimeString(),
            text: 'Assalamu Alaikum, this is a test email from Masjid Al Falah. Sent at: ' + new Date().toLocaleString(),
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #006fee;">Masjid Al Falah - Email Test</h2>
                    <p>Assalamu Alaikum,</p>
                    <p>This is a test email sent at <strong>${new Date().toLocaleString()}</strong></p>
                    <p>If you received this, the email system is working correctly.</p>
                </div>
            `,
        });

        console.log('✅ Accepted:', info.accepted);
        console.log('   Response:', info.response);
        console.log('   Message ID:', info.messageId);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

sendTestEmail();
