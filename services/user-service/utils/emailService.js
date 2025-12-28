import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
  });
};

const sendEmail = async (options)=> {
    const transporter = createTransporter();
    const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.email,
        subject: options.subject,
        html: options.html
    };
    await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (user, otp) => {
  
  const subject = '🎉 Welcome to Barber Booking!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .otp-box {
          background: white;
          border: 2px dashed #667eea;
          padding: 20px;
          text-align: center;
          margin: 20px 0;
          border-radius: 10px;
        }
        .otp-code {
          font-size: 32px;
          font-weight: bold;
          color: #667eea;
          letter-spacing: 5px;
          font-family: 'Courier New', monospace;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>✂️ Welcome to Barber Booking!</h1>
      </div>
      
      <div class="content">
        <h2>Hello ${user.name}! 👋</h2>
        
        <p>Thank you for joining Barber Booking! We're excited to have you on board.</p>
        
        <p>To complete your registration, please verify your email address using the OTP code below:</p>
        
        <div class="otp-box">
          <p style="margin: 0; color: #666;">Your Verification Code:</p>
          <div class="otp-code">${otp}</div>
          <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">
            ⏰ This code expires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes
          </p>
        </div>
        
        <p><strong>What's Next?</strong></p>
        <ul>
          <li>Enter the OTP code in the app to verify your email</li>
          <li>Explore top-rated barbers in your area</li>
          <li>Book your first appointment</li>
          <li>Enjoy exclusive deals and offers</li>
        </ul>
        
        <p>If you didn't create an account, please ignore this email.</p>
        
        <p>Best regards,<br>The Barber Booking Team</p>
      </div>
      
      <div class="footer">
        <p>© 2025 Barber Booking. All rights reserved.</p>
        <p>This is an automated email. Please do not reply.</p>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    email: user.email,
    subject,
    html
  });
};

export const sendOTPEmail = async (user, otp) => {
  const subject = '🔐 Your Verification Code';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .otp-container {
          background: #f0f0f0;
          padding: 30px;
          text-align: center;
          border-radius: 10px;
          margin: 20px 0;
        }
        .otp {
          font-size: 36px;
          font-weight: bold;
          color: #667eea;
          letter-spacing: 8px;
          font-family: monospace;
        }
      </style>
    </head>
    <body>
      <h2>Hello ${user.name}!</h2>
      
      <p>Here is your new verification code:</p>
      
      <div class="otp-container">
        <div class="otp">${otp}</div>
        <p style="color: #666; margin-top: 15px;">
          ⏰ Expires in ${process.env.OTP_EXPIRE_MINUTES || 10} minutes
        </p>
      </div>
      
      <p>Enter this code in the app to verify your email address.</p>
      
      <p>If you didn't request this code, please ignore this email.</p>
      
      <p>Best regards,<br>Barber Booking Team</p>
    </body>
    </html>
  `;
  
  await sendEmail({
    email: user.email,
    subject,
    html
  });
};

export const sendPasswordResetEmail = async (user, resetToken) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  
  const subject = '🔒 Password Reset Request';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        .alert-box {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 15px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .button {
          display: inline-block;
          padding: 15px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <h2>Password Reset Request 🔐</h2>
      
      <p>Hello ${user.name},</p>
      
      <p>We received a request to reset your password for your Barber Booking account.</p>
      
      <p>Click the button below to reset your password:</p>
      
      <a href="${resetUrl}" class="button">Reset Password</a>
      
      <p>Or copy and paste this link into your browser:</p>
      <p style="background: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all;">
        ${resetUrl}
      </p>
      
      <div class="alert-box">
        <strong>⚠️ Important:</strong>
        <ul style="margin: 10px 0;">
          <li>This link expires in <strong>30 minutes</strong></li>
          <li>If you didn't request this, please ignore this email</li>
          <li>Your password will not change unless you click the link</li>
        </ul>
      </div>
      
      <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
      
      <div class="footer">
        <p>Best regards,<br>Barber Booking Team</p>
        <p style="font-size: 12px; color: #999;">
          This is an automated email. Please do not reply.
        </p>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    email: user.email,
    subject,
    html
  });
};

export const sendPasswordResetConfirmation = async (user) => {
  
  const subject = '✅ Password Successfully Reset';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .success-box {
          background: #d4edda;
          border-left: 4px solid #28a745;
          padding: 20px;
          margin: 20px 0;
          border-radius: 5px;
        }
        .security-tips {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 5px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <h2>Password Reset Successful ✅</h2>
      
      <p>Hello ${user.name},</p>
      
      <div class="success-box">
        <strong>✓ Your password has been successfully reset!</strong>
        <p style="margin: 10px 0 0 0;">You can now log in with your new password.</p>
      </div>
      
      <div class="security-tips">
        <h3>🔒 Security Tips:</h3>
        <ul>
          <li>Never share your password with anyone</li>
          <li>Use a unique password for each service</li>
          <li>Change your password regularly</li>
          <li>Enable email verification for extra security</li>
        </ul>
      </div>
      
      <p><strong>Didn't make this change?</strong></p>
      <p>If you didn't reset your password, please contact our support team immediately at support@barberbooking.com</p>
      
      <p>Best regards,<br>Barber Booking Team</p>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
        <p>© 2025 Barber Booking. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
  
  await sendEmail({
    email: user.email,
    subject,
    html
  });
};


export const sendBookingConfirmation = async (user, booking) => {
  
  const subject = '📅 Booking Confirmed!';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .booking-card {
          background: white;
          border: 2px solid #667eea;
          border-radius: 10px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <h2>Booking Confirmed! ✂️</h2>
      
      <p>Hello ${user.name},</p>
      
      <p>Your booking has been confirmed! Here are the details:</p>
      
      <div class="booking-card">
        <div class="detail-row">
          <strong>Barber:</strong>
          <span>${booking.barberName}</span>
        </div>
        <div class="detail-row">
          <strong>Service:</strong>
          <span>${booking.serviceName}</span>
        </div>
        <div class="detail-row">
          <strong>Date:</strong>
          <span>${booking.date}</span>
        </div>
        <div class="detail-row">
          <strong>Time:</strong>
          <span>${booking.time}</span>
        </div>
        <div class="detail-row">
          <strong>Amount:</strong>
          <span>$${booking.amount}</span>
        </div>
      </div>
      
      <p><strong>What's Next?</strong></p>
      <ul>
        <li>Arrive 5 minutes before your appointment</li>
        <li>Bring this confirmation email or booking ID</li>
        <li>Enjoy your service!</li>
      </ul>
      
      <p>Looking forward to serving you!</p>
      
      <p>Best regards,<br>Barber Booking Team</p>
    </body>
    </html>
  `;
  
  await sendEmail({
    email: user.email,
    subject,
    html
  });
};