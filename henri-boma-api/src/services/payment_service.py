import os
import requests
import base64
import json
from datetime import datetime
from typing import Dict, Any, Optional
import logging

class MpesaService:
    """M-Pesa payment service for Safaricom M-Pesa integration"""
    
    def __init__(self):
        self.consumer_key = os.getenv('MPESA_CONSUMER_KEY')
        self.consumer_secret = os.getenv('MPESA_CONSUMER_SECRET')
        self.shortcode = os.getenv('MPESA_SHORTCODE', '174379')
        self.passkey = os.getenv('MPESA_PASSKEY')
        self.environment = os.getenv('MPESA_ENVIRONMENT', 'sandbox')
        
        # Set base URLs based on environment
        if self.environment == 'production':
            self.base_url = 'https://api.safaricom.co.ke'
        else:
            self.base_url = 'https://sandbox.safaricom.co.ke'
        
        # Set up logging
        self.logger = logging.getLogger(__name__)
        
        # Cache for access token
        self._access_token = None
        self._token_expires_at = None
    
    def get_access_token(self) -> Optional[str]:
        """Get OAuth access token"""
        try:
            if not self.consumer_key or not self.consumer_secret:
                self.logger.warning("M-Pesa credentials not configured")
                return None
            
            # Check if we have a valid cached token
            if self._access_token and self._token_expires_at:
                if datetime.now() < self._token_expires_at:
                    return self._access_token
            
            # Generate new token
            auth_url = f"{self.base_url}/oauth/v1/generate?grant_type=client_credentials"
            
            # Create basic auth header
            credentials = f"{self.consumer_key}:{self.consumer_secret}"
            encoded_credentials = base64.b64encode(credentials.encode()).decode()
            
            headers = {
                'Authorization': f'Basic {encoded_credentials}',
                'Content-Type': 'application/json'
            }
            
            response = requests.get(auth_url, headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                self._access_token = data['access_token']
                # Token expires in 1 hour, cache for 50 minutes
                self._token_expires_at = datetime.now().timestamp() + 3000
                return self._access_token
            else:
                self.logger.error(f"Failed to get M-Pesa access token: {response.text}")
                return None
                
        except Exception as e:
            self.logger.error(f"Error getting M-Pesa access token: {str(e)}")
            return None
    
    def generate_password(self) -> str:
        """Generate password for STK push"""
        timestamp = datetime.now().strftime('%Y%m%d%H%M%S')
        password_string = f"{self.shortcode}{self.passkey}{timestamp}"
        password = base64.b64encode(password_string.encode()).decode()
        return password, timestamp
    
    def initiate_stk_push(self, phone_number: str, amount: float, 
                         account_reference: str, transaction_desc: str) -> Dict[str, Any]:
        """Initiate STK push payment"""
        try:
            access_token = self.get_access_token()
            if not access_token:
                return {'success': False, 'message': 'Failed to get access token'}
            
            # Format phone number
            if phone_number.startswith('0'):
                phone_number = '254' + phone_number[1:]
            elif phone_number.startswith('+254'):
                phone_number = phone_number[1:]
            elif not phone_number.startswith('254'):
                phone_number = '254' + phone_number
            
            password, timestamp = self.generate_password()
            
            stk_url = f"{self.base_url}/mpesa/stkpush/v1/processrequest"
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'BusinessShortCode': self.shortcode,
                'Password': password,
                'Timestamp': timestamp,
                'TransactionType': 'CustomerPayBillOnline',
                'Amount': int(amount),
                'PartyA': phone_number,
                'PartyB': self.shortcode,
                'PhoneNumber': phone_number,
                'CallBackURL': f"{os.getenv('API_BASE_URL', 'http://localhost:5000')}/api/payments/mpesa-callback",
                'AccountReference': account_reference,
                'TransactionDesc': transaction_desc
            }
            
            response = requests.post(stk_url, headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('ResponseCode') == '0':
                    return {
                        'success': True,
                        'checkout_request_id': data.get('CheckoutRequestID'),
                        'merchant_request_id': data.get('MerchantRequestID'),
                        'response_code': data.get('ResponseCode'),
                        'response_description': data.get('ResponseDescription'),
                        'customer_message': data.get('CustomerMessage')
                    }
                else:
                    return {
                        'success': False,
                        'message': data.get('ResponseDescription', 'STK push failed'),
                        'error_code': data.get('ResponseCode')
                    }
            else:
                self.logger.error(f"STK push API error: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'message': 'Failed to initiate payment'
                }
                
        except Exception as e:
            self.logger.error(f"Error initiating STK push: {str(e)}")
            return {
                'success': False,
                'message': 'Payment initiation failed'
            }
    
    def query_stk_status(self, checkout_request_id: str) -> Dict[str, Any]:
        """Query STK push status"""
        try:
            access_token = self.get_access_token()
            if not access_token:
                return {'success': False, 'message': 'Failed to get access token'}
            
            password, timestamp = self.generate_password()
            
            query_url = f"{self.base_url}/mpesa/stkpushquery/v1/query"
            
            headers = {
                'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json'
            }
            
            payload = {
                'BusinessShortCode': self.shortcode,
                'Password': password,
                'Timestamp': timestamp,
                'CheckoutRequestID': checkout_request_id
            }
            
            response = requests.post(query_url, headers=headers, json=payload)
            
            if response.status_code == 200:
                data = response.json()
                return {
                    'success': True,
                    'response_code': data.get('ResponseCode'),
                    'response_description': data.get('ResponseDescription'),
                    'merchant_request_id': data.get('MerchantRequestID'),
                    'checkout_request_id': data.get('CheckoutRequestID'),
                    'result_code': data.get('ResultCode'),
                    'result_desc': data.get('ResultDesc')
                }
            else:
                return {
                    'success': False,
                    'message': 'Failed to query payment status'
                }
                
        except Exception as e:
            self.logger.error(f"Error querying STK status: {str(e)}")
            return {
                'success': False,
                'message': 'Status query failed'
            }
    
    def process_callback(self, callback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process M-Pesa callback data"""
        try:
            stk_callback = callback_data.get('Body', {}).get('stkCallback', {})
            
            merchant_request_id = stk_callback.get('MerchantRequestID')
            checkout_request_id = stk_callback.get('CheckoutRequestID')
            result_code = stk_callback.get('ResultCode')
            result_desc = stk_callback.get('ResultDesc')
            
            if result_code == 0:
                # Payment successful
                callback_metadata = stk_callback.get('CallbackMetadata', {}).get('Item', [])
                
                # Extract payment details
                payment_details = {}
                for item in callback_metadata:
                    name = item.get('Name')
                    value = item.get('Value')
                    if name == 'Amount':
                        payment_details['amount'] = value
                    elif name == 'MpesaReceiptNumber':
                        payment_details['mpesa_receipt'] = value
                    elif name == 'TransactionDate':
                        payment_details['transaction_date'] = value
                    elif name == 'PhoneNumber':
                        payment_details['phone_number'] = value
                
                return {
                    'success': True,
                    'status': 'completed',
                    'merchant_request_id': merchant_request_id,
                    'checkout_request_id': checkout_request_id,
                    'payment_details': payment_details,
                    'message': 'Payment completed successfully'
                }
            else:
                # Payment failed or cancelled
                return {
                    'success': False,
                    'status': 'failed',
                    'merchant_request_id': merchant_request_id,
                    'checkout_request_id': checkout_request_id,
                    'error_code': result_code,
                    'message': result_desc
                }
                
        except Exception as e:
            self.logger.error(f"Error processing M-Pesa callback: {str(e)}")
            return {
                'success': False,
                'status': 'error',
                'message': 'Callback processing failed'
            }

class PaymentService:
    """Main payment service that handles different payment methods"""
    
    def __init__(self):
        self.mpesa = MpesaService()
        self.logger = logging.getLogger(__name__)
    
    def initiate_payment(self, payment_method: str, payment_data: Dict[str, Any]) -> Dict[str, Any]:
        """Initiate payment based on method"""
        try:
            if payment_method == 'mpesa':
                return self.mpesa.initiate_stk_push(
                    phone_number=payment_data['phone_number'],
                    amount=payment_data['amount'],
                    account_reference=payment_data['reference'],
                    transaction_desc=payment_data['description']
                )
            
            elif payment_method == 'card':
                # Placeholder for card payment integration
                # You would integrate with payment gateways like Stripe, Flutterwave, etc.
                return {
                    'success': True,
                    'payment_url': f"https://payment-gateway.example.com/pay/{payment_data['payment_id']}",
                    'message': 'Redirect to payment gateway'
                }
            
            elif payment_method == 'bank_transfer':
                # Placeholder for bank transfer
                return {
                    'success': True,
                    'bank_details': {
                        'bank_name': 'KCB Bank',
                        'account_number': '1234567890',
                        'account_name': 'Henri Boma Resort Ltd',
                        'reference': payment_data['reference']
                    },
                    'message': 'Please transfer to the provided bank details'
                }
            
            else:
                return {
                    'success': False,
                    'message': f'Payment method {payment_method} not supported'
                }
                
        except Exception as e:
            self.logger.error(f"Error initiating payment: {str(e)}")
            return {
                'success': False,
                'message': 'Payment initiation failed'
            }
    
    def process_callback(self, payment_method: str, callback_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process payment callback"""
        try:
            if payment_method == 'mpesa':
                return self.mpesa.process_callback(callback_data)
            else:
                return {
                    'success': False,
                    'message': f'Callback for {payment_method} not implemented'
                }
                
        except Exception as e:
            self.logger.error(f"Error processing callback: {str(e)}")
            return {
                'success': False,
                'message': 'Callback processing failed'
            }

# Global payment service instance
payment_service = PaymentService()

