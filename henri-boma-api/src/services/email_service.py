import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from typing import List, Optional
import logging

class EmailService:
    """Email service for sending notifications"""
    
    def __init__(self):
        self.smtp_host = os.getenv('SMTP_HOST', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', 587))
        self.smtp_username = os.getenv('SMTP_USERNAME')
        self.smtp_password = os.getenv('SMTP_PASSWORD')
        self.from_email = os.getenv('FROM_EMAIL', 'noreply@henriboma.com')
        self.from_name = os.getenv('FROM_NAME', 'Henri Boma Resort')
        
        # Set up logging
        self.logger = logging.getLogger(__name__)
    
    def send_email(self, to_email: str, subject: str, body: str, 
                   is_html: bool = False, attachments: List[str] = None) -> bool:
        """Send email to recipient"""
        try:
            # Create message
            msg = MIMEMultipart()
            msg['From'] = f"{self.from_name} <{self.from_email}>"
            msg['To'] = to_email
            msg['Subject'] = subject
            
            # Add body
            if is_html:
                msg.attach(MIMEText(body, 'html'))
            else:
                msg.attach(MIMEText(body, 'plain'))
            
            # Add attachments if any
            if attachments:
                for file_path in attachments:
                    if os.path.isfile(file_path):
                        with open(file_path, "rb") as attachment:
                            part = MIMEBase('application', 'octet-stream')
                            part.set_payload(attachment.read())
                        
                        encoders.encode_base64(part)
                        part.add_header(
                            'Content-Disposition',
                            f'attachment; filename= {os.path.basename(file_path)}'
                        )
                        msg.attach(part)
            
            # Send email
            if not self.smtp_username or not self.smtp_password:
                self.logger.warning("SMTP credentials not configured, email not sent")
                return False
            
            server = smtplib.SMTP(self.smtp_host, self.smtp_port)
            server.starttls()
            server.login(self.smtp_username, self.smtp_password)
            text = msg.as_string()
            server.sendmail(self.from_email, to_email, text)
            server.quit()
            
            self.logger.info(f"Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            self.logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return False
    
    def send_booking_confirmation(self, booking_data: dict) -> bool:
        """Send booking confirmation email"""
        subject = f"Booking Confirmation - {booking_data['booking_id']}"
        
        body = f"""
Dear {booking_data['guest_name']},

Thank you for choosing Henri Boma Resort & Cultural Heritage!

Your booking has been confirmed with the following details:

Booking ID: {booking_data['booking_id']}
Room Type: {booking_data['room_type']}
Check-in Date: {booking_data['check_in_date']}
Check-out Date: {booking_data['check_out_date']}
Number of Guests: {booking_data['guests_count']}
Total Amount: KES {booking_data['total_amount']:,.0f}

Special Requests: {booking_data.get('special_requests', 'None')}

We look forward to welcoming you to our resort. If you have any questions or need to make changes to your booking, please contact us at:

Phone: +2547852595158
Email: reservations@henriboma.com

Best regards,
Henri Boma Resort Team
"""
        
        return self.send_email(booking_data['guest_email'], subject, body)
    
    def send_order_confirmation(self, order_data: dict) -> bool:
        """Send order confirmation email"""
        subject = f"Order Confirmation - {order_data['order_id']}"
        
        items_text = "\n".join([
            f"- {item['name']} x{item['quantity']} - KES {item['price'] * item['quantity']:,.0f}"
            for item in order_data['items']
        ])
        
        body = f"""
Dear {order_data['customer_name']},

Thank you for your food order from Henri Boma Resort!

Your order has been received with the following details:

Order ID: {order_data['order_id']}
Delivery Location: {order_data['delivery_location']}

Items Ordered:
{items_text}

Total Amount: KES {order_data['total_amount']:,.0f}

Special Instructions: {order_data.get('special_instructions', 'None')}

Estimated Delivery Time: {order_data.get('estimated_delivery', '30-45 minutes')}

We will notify you when your order is ready for delivery.

Best regards,
Henri Boma Resort Kitchen Team
"""
        
        return self.send_email(order_data.get('customer_email', ''), subject, body) if order_data.get('customer_email') else True
    
    def send_rsvp_confirmation(self, rsvp_data: dict, event_data: dict) -> bool:
        """Send RSVP confirmation email"""
        subject = f"RSVP Confirmation - {event_data['title']}"
        
        body = f"""
Dear {rsvp_data['guest_name']},

Thank you for your RSVP to our event!

Event Details:
Event: {event_data['title']}
Date: {event_data['event_date']}
Time: {event_data['event_time']}
Location: {event_data['location']}

Your RSVP Details:
RSVP ID: {rsvp_data['rsvp_id']}
Number of Attendees: {rsvp_data['attendees_count']}
Special Requirements: {rsvp_data.get('special_requirements', 'None')}

Event Description:
{event_data['description']}

We look forward to seeing you at the event!

Best regards,
Henri Boma Resort Events Team
"""
        
        return self.send_email(rsvp_data['guest_email'], subject, body)
    
    def send_payment_confirmation(self, payment_data: dict) -> bool:
        """Send payment confirmation email"""
        subject = f"Payment Confirmation - {payment_data['payment_id']}"
        
        body = f"""
Dear Customer,

Your payment has been successfully processed.

Payment Details:
Payment ID: {payment_data['payment_id']}
Amount: {payment_data['currency']} {payment_data['amount']:,.0f}
Payment Method: {payment_data['payment_method'].title()}
Transaction ID: {payment_data.get('transaction_id', 'N/A')}
Date: {payment_data['completed_at']}

Reference: {payment_data['reference_type'].title()} - {payment_data['reference_id']}

Thank you for your payment!

Best regards,
Henri Boma Resort Finance Team
"""
        
        customer_email = payment_data.get('customer_email')
        if customer_email:
            return self.send_email(customer_email, subject, body)
        return True
    
    def send_admin_notification(self, notification_type: str, data: dict) -> bool:
        """Send notification to admin"""
        admin_email = os.getenv('ADMIN_EMAIL', 'admin@henriboma.com')
        
        if notification_type == 'new_booking':
            subject = f"New Booking Received - {data['booking_id']}"
            body = f"""
A new booking has been received:

Booking ID: {data['booking_id']}
Guest: {data['guest_name']} ({data['guest_email']})
Room Type: {data['room_type']}
Check-in: {data['check_in_date']}
Check-out: {data['check_out_date']}
Guests: {data['guests_count']}
Amount: KES {data['total_amount']:,.0f}

Please review and confirm the booking in the admin dashboard.
"""
        
        elif notification_type == 'new_order':
            subject = f"New Food Order - {data['order_id']}"
            body = f"""
A new food order has been received:

Order ID: {data['order_id']}
Customer: {data['customer_name']} ({data['customer_phone']})
Delivery Location: {data['delivery_location']}
Amount: KES {data['total_amount']:,.0f}

Please prepare the order and arrange delivery.
"""
        
        elif notification_type == 'payment_received':
            subject = f"Payment Received - {data['payment_id']}"
            body = f"""
A payment has been received:

Payment ID: {data['payment_id']}
Amount: {data['currency']} {data['amount']:,.0f}
Method: {data['payment_method'].title()}
Reference: {data['reference_type']} - {data['reference_id']}

The payment has been automatically processed.
"""
        
        else:
            subject = f"System Notification - {notification_type}"
            body = f"System notification: {notification_type}\n\nData: {data}"
        
        return self.send_email(admin_email, subject, body)

# Global email service instance
email_service = EmailService()

