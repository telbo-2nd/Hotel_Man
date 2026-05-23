const nodemailer = require("nodemailer");
require("dotenv").config();

// create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false, 
    },
});

// verify connection on startup
transporter.verify((error) => {
    if (error) {
        console.error("❌ Email service error:", error);
    } else {
        console.log("✅ Email service ready");
    }
});

// ─── HTML Templates ────────────────────────────────────────────────────────

const bookingConfirmationTemplate = (guest, booking, room, roomType, services) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #1a1a2e; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
        .header p { margin: 5px 0 0; color: #a0a0b0; font-size: 13px; }
        .body { padding: 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .info-box { background: #f8f8f8; border-left: 4px solid #1a1a2e; border-radius: 4px; padding: 20px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .info-row:last-child { border-bottom: none; font-weight: bold; color: #1a1a2e; font-size: 16px; }
        .info-label { color: #666; }
        .info-value { color: #333; font-weight: 600; }
        .services-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
        .services-table th { background: #1a1a2e; color: white; padding: 10px; text-align: left; }
        .services-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .services-table tr:nth-child(even) { background: #f8f8f8; }
        .badge { display: inline-block; background: #27ae60; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        .footer a { color: #1a1a2e; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏨 GrandStay Pro</h1>
            <p>Booking Confirmation</p>
        </div>
        <div class="body">
            <p class="greeting">Dear ${guest.Firstname} ${guest.Lastname},</p>
            <p>Your booking has been confirmed. Here are your reservation details:</p>

            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Booking Status</span>
                    <span class="info-value"><span class="badge">Confirmed</span></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Room Number</span>
                    <span class="info-value">${room.roomNumber} — Floor ${room.floor}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Room Type</span>
                    <span class="info-value">${roomType.name} (Capacity: ${roomType.capacity})</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-In</span>
                    <span class="info-value">${new Date(booking.checkInDate).toDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-Out</span>
                    <span class="info-value">${new Date(booking.checkOutDate).toDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total Price</span>
                    <span class="info-value">$${booking.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            ${services && services.length > 0 ? `
            <p><strong>Requested Services:</strong></p>
            <table class="services-table">
                <thead>
                    <tr>
                        <th>Service</th>
                        <th>Quantity</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${services.map(s => `
                    <tr>
                        <td>${s.name}</td>
                        <td>${s.BookingService?.quantity || s.quantity || 1}</td>
                        <td>$${s.price.toFixed(2)}</td>
                    </tr>
                    `).join("")}
                </tbody>
            </table>
            ` : ""}

            <p style="margin-top:20px; color:#666; font-size:14px;">
                If you have any questions or need to make changes to your reservation,
                please contact us as soon as possible.
            </p>
        </div>
        <div class="footer">
        <p>GrandStay Pro &bull; 123 Luxury Avenue &bull; Cairo, Egypt</p>
            <p>📞 +20 100 000 0000 &bull; ✉️ <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
        </div>
    </div>
</body>
</html>
`;
const bookingCreatedTemplate = (guest, booking, room, roomType, services) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #1a3a6e; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; letter-spacing: 1px; }
        .header p { margin: 5px 0 0; color: #a0b8d8; font-size: 13px; }
        .body { padding: 30px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .info-box { background: #f8f8f8; border-left: 4px solid #1a3a6e; border-radius: 4px; padding: 20px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .info-row:last-child { border-bottom: none; font-weight: bold; color: #1a3a6e; font-size: 16px; }
        .info-label { color: #666; }
        .info-value { color: #333; font-weight: 600; }
        .badge-pending { display: inline-block; background: #f39c12; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; }
        .notice { background: #fff8e1; border-left: 4px solid #f39c12; padding: 15px; border-radius: 4px; margin: 20px 0; font-size: 14px; color: #7d6608; }
        .services-table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px; }
        .services-table th { background: #1a3a6e; color: white; padding: 10px; text-align: left; }
        .services-table td { padding: 10px; border-bottom: 1px solid #eee; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
        .footer a { color: #1a3a6e; text-decoration: none; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏨 GrandStay Pro</h1>
            <p>Booking Received</p>
        </div>
        <div class="body">
            <p class="greeting">Dear ${guest.Firstname} ${guest.Lastname},</p>
            <p>Thank you! We've received your booking request. Here are your reservation details:</p>

            <div class="notice">
                ⏳ Your booking is currently <strong>pending review</strong>. You'll receive another email once it's confirmed by our team.
            </div>

            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Booking Status</span>
                    <span class="info-value"><span class="badge-pending">Pending</span></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Room Number</span>
                    <span class="info-value">${room.roomNumber} — Floor ${room.floor}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Room Type</span>
                    <span class="info-value">${roomType.name} (Capacity: ${roomType.capacity})</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-In</span>
                    <span class="info-value">${new Date(booking.checkInDate).toDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-Out</span>
                    <span class="info-value">${new Date(booking.checkOutDate).toDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total Price</span>
                    <span class="info-value">$${booking.totalPrice.toFixed(2)}</span>
                </div>
            </div>

            ${services && services.length > 0 ? `
            <p><strong>Requested Services:</strong></p>
            <table class="services-table">
                <thead><tr><th>Service</th><th>Quantity</th><th>Price</th></tr></thead>
                <tbody>
                    ${services.map(s => `
                    <tr>
                        <td>${s.name}</td>
                        <td>${s.BookingService?.quantity || s.quantity || 1}</td>
                        <td>$${s.price.toFixed(2)}</td>
                    </tr>`).join("")}
                </tbody>
            </table>` : ""}

            <p style="margin-top:20px; color:#666; font-size:14px;">
                If you have any questions, please don't hesitate to contact us.
            </p>
        </div>
        <div class="footer">
            <p>GrandStay Pro &bull; 123 Luxury Avenue &bull; Cairo, Egypt</p>
            <p>📞 +20 100 000 0000 &bull; ✉️ <a href="mailto:${process.env.EMAIL_USER}">${process.env.EMAIL_USER}</a></p>
        </div>
    </div>
</body>
</html>
`;

const cancellationTemplate = (guest, booking, room) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #c0392b; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; color: #f5b7b1; font-size: 13px; }
        .body { padding: 30px; }
        .info-box { background: #f8f8f8; border-left: 4px solid #c0392b; border-radius: 4px; padding: 20px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #666; }
        .info-value { color: #333; font-weight: 600; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏨 GrandStay Pro</h1>
            <p>Booking Cancellation</p>
        </div>
        <div class="body">
            <p>Dear ${guest.Firstname} ${guest.Lastname},</p>
            <p>We're sorry to inform you that your booking has been <strong>cancelled</strong>.</p>

            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Room Number</span>
                    <span class="info-value">${room.roomNumber}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-In</span>
                    <span class="info-value">${new Date(booking.checkInDate).toDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-Out</span>
                    <span class="info-value">${new Date(booking.checkOutDate).toDateString()}</span>
                </div>
            </div>

            <p style="color:#666; font-size:14px;">
                If you believe this was a mistake or would like to make a new reservation,
                please contact us and we'll be happy to assist you.
            </p>
        </div>
        <div class="footer">
            <p>GrandStay Pro &bull; 123 Luxury Avenue &bull; Cairo, Egypt</p>
            <p>📞 +20 100 000 0000 &bull; ✉️ ${process.env.EMAIL_USER}</p>
        </div>
    </div>
</body>
</html>
`;

const checkInReminderTemplate = (guest, booking, room, roomType, checkInTime) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #1a6e3c; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; color: #a8d5b5; font-size: 13px; }
        .body { padding: 30px; }
        .info-box { background: #f8f8f8; border-left: 4px solid #1a6e3c; border-radius: 4px; padding: 20px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .info-row:last-child { border-bottom: none; }
        .info-label { color: #666; }
        .info-value { color: #333; font-weight: 600; }
        .highlight { background: #eafaf1; border-radius: 4px; padding: 15px; text-align: center; margin: 20px 0; font-size: 16px; color: #1a6e3c; font-weight: bold; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏨 GrandStay Pro</h1>
            <p>Check-In Reminder</p>
        </div>
        <div class="body">
            <p>Dear ${guest.Firstname} ${guest.Lastname},</p>
            <p>This is a friendly reminder that your check-in is <strong>tomorrow!</strong> 🎉</p>

            <div class="highlight">
                Check-in time: ${checkInTime}
            </div>

            <div class="info-box">
                <div class="info-row">
                    <span class="info-label">Room Number</span>
                    <span class="info-value">${room.roomNumber} — Floor ${room.floor}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Room Type</span>
                    <span class="info-value">${roomType.name}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-In Date</span>
                    <span class="info-value">${new Date(booking.checkInDate).toDateString()}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Check-Out Date</span>
                    <span class="info-value">${new Date(booking.checkOutDate).toDateString()}</span>
                </div>
            </div>

            <p style="color:#666; font-size:14px;">
                Please bring a valid ID upon arrival. We look forward to welcoming you!
            </p>
        </div>
        <div class="footer">
            <p>GrandStay Pro &bull; 123 Luxury Avenue &bull; Cairo, Egypt</p>
            <p>📞 +20 100 000 0000 &bull; ✉️ ${process.env.EMAIL_USER}</p>
        </div>
    </div>
</body>
</html>
`;

const invoiceTemplate = (guest, booking, room, roomType, services, checkOutTime) => {
    const checkIn  = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const nights   = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const roomTotal = roomType.price * nights;

    const serviceRows = services && services.length > 0
        ? services.map(s => `
            <tr>
                <td style="padding:10px; border-bottom:1px solid #eee;">${s.name}</td>
                <td style="padding:10px; border-bottom:1px solid #eee; text-align:center;">${s.BookingService?.quantity || 1}</td>
                <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">$${s.price.toFixed(2)}</td>
                <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">$${(s.price * (s.BookingService?.quantity || 1)).toFixed(2)}</td>
            </tr>
        `).join("")
        : `<tr><td colspan="4" style="padding:10px; text-align:center; color:#999;">No additional services</td></tr>`;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #1a1a2e; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .header p { margin: 5px 0 0; color: #a0a0b0; font-size: 13px; }
        .body { padding: 30px; }
        .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 13px; color: #666; }
        .guest-info { background: #f8f8f8; padding: 15px; border-radius: 4px; margin-bottom: 20px; font-size: 14px; }
        .guest-info p { margin: 4px 0; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th { background: #1a1a2e; color: white; padding: 10px; text-align: left; }
        th:last-child, th:nth-child(3), th:nth-child(2) { text-align: right; }
        .total-row { background: #f8f8f8; font-weight: bold; font-size: 16px; }
        .total-row td { padding: 15px 10px; color: #1a1a2e; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; margin-top: 20px; }
        .thank-you { text-align: center; padding: 20px; color: #1a1a2e; font-size: 16px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏨 GrandStay Pro</h1>
            <p>Invoice & Receipt</p>
        </div>
        <div class="body">
            <div class="invoice-meta">
                <span>Invoice Date: ${new Date().toDateString()}</span>
                <span>Booking ID: ${booking.id.slice(0, 8).toUpperCase()}</span>
            </div>

            <div class="guest-info">
                <p><strong>Guest:</strong> ${guest.Firstname} ${guest.Lastname}</p>
                <p><strong>Email:</strong> ${guest.email}</p>
                <p><strong>National ID:</strong> ${guest.nationalId}</p>
                <p><strong>Check-Out Time:</strong> ${checkOutTime}</p>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th style="text-align:center;">Qty / Nights</th>
                        <th style="text-align:right;">Unit Price</th>
                        <th style="text-align:right;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding:10px; border-bottom:1px solid #eee;">
                            Room ${room.roomNumber} — ${roomType.name} (Floor ${room.floor})
                        </td>
                        <td style="padding:10px; border-bottom:1px solid #eee; text-align:center;">${nights} nights</td>
                        <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">$${roomType.price.toFixed(2)}</td>
                        <td style="padding:10px; border-bottom:1px solid #eee; text-align:right;">$${roomTotal.toFixed(2)}</td>
                    </tr>
                    ${serviceRows}
                    <tr class="total-row">
                        <td colspan="3" style="text-align:right;">Total Amount Paid</td>
                        <td style="text-align:right;">$${booking.totalPrice.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <div class="thank-you">
                Thank you for staying with us! 🙏<br>
                <span style="font-size:13px; font-weight:normal; color:#666;">We hope to see you again soon.</span>
            </div>
        </div>
        <div class="footer">
            <p>GrandStay Pro &bull; 123 Luxury Avenue &bull; Cairo, Egypt</p>
            <p>📞 +20 100 000 0000 &bull; ✉️ ${process.env.EMAIL_USER}</p>
        </div>
    </div>
</body>
</html>
`;
};


exports.sendBookingCreated = async (guest, booking, room, roomType, services) => {
    try {
        await transporter.sendMail({
            from:    process.env.EMAIL_FROM,
            to:      guest.email,
            subject: `📋 Booking Received — Room ${room.roomNumber} | GrandStay Pro`,
            html:    bookingCreatedTemplate(guest, booking, room, roomType, services),
        });
        console.log(`📧 Booking created email sent to ${guest.email}`);
    } catch (error) {
        console.error("❌ Failed to send booking created email:", error.message);
    }
};

exports.sendBookingConfirmation = async (guest, booking, room, roomType, services) => {
    try {
        await transporter.sendMail({
            from:    process.env.EMAIL_FROM,
            to:      guest.email,
            subject: `✅ Booking Confirmed — Room ${room.roomNumber} | GrandStay Pro`,
            html:    bookingConfirmationTemplate(guest, booking, room, roomType, services),
        });
        console.log(`📧 Confirmation email sent to ${guest.email}`);
    } catch (error) {
        // never crash the booking if email fails
        console.error("❌ Failed to send confirmation email:", error.message);
    }
};

exports.sendCancellationEmail = async (guest, booking, room) => {
    try {
        await transporter.sendMail({
            from:    process.env.EMAIL_FROM,
            to:      guest.email,
            subject: `❌ Booking Cancelled — Room ${room.roomNumber} | GrandStay Pro`,
            html:    cancellationTemplate(guest, booking, room),
        });
        console.log(`📧 Cancellation email sent to ${guest.email}`);
    } catch (error) {
        console.error("❌ Failed to send cancellation email:", error.message);
    }
};

exports.sendCheckInReminder = async (guest, booking, room, roomType, checkInTime) => {
    try {
        await transporter.sendMail({
            from:    process.env.EMAIL_FROM,
            to:      guest.email,
            subject: `🔔 Check-In Reminder — Tomorrow at ${checkInTime} | GrandStay Pro`,
            html:    checkInReminderTemplate(guest, booking, room, roomType, checkInTime),
        });
        console.log(`📧 Check-in reminder sent to ${guest.email}`);
    } catch (error) {
        console.error("❌ Failed to send check-in reminder:", error.message);
    }
};

exports.sendInvoice = async (guest, booking, room, roomType, services, checkOutTime) => {
    try {
        await transporter.sendMail({
            from:    process.env.EMAIL_FROM,
            to:      guest.email,
            subject: `🧾 Your Invoice — Room ${room.roomNumber} | GrandStay Pro`,
            html:    invoiceTemplate(guest, booking, room, roomType, services, checkOutTime),
        });
        console.log(`📧 Invoice sent to ${guest.email}`);
    } catch (error) {
        console.error("❌ Failed to send invoice:", error.message);
    }
};