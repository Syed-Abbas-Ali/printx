import nodemailer from "nodemailer";



// Function to send SMS
export const sendSMS = async (data) => {
    try {
        // Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER_EMAIL, // Your Gmail email address
        pass: process.env.EMAIL_PASS_KEY // Your Gmail password
    }
});

        const { otp, email } = data;

        // Email message
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: email,
            subject: 'New message from contact form',
            html: `<h1>otp: ${otp}</h1>`
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return 'Email sent successfully';
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
};
