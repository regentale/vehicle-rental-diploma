import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export class EmailService {
  async sendBookingConfirmation(to: string, bookingDetails: any) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Booking Confirmation - Vehicle Rental System',
      html: `
        <h1>Booking Confirmed!</h1>
        <p>Your booking has been confirmed.</p>
        <h3>Booking Details:</h3>
        <ul>
          <li><strong>Vehicle:</strong> ${bookingDetails.vehicle.brand} ${bookingDetails.vehicle.model}</li>
          <li><strong>Start Date:</strong> ${new Date(bookingDetails.startDate).toLocaleDateString()}</li>
          <li><strong>End Date:</strong> ${new Date(bookingDetails.endDate).toLocaleDateString()}</li>
          <li><strong>Total Price:</strong> $${bookingDetails.totalPrice}</li>
          <li><strong>Pickup Location:</strong> ${bookingDetails.pickupLocation}</li>
        </ul>
        <p>Thank you for choosing our service!</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Booking confirmation email sent to:', to);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendPaymentConfirmation(to: string, paymentDetails: any) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Payment Confirmation - Vehicle Rental System',
      html: `
        <h1>Payment Successful!</h1>
        <p>Your payment has been processed successfully.</p>
        <h3>Payment Details:</h3>
        <ul>
          <li><strong>Amount:</strong> $${paymentDetails.amount}</li>
          <li><strong>Payment ID:</strong> ${paymentDetails.id}</li>
          <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
        </ul>
        <p>Thank you for your payment!</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Payment confirmation email sent to:', to);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  async sendWelcomeEmail(to: string, userName: string) {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: 'Welcome to Vehicle Rental System',
      html: `
        <h1>Welcome, ${userName}!</h1>
        <p>Thank you for registering with our Vehicle Rental System.</p>
        <p>You can now browse and rent vehicles from our extensive collection.</p>
        <p>If you have any questions, feel free to contact our support team.</p>
        <p>Happy renting!</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Welcome email sent to:', to);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
