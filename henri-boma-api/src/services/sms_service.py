import os
import requests
import logging
from typing import Optional

class SMSService:
    """SMS service for sending notifications via Africa's Talking"""
    
    def __init__(self):
        self.api_key = os.getenv('SMS_API_KEY')
        self.username = os.getenv('SMS_USERNAME', 'sandbox')
        self.base_url = 'https://api.africastalking.com/version1/messaging'
        
        # Set up logging
        self.logger = logging.getLogger(__name__)
    
    def send_sms(self, phone_number: str, message: str) -> bool:
        """Send SMS to phone number"""
        try:
            if not self.api_key:
                self.logger.warning("SMS API key not configured, SMS not sent")
                return False
            
            # Format phone number for Kenya
            if phone_number.startswith('0'):
                phone_number = '+254' + phone_number[1:]
            elif phone_number.startswith('254'):
                phone_number = '+' + phone_number
            elif not phone_number.startswith('+254'):
                phone_number = '+254' + phone_number
            
            headers = {
                'apiKey': self.api_key,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            }
            
            data = {
                'username': self.username,
                'to': phone_number,
                'message': message,
                'from': 'HENRIBOMA'  # Sender ID
            }
            
            response = requests.post(self.base_url, headers=headers, data=data)
            
            if response.status_code == 201:
                result = response.json()
                if result['SMSMessageData']['Recipients'][0]['status'] == 'Success':
                    self.logger.info(f"SMS sent successfully to {phone_number}")
                    return True
                else:
                    self.logger.error(f"SMS failed to {phone_number}: {result}")
                    return False
            else:
                self.logger.error(f"SMS API error: {response.status_code} - {response.text}")
                return False
                
        except Exception as e:
            self.logger.error(f"Failed to send SMS to {phone_number}: {str(e)}")
            return False
    
    def send_booking_confirmation_sms(self, booking_data: dict) -> bool:
        """Send booking confirmation SMS"""
        message = f"""
Henri Boma Resort: Your booking {booking_data['booking_id']} is confirmed! 
Room: {booking_data['room_type']}
Check-in: {booking_data['check_in_date'][:10]}
Amount: KES {booking_data['total_amount']:,.0f}
Call +254700123456 for assistance.
"""
        
        return self.send_sms(booking_data['guest_phone'], message.strip())
    
    def send_order_status_sms(self, order_data: dict, status: str) -> bool:
        """Send order status update SMS"""
        status_messages = {
            'received': f"Henri Boma: Order {order_data['order_id']} received! Preparing your food. Est. delivery: 30-45 mins.",
            'preparing': f"Henri Boma: Your order {order_data['order_id']} is being prepared. Almost ready!",
            'ready': f"Henri Boma: Order {order_data['order_id']} is ready for pickup/delivery!",
            'out-for-delivery': f"Henri Boma: Order {order_data['order_id']} is out for delivery. Arriving soon!",
            'delivered': f"Henri Boma: Order {order_data['order_id']} delivered! Thank you for choosing us. Rate us: bit.ly/henriboma-rate"
        }
        
        message = status_messages.get(status, f"Henri Boma: Order {order_data['order_id']} status updated to {status}")
        
        return self.send_sms(order_data['customer_phone'], message)
    
    def send_payment_confirmation_sms(self, payment_data: dict) -> bool:
        """Send payment confirmation SMS"""
        message = f"""
Henri Boma: Payment confirmed! 
Amount: KES {payment_data['amount']:,.0f}
Payment ID: {payment_data['payment_id']}
Thank you!
"""
        
        customer_phone = payment_data.get('customer_phone')
        if customer_phone:
            return self.send_sms(customer_phone, message.strip())
        return True
    
    def send_rsvp_confirmation_sms(self, rsvp_data: dict, event_data: dict) -> bool:
        """Send RSVP confirmation SMS"""
        message = f"""
Henri Boma: RSVP confirmed for {event_data['title']}
Date: {event_data['event_date'][:10]}
Time: {event_data['event_time']}
RSVP ID: {rsvp_data['rsvp_id']}
See you there!
"""
        
        return self.send_sms(rsvp_data['guest_phone'], message.strip())
    
    def send_reminder_sms(self, phone_number: str, reminder_type: str, data: dict) -> bool:
        """Send reminder SMS"""
        if reminder_type == 'booking_checkin':
            message = f"""
Henri Boma Reminder: Check-in tomorrow for booking {data['booking_id']}
Room: {data['room_type']}
Time: After 2:00 PM
Call +254700123456 if you need assistance.
"""
        
        elif reminder_type == 'event_reminder':
            message = f"""
Henri Boma Reminder: Event "{data['title']}" is tomorrow
Time: {data['event_time']}
Location: {data['location']}
RSVP ID: {data['rsvp_id']}
"""
        
        else:
            message = f"Henri Boma: Reminder for {reminder_type}"
        
        return self.send_sms(phone_number, message.strip())

# Global SMS service instance
sms_service = SMSService()

