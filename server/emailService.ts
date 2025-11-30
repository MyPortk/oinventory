import nodemailer from 'nodemailer';

// Email service configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'localhost',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  } : undefined,
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    // If no SMTP configured, log the email instead of failing
    if (!process.env.SMTP_HOST) {
      console.log('📧 Email would be sent to:', options.to);
      console.log('   Subject:', options.subject);
      console.log('   Body:', options.html.substring(0, 100) + '...');
      return true;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@inventory.local',
      ...options,
    });
    console.log('✅ Email sent to:', options.to);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}

export async function sendReservationRequestEmail(
  adminEmail: string,
  data: {
    itemName: string;
    userName: string;
    userEmail: string;
    startDate: string;
    returnDate: string;
    notes?: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 4px; background-color: #fff; }
          h2 { color: #333; border-bottom: 2px solid #667eea; padding-bottom: 10px; margin: 0 0 20px 0; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #667eea; display: block; margin-bottom: 3px; font-size: 13px; }
          .value { color: #333; margin-left: 10px; line-height: 1.5; }
          .section { margin-bottom: 25px; }
          .notes { margin-top: 15px; padding: 10px; background-color: #fffbf0; border-left: 3px solid #f59e0b; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>New Reservation Request</h2>
          
          <div class="section">
            <div class="field">
              <span class="label">Item Name:</span>
              <span class="value">${data.itemName}</span>
            </div>
          </div>

          <div class="section">
            <h3 style="color: #667eea; font-size: 14px; margin: 0 0 10px 0;">Requester Information</h3>
            <div class="field">
              <span class="label">Name:</span>
              <span class="value">${data.userName}</span>
            </div>
            <div class="field">
              <span class="label">Email:</span>
              <span class="value">${data.userEmail}</span>
            </div>
          </div>

          <div class="section">
            <h3 style="color: #667eea; font-size: 14px; margin: 0 0 10px 0;">Reservation Dates</h3>
            <div class="field">
              <span class="label">Start Date:</span>
              <span class="value">${data.startDate}</span>
            </div>
            <div class="field">
              <span class="label">Return Date:</span>
              <span class="value">${data.returnDate}</span>
            </div>
          </div>

          ${data.notes ? `
          <div class="section">
            <div class="notes">
              <span class="label">Notes:</span>
              <span class="value">${data.notes}</span>
            </div>
          </div>
          ` : ''}

          <p style="margin: 20px 0; color: #555;">Please review this reservation request and approve or reject it in the Inventory Management System.</p>

          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Reservation Request for ${data.itemName}`,
    html
  });
}

export async function sendReservationApprovedEmail(
  userEmail: string,
  data: {
    itemName: string;
    userName: string;
    userEmail: string;
    startDate: string;
    returnDate: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 4px; background-color: #fff; }
          h2 { color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px; margin: 0 0 20px 0; }
          .success { background-color: #ecfdf5; padding: 10px; border-left: 3px solid #22c55e; margin-bottom: 20px; color: #22c55e; font-weight: bold; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #22c55e; display: block; margin-bottom: 3px; font-size: 13px; }
          .value { color: #333; margin-left: 10px; line-height: 1.5; }
          .section { margin-bottom: 25px; }
          .instructions { margin: 20px 0; padding: 15px; background-color: #f9fafb; border-left: 3px solid #22c55e; }
          .instructions h3 { color: #22c55e; margin: 0 0 10px 0; font-size: 14px; }
          .instructions li { margin-bottom: 8px; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reservation Approved</h2>
          
          <div class="success">Your reservation has been approved!</div>

          <div class="section">
            <h3 style="color: #22c55e; font-size: 14px; margin: 0 0 10px 0;">Reservation Details</h3>
            <div class="field">
              <span class="label">Item:</span>
              <span class="value">${data.itemName}</span>
            </div>
            <div class="field">
              <span class="label">Pickup Date:</span>
              <span class="value">${data.startDate}</span>
            </div>
            <div class="field">
              <span class="label">Return Date:</span>
              <span class="value">${data.returnDate}</span>
            </div>
          </div>

          <div class="instructions">
            <h3>Please note:</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Pick up the item on the scheduled start date</li>
              <li>Inspect the item for any damage or defects</li>
              <li>Use the item according to the policy guidelines</li>
              <li>Return the item in the same condition by the return date</li>
            </ul>
          </div>

          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Your Reservation for ${data.itemName} Has Been Approved`,
    html
  });
}

export async function sendReservationRejectedEmail(
  userEmail: string,
  data: {
    itemName: string;
    userName: string;
    userEmail: string;
    startDate: string;
    returnDate: string;
    rejectionReason?: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 4px; background-color: #fff; }
          h2 { color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px; margin: 0 0 20px 0; }
          .alert { background-color: #fef2f2; padding: 10px; border-left: 3px solid #ef4444; margin-bottom: 20px; color: #ef4444; font-weight: bold; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #ef4444; display: block; margin-bottom: 3px; font-size: 13px; }
          .value { color: #333; margin-left: 10px; line-height: 1.5; }
          .section { margin-bottom: 25px; }
          .reason { margin: 20px 0; padding: 15px; background-color: #fef2f2; border-left: 3px solid #ef4444; }
          .reason h3 { color: #ef4444; margin: 0 0 10px 0; font-size: 14px; }
          .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Reservation Not Approved</h2>
          
          <div class="alert">Unfortunately, your reservation request has been rejected.</div>

          <div class="section">
            <h3 style="color: #ef4444; font-size: 14px; margin: 0 0 10px 0;">Reservation Details</h3>
            <div class="field">
              <span class="label">Item:</span>
              <span class="value">${data.itemName}</span>
            </div>
            <div class="field">
              <span class="label">Requested Period:</span>
              <span class="value">${data.startDate} to ${data.returnDate}</span>
            </div>
          </div>

          ${data.rejectionReason ? `
          <div class="reason">
            <h3>Reason:</h3>
            <p style="margin: 0;">${data.rejectionReason}</p>
          </div>
          ` : ''}

          <p style="margin: 20px 0; color: #555;">If you have any questions or would like to discuss alternative dates, please contact your administrator.</p>

          <div class="footer">
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Your Reservation for ${data.itemName} Has Been Rejected`,
    html
  });
}
