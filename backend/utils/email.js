const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendOrderConfirmation(order, customer) {
    try {
      const mailOptions = {
        from: `Digital E-Commerce <${process.env.EMAIL_USER}>`,
        to: customer.email,
        subject: `Order Confirmation - ${order.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank you for your order!</h2>
            <p>Hi ${customer.name},</p>
            <p>Your order has been received and is being processed.</p>
            
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Details</h3>
              <p><strong>Order Number:</strong> ${order.orderNumber}</p>
              <p><strong>Total Amount:</strong> ৳${order.total}</p>
              <p><strong>Payment Method:</strong> ${order.paymentMethod.toUpperCase()}</p>
              <p><strong>Status:</strong> ${order.status}</p>
            </div>
            
            <h4>Items:</h4>
            <ul>
              ${order.items.map(item => `
                <li>${item.name} - Quantity: ${item.quantity} - ৳${item.subtotal}</li>
              `).join('')}
            </ul>
            
            <p>You can track your order status by logging into your account.</p>
            <p>If you have any questions, please contact us.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              Digital E-Commerce Team
            </p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Order confirmation email sent to ${customer.email}`);
    } catch (error) {
      console.error('Email sending error:', error.message);
    }
  }

  async sendOrderStatusUpdate(order, customer, newStatus) {
    try {
      const mailOptions = {
        from: `Digital E-Commerce <${process.env.EMAIL_USER}>`,
        to: customer.email,
        subject: `Order Status Update - ${order.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Order Status Update</h2>
            <p>Hi ${customer.name},</p>
            <p>Your order <strong>${order.orderNumber}</strong> status has been updated to: <strong>${newStatus}</strong></p>
            
            <p>You can track your order by logging into your account.</p>
            
            <p style="margin-top: 30px;">
              Best regards,<br>
              Digital E-Commerce Team
            </p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error.message);
    }
  }
}

module.exports = new EmailService();
