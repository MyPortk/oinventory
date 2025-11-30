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
    deliveryRequired?: string;
    deliveryLocation?: string;
    deliveryStreet?: string;
    deliveryArea?: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; background: #f9f9f9; padding: 20px; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
          .title { font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #2c3e50; }
          .subtitle { font-size: 13px; color: #7f8c8d; margin-bottom: 25px; }
          .details { margin: 25px 0; }
          .detail-row { display: flex; margin-bottom: 12px; }
          .detail-label { font-weight: 600; color: #555; min-width: 100px; }
          .detail-value { color: #333; flex: 1; }
          .detail-value a { color: #3498db; text-decoration: none; }
          .section { margin-top: 25px; padding-top: 20px; border-top: 1px solid #ecf0f1; }
          .section-title { font-weight: 600; color: #2c3e50; margin-bottom: 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .cta { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 24px; border-radius: 6px; text-align: center; margin: 30px 0; text-decoration: none; display: inline-block; }
          .footer { font-size: 12px; color: #95a5a6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">📋 New Reservation Request</div>
          <div class="subtitle">${data.itemName}</div>
          
          <div class="details">
            <div class="detail-row">
              <div class="detail-label">Item:</div>
              <div class="detail-value">${data.itemName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">User:</div>
              <div class="detail-value">${data.userName} (<a href="mailto:${data.userEmail}">${data.userEmail}</a>)</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Dates:</div>
              <div class="detail-value">${data.startDate} to ${data.returnDate}</div>
            </div>
            ${data.notes ? `
            <div class="detail-row">
              <div class="detail-label">Notes:</div>
              <div class="detail-value">${data.notes}</div>
            </div>
            ` : ''}
            ${data.deliveryRequired === 'yes' ? `
            <div class="detail-row">
              <div class="detail-label">Delivery:</div>
              <div class="detail-value">Yes - ${data.deliveryLocation || ''}, ${data.deliveryStreet || ''}, ${data.deliveryArea || ''}</div>
            </div>
            ` : ''}
          </div>

          <p style="color: #555; margin: 25px 0;">Please log in to the inventory system to review and approve/reject this request.</p>
          
          <div class="footer">
            This is an automated email from the Inventory Management System. Please do not reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: adminEmail,
    subject: `New Reservation Request - ${data.itemName}`,
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
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; background: #f9f9f9; padding: 20px; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
          .title { font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #27ae60; }
          .subtitle { font-size: 13px; color: #7f8c8d; margin-bottom: 25px; }
          .success-box { background: #f0fdf4; border-left: 4px solid #27ae60; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .success-text { color: #22863a; font-weight: 500; }
          .details { margin: 25px 0; }
          .detail-row { display: flex; margin-bottom: 12px; }
          .detail-label { font-weight: 600; color: #555; min-width: 100px; }
          .detail-value { color: #333; flex: 1; }
          .checklist { margin: 20px 0; }
          .checklist li { list-style: none; margin: 8px 0; padding-left: 24px; position: relative; color: #555; }
          .checklist li:before { content: "✓"; position: absolute; left: 0; color: #27ae60; font-weight: bold; }
          .footer { font-size: 12px; color: #95a5a6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">✅ Reservation Approved</div>
          <div class="subtitle">${data.itemName}</div>
          
          <div class="success-box">
            <div class="success-text">Great news! Your reservation has been approved and is ready for pickup.</div>
          </div>

          <div class="details">
            <div class="detail-row">
              <div class="detail-label">Item:</div>
              <div class="detail-value">${data.itemName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Pickup:</div>
              <div class="detail-value">${data.startDate}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Return:</div>
              <div class="detail-value">${data.returnDate}</div>
            </div>
          </div>

          <div>
            <div style="font-weight: 600; color: #2c3e50; margin-bottom: 10px;">Before you pick up:</div>
            <ul class="checklist">
              <li>Inspect the equipment for any damage</li>
              <li>Report any issues immediately</li>
              <li>Use according to guidelines</li>
              <li>Return in the same condition by the return date</li>
            </ul>
          </div>

          <p style="color: #555; margin-top: 25px; margin-bottom: 25px;">Please log in to the system to complete the pickup process.</p>
          
          <div class="footer">
            This is an automated email from the Inventory Management System. Please do not reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Reservation Approved - ${data.itemName}`,
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
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; background: #f9f9f9; padding: 20px; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
          .title { font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #e74c3c; }
          .subtitle { font-size: 13px; color: #7f8c8d; margin-bottom: 25px; }
          .alert-box { background: #fff5f5; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .alert-text { color: #c0392b; }
          .details { margin: 25px 0; }
          .detail-row { display: flex; margin-bottom: 12px; }
          .detail-label { font-weight: 600; color: #555; min-width: 100px; }
          .detail-value { color: #333; flex: 1; }
          .reason-box { background: #fef2f2; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0; border-radius: 4px; }
          .reason-label { font-weight: 600; color: #c0392b; margin-bottom: 8px; }
          .reason-text { color: #555; }
          .next-steps { margin: 20px 0; }
          .next-steps li { list-style: none; margin: 8px 0; padding-left: 24px; position: relative; color: #555; }
          .next-steps li:before { content: "→"; position: absolute; left: 0; color: #95a5a6; font-weight: bold; }
          .footer { font-size: 12px; color: #95a5a6; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ecf0f1; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">❌ Reservation Not Approved</div>
          <div class="subtitle">${data.itemName}</div>
          
          <div class="alert-box">
            <div class="alert-text">Unfortunately, your reservation request could not be approved at this time.</div>
          </div>

          <div class="details">
            <div class="detail-row">
              <div class="detail-label">Item:</div>
              <div class="detail-value">${data.itemName}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">Dates:</div>
              <div class="detail-value">${data.startDate} to ${data.returnDate}</div>
            </div>
          </div>

          ${data.rejectionReason ? `
          <div class="reason-box">
            <div class="reason-label">Reason:</div>
            <div class="reason-text">${data.rejectionReason}</div>
          </div>
          ` : ''}

          <div>
            <div style="font-weight: 600; color: #2c3e50; margin-bottom: 10px;">What you can do:</div>
            <ul class="next-steps">
              <li>Try requesting different dates</li>
              <li>Look for alternative equipment</li>
              <li>Contact the admin for more options</li>
            </ul>
          </div>

          <p style="color: #555; margin-top: 25px; margin-bottom: 25px;">Please log in to the system to explore other available equipment or submit a new request.</p>
          
          <div class="footer">
            This is an automated email from the Inventory Management System. Please do not reply directly to this email.
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: userEmail,
    subject: `Reservation Not Approved - ${data.itemName}`,
    html
  });
}
