import nodemailer from 'nodemailer';

/**
 * Utility to send an email using nodemailer.
 * If SMTP credentials are not provided in .env, it creates an ethereal test account
 * and logs the preview URL to the console.
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML body
 * @returns {Promise<void>}
 */
export const sendEmail = async ({ to, subject, html }) => {
    let transporter;

    if (process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS) {
        // Use provided SMTP credentials
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback to ethereal for testing locally
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
        console.log('No SMTP credentials found. Using Ethereal test account.');
    }

    const info = await transporter.sendMail({
        from: '"Ledgerly Support" <noreply@ledgerly.com>',
        to,
        subject,
        html,
    });

    console.log("Message sent: %s", info.messageId);

    // If using ethereal, log the preview URL
    if (info.messageId && nodemailer.getTestMessageUrl(info)) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
};
