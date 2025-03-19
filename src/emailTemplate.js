const getForgotPasswordTemplate = (fullName, resetLink) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Reset Your Password</title>
            <style>
                body { font-family: 'Arial', sans-serif; background-color: #f8f9fa; margin: 0; padding: 0; }
                .container { width: 100%; max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1); text-align: center; }
                .header {  background: linear-gradient(145deg,
                           #FFF8E7 0%,
    #F9E4BC 15%,
    #ECD5A4 30%,
    #E1C28C 45%,
    #D4B16A 60%,
    #C19B4A 75%,
    #B08942 90%,
    #9A784D 100% ); color: white; padding: 15px; font-size: 22px; font-weight: bold; border-top-left-radius: 8px; border-top-right-radius: 8px; }
                .content { padding: 20px; font-size: 16px; color: #333; }
                .btn { display: inline-block;  background: linear-gradient(145deg,
                           #FFF8E7 0%,
    #F9E4BC 15%,
    #ECD5A4 30%,
    #E1C28C 45%,
    #D4B16A 60%,
    #C19B4A 75%,
    #B08942 90%,
    #9A784D 100%
                    ); ; color: #ffffff; text-decoration: none; padding: 12px 20px; font-size: 16px; border-radius: 5px; font-weight: bold; margin-top: 20px; }
                .btn:hover { background-color: #0056b3; }
                .footer { margin-top: 20px; font-size: 14px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Password Forgot Request</div>
                <div class="content">
                    <p>Hello <strong>${fullName}</strong>,</p>
                    <p>We received a request to forgot your password. Click the button below to reset it:</p>
                    <a href="${resetLink}" class="btn">Forgot Password</a>
                    <p>If you didn’t request a password forgot, you can ignore this email.</p>
                </div>
                <div class="footer">
                    &copy; 2024 BallysFather | Need Help? <a href="mailto:support@ballysfather.com">Contact Us</a>
                </div>
            </div>
        </body>
        </html>
    `;
};

export { getForgotPasswordTemplate };
