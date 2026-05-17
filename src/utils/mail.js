import nodemailer from 'nodemailer'
import 'dotenv/config'

export const WelcomeEmail = async (email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f7; }
                .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 40px; border-radius: 8px; margin-top: 20px; }
                .logo { font-size: 24px; font-weight: bold; color: #4A90E2; margin-bottom: 20px; }
                .header { font-size: 22px; font-weight: bold; color: #333333; margin-bottom: 15px; }
                .body-text { font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 30px; }
                .cta-button { 
                    display: inline-block; 
                    padding: 14px 30px; 
                    background-color: #4A90E2; 
                    color: #ffffff !important; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    font-weight: bold; 
                }
                .footer { font-size: 12px; color: #aaaaaa; margin-top: 40px; text-align: center; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">AppLogo</div>
                <div class="header">Welcome to the community!</div>
                <p class="body-text">
                    We're thrilled to have you here. Our platform helps you connect and collaborate effortlessly. 
                    Click the button below to jump right into the conversation.
                </p>
                <a href="https://yourapp.com/chat" class="cta-button">Start Chatting</a>
                <div class="footer">
                    © 2026 Your Company Name. All rights reserved.<br>
                    If you didn't sign up for this account, you can ignore this email.
                </div>
            </div>
        </body>
        </html>
        `;

        let mailConfigurations = {
            from: `"Your App Name" <${process.env.MAIL_USER}>`,
            to: email,
            subject: '🚀 Welcome to Our App - Let\'s Get Started!',
            text: 'Welcome to our app! Start chatting here: https://yourapp.com/chat', // Plain text fallback
            html: htmlContent
        };

        const info = await transporter.sendMail(mailConfigurations);
        console.log('Email sent: ' + info.response);

    } catch (error) {
        console.error('Email error:', error);
        throw new Error(error.message);
    }
}