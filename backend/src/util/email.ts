import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER || "ppeliance@gmail.com",
                pass: process.env.EMAIL_PASS || "fseiytbhhhwtuzkk",
            },
        });

export const sendEmail = async (to: string, subject: string, text: string) => {

    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error(`Error sending email to ${to}:`, error);
        throw new Error('Failed to send email');
    }
}
