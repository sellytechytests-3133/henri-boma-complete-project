from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime, timedelta
from src.models.base import BaseModel, validate_required_fields, ValidationError
from src.services.mpesa_service import mpesa_service
from src.utils.helpers import format_phone_number

payments_bp = Blueprint('payments', __name__)

def get_payments_model():
    """Get Payments model instance"""
    db = current_app.config.get('DB')
    return BaseModel(db, 'payments')

def require_permission(permission):
    """Decorator to check user permissions"""
    def decorator(f):
        def wrapper(*args, **kwargs):
            claims = get_jwt()
            permissions = claims.get('permissions', [])
            if 'all' not in permissions and permission not in permissions:
                return jsonify({'message': 'Insufficient permissions'}), 403
            return f(*args, **kwargs)
        wrapper.__name__ = f.__name__
        return wrapper
    return decorator

@payments_bp.route('/initiate', methods=['POST'])
def initiate_payment():
    """Initiate payment (public endpoint)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Validate required fields
        required_fields = ['amount', 'payment_method', 'reference_type', 'reference_id']
        validate_required_fields(data, required_fields)
        
        # Validate amount
        amount = float(data['amount'])
        if amount <= 0:
            raise ValidationError("Amount must be greater than 0")
        
        # Validate payment method
        valid_methods = ['mpesa', 'card', 'bank_transfer', 'cash']
        if data['payment_method'] not in valid_methods:
            raise ValidationError(f"Invalid payment method. Must be one of: {', '.join(valid_methods)}")
        
        # Validate reference type
        valid_types = ['booking', 'order', 'day_pass', 'event_rsvp', 'private_event']
        if data['reference_type'] not in valid_types:
            raise ValidationError(f"Invalid reference type. Must be one of: {', '.join(valid_types)}")
        
        # Generate payment ID
        payments_model = get_payments_model()
        payment_count = payments_model.count() + 1
        payment_id = f"PAY{payment_count:04d}"
        
        # Prepare payment document
        payment_doc = {
            'payment_id': payment_id,
            'amount': amount,
            'currency': data.get('currency', 'KES'),
            'payment_method': data['payment_method'],
            'reference_type': data['reference_type'],
            'reference_id': data['reference_id'],
            'customer_name': data.get('customer_name'),
            'customer_email': data.get('customer_email'),
            'customer_phone': data.get('customer_phone'),
            'status': 'pending',
            'transaction_id': None,
            'provider_reference': None,
            'failure_reason': None,
            'metadata': data.get('metadata', {}),
            'initiated_at': datetime.utcnow(),
            'completed_at': None
        }
        
        # For M-Pesa payments, add phone number validation
        if data['payment_method'] == 'mpesa':
            if not data.get('customer_phone'):
                raise ValidationError("Phone number is required for M-Pesa payments")
            
            # Here you would integrate with M-Pesa API
            # For now, we'll simulate the process
            payment_doc['provider_reference'] = f"MPESA{payment_count:06d}"
            payment_doc['status'] = 'processing'
        
        payment = payments_model.create(payment_doc)
        
        # Simulate payment processing response
        response_data = {
            'message': 'Payment initiated successfully',
            'payment': payment,
            'next_action': None
        }
        
        if data['payment_method'] == 'mpesa':
            response_data['next_action'] = {
                'type': 'mpesa_prompt',
                'message': 'Please check your phone for M-Pesa prompt',
                'timeout': 120
            }
        elif data['payment_method'] == 'card':
            response_data['next_action'] = {
                'type': 'redirect',
                'url': f"https://payment-gateway.example.com/pay/{payment_id}",
                'message': 'Redirecting to payment gateway'
            }
        
        return jsonify(response_data), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to initiate payment', 'error': str(e)}), 500

@payments_bp.route('/mpesa/stk-push', methods=['POST'])
def mpesa_stk_push():
    """Initiate M-Pesa STK push payment"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        required_fields = ['phone_number', 'amount', 'account_reference', 'transaction_desc']
        validate_required_fields(data, required_fields)
        
        # Validate phone number
        phone_number = data['phone_number']
        formatted_phone = format_phone_number(phone_number)
        
        # Validate amount
        amount = float(data['amount'])
        if amount < 1:
            raise ValidationError("Amount must be at least 1 KES")
        
        # Initiate STK push
        stk_response = mpesa_service.initiate_stk_push(
            phone_number=formatted_phone,
            amount=amount,
            account_reference=data['account_reference'],
            transaction_desc=data['transaction_desc']
        )
        
        # Save transaction to database
        payments_model = get_payments_model()
        
        transaction_data = {
            'payment_id': data.get('payment_id'),
            'amount': amount,
            'currency': 'KES',
            'payment_method': 'mpesa',
            'reference_type': data.get('reference_type', 'payment'),
            'reference_id': data.get('reference_id'),
            'customer_name': data.get('customer_name'),
            'customer_email': data.get('customer_email'),
            'customer_phone': formatted_phone,
            'status': 'processing',
            'transaction_id': None,
            'provider_reference': stk_response.get('CheckoutRequestID'),
            'mpesa_response': stk_response,
            'failure_reason': None,
            'metadata': data.get('metadata', {}),
            'initiated_at': datetime.utcnow(),
            'completed_at': None
        }
        
        payment = payments_model.create(transaction_data)
        
        return jsonify({
            'message': 'STK push initiated successfully',
            'payment': payment,
            'mpesa_response': stk_response,
            'next_action': {
                'type': 'mpesa_prompt',
                'message': 'Please check your phone for M-Pesa prompt',
                'timeout': 120
            }
        }), 201
        
    except ValidationError as e:
        return jsonify({'message': str(e)}), 400
    except Exception as e:
        return jsonify({'message': 'Failed to initiate STK push', 'error': str(e)}), 500

@payments_bp.route('/mpesa/callback', methods=['POST'])
def mpesa_callback():
    """Handle M-Pesa callback"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # Extract callback data
        body = data.get('Body', {})
        stk_callback = body.get('stkCallback', {})
        
        checkout_request_id = stk_callback.get('CheckoutRequestID')
        result_code = stk_callback.get('ResultCode')
        result_desc = stk_callback.get('ResultDesc')
        
        # Find payment by checkout request ID
        payments_model = get_payments_model()
        payment = payments_model.find_one({'provider_reference': checkout_request_id})
        
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        # Update payment status based on result
        if result_code == 0:
            # Payment successful
            callback_metadata = stk_callback.get('CallbackMetadata', {})
            items = callback_metadata.get('Item', [])
            
            # Extract transaction details
            transaction_id = None
            amount = None
            mpesa_receipt = None
            
            for item in items:
                if item.get('Name') == 'MpesaReceiptNumber':
                    mpesa_receipt = item.get('Value')
                elif item.get('Name') == 'Amount':
                    amount = item.get('Value')
                elif item.get('Name') == 'TransactionDate':
                    transaction_date = item.get('Value')
            
            update_data = {
                'status': 'completed',
                'transaction_id': mpesa_receipt,
                'completed_at': datetime.utcnow(),
                'mpesa_callback': data
            }
            
        else:
            # Payment failed
            update_data = {
                'status': 'failed',
                'failure_reason': result_desc,
                'completed_at': datetime.utcnow(),
                'mpesa_callback': data
            }
        
        # Update payment
        updated_payment = payments_model.update_by_id(payment['id'], update_data)
        
        return jsonify({
            'message': 'Callback processed successfully',
            'payment_id': payment['payment_id'],
            'status': update_data['status']
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to process callback', 'error': str(e)}), 500

@payments_bp.route('/mpesa/query/<checkout_request_id>', methods=['GET'])
def query_mpesa_status(checkout_request_id):
    """Query M-Pesa payment status"""
    try:
        # Find payment by checkout request ID
        payments_model = get_payments_model()
        payment = payments_model.find_one({'provider_reference': checkout_request_id})
        
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        # If still processing, query M-Pesa
        if payment['status'] == 'processing':
            try:
                mpesa_response = mpesa_service.query_stk_push_status(checkout_request_id)
                
                # Update payment based on M-Pesa response
                result_code = mpesa_response.get('ResultCode', 1)
                
                if result_code == 0:
                    # Payment successful
                    update_data = {
                        'status': 'completed',
                        'completed_at': datetime.utcnow(),
                        'mpesa_query_response': mpesa_response
                    }
                else:
                    # Payment failed or still pending
                    update_data = {
                        'mpesa_query_response': mpesa_response
                    }
                
                payments_model.update_by_id(payment['id'], update_data)
                payment = payments_model.find_by_id(payment['id'])
                
            except Exception as e:
                # M-Pesa query failed, return current status
                pass
        
        return jsonify({
            'payment': payment,
            'status': payment['status']
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to query payment status', 'error': str(e)}), 500

@payments_bp.route('/status/<payment_id>', methods=['GET'])
def get_payment_status(payment_id):
    """Get payment status (public endpoint)"""
    try:
        payments_model = get_payments_model()
        payment = payments_model.find_one({'payment_id': payment_id})
        
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        # Return limited information for public access
        public_payment = {
            'payment_id': payment['payment_id'],
            'amount': payment['amount'],
            'currency': payment['currency'],
            'payment_method': payment['payment_method'],
            'status': payment['status'],
            'initiated_at': payment['initiated_at'],
            'completed_at': payment.get('completed_at'),
            'failure_reason': payment.get('failure_reason')
        }
        
        return jsonify({'payment': public_payment}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get payment status', 'error': str(e)}), 500

@payments_bp.route('/callback', methods=['POST'])
def payment_callback():
    """Payment callback endpoint for payment providers"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'message': 'Request data is required'}), 400
        
        # This would typically validate the callback signature
        # For now, we'll accept any callback
        
        payment_id = data.get('payment_id')
        status = data.get('status')
        transaction_id = data.get('transaction_id')
        provider_reference = data.get('provider_reference')
        failure_reason = data.get('failure_reason')
        
        if not payment_id or not status:
            return jsonify({'message': 'Payment ID and status are required'}), 400
        
        payments_model = get_payments_model()
        payment = payments_model.find_one({'payment_id': payment_id})
        
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        # Update payment status
        update_data = {
            'status': status,
            'transaction_id': transaction_id,
            'provider_reference': provider_reference,
            'failure_reason': failure_reason
        }
        
        if status in ['completed', 'failed', 'cancelled']:
            update_data['completed_at'] = datetime.utcnow()
        
        updated_payment = payments_model.update_by_id(payment['id'], update_data)
        
        # Here you would typically update the related booking/order status
        # and send notifications to the customer
        
        return jsonify({
            'message': 'Payment status updated successfully',
            'payment_id': payment_id,
            'status': status
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to process payment callback', 'error': str(e)}), 500

@payments_bp.route('/', methods=['GET'])
@jwt_required()
@require_permission('payments')
def get_payments():
    """Get all payments (admin endpoint)"""
    try:
        payments_model = get_payments_model()
        
        # Get query parameters
        status = request.args.get('status')
        payment_method = request.args.get('payment_method')
        reference_type = request.args.get('reference_type')
        limit = request.args.get('limit', type=int)
        skip = request.args.get('skip', 0, type=int)
        
        # Build query
        query = {}
        if status:
            query['status'] = status
        if payment_method:
            query['payment_method'] = payment_method
        if reference_type:
            query['reference_type'] = reference_type
        
        payments = payments_model.find_many(
            query=query,
            limit=limit,
            skip=skip,
            sort=[('initiated_at', -1)]
        )
        
        return jsonify({
            'payments': payments,
            'total': len(payments)
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get payments', 'error': str(e)}), 500

@payments_bp.route('/<payment_id>', methods=['GET'])
@jwt_required()
@require_permission('payments')
def get_payment(payment_id):
    """Get payment by ID (admin endpoint)"""
    try:
        payments_model = get_payments_model()
        payment = payments_model.find_by_id(payment_id)
        
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        return jsonify({'payment': payment}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get payment', 'error': str(e)}), 500

@payments_bp.route('/<payment_id>/refund', methods=['POST'])
@jwt_required()
@require_permission('payments')
def refund_payment(payment_id):
    """Refund payment"""
    try:
        data = request.get_json()
        
        payments_model = get_payments_model()
        payment = payments_model.find_by_id(payment_id)
        
        if not payment:
            return jsonify({'message': 'Payment not found'}), 404
        
        if payment['status'] != 'completed':
            return jsonify({'message': 'Only completed payments can be refunded'}), 400
        
        # Validate refund amount
        refund_amount = data.get('amount', payment['amount'])
        if refund_amount > payment['amount']:
            return jsonify({'message': 'Refund amount cannot exceed payment amount'}), 400
        
        # Create refund record
        refund_count = payments_model.count({'reference_type': 'refund'}) + 1
        refund_id = f"REF{refund_count:04d}"
        
        refund_doc = {
            'payment_id': refund_id,
            'amount': -refund_amount,  # Negative amount for refund
            'currency': payment['currency'],
            'payment_method': payment['payment_method'],
            'reference_type': 'refund',
            'reference_id': payment_id,
            'customer_name': payment.get('customer_name'),
            'customer_email': payment.get('customer_email'),
            'customer_phone': payment.get('customer_phone'),
            'status': 'processing',
            'transaction_id': None,
            'provider_reference': None,
            'failure_reason': None,
            'metadata': {
                'original_payment_id': payment_id,
                'refund_reason': data.get('reason', 'Admin refund'),
                'refunded_by': 'admin'  # You could get this from JWT claims
            },
            'initiated_at': datetime.utcnow(),
            'completed_at': None
        }
        
        refund = payments_model.create(refund_doc)
        
        # Here you would typically process the actual refund with the payment provider
        # For now, we'll mark it as completed
        payments_model.update_by_id(refund['id'], {
            'status': 'completed',
            'completed_at': datetime.utcnow(),
            'transaction_id': f"REFUND{refund_count:06d}"
        })
        
        return jsonify({
            'message': 'Refund processed successfully',
            'refund': refund
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to process refund', 'error': str(e)}), 500

@payments_bp.route('/stats', methods=['GET'])
@jwt_required()
@require_permission('payments')
def get_payment_stats():
    """Get payment statistics"""
    try:
        payments_model = get_payments_model()
        
        # Get date range from query parameters
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        if start_date_str and end_date_str:
            start_date = datetime.fromisoformat(start_date_str.replace('Z', '+00:00'))
            end_date = datetime.fromisoformat(end_date_str.replace('Z', '+00:00'))
        else:
            # Default to last 30 days
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)
        
        # Get payments in date range
        date_query = {
            'initiated_at': {
                '$gte': start_date,
                '$lte': end_date
            }
        }
        
        if not payments_model.collection:
            return jsonify({
                'stats': {
                    'total_payments': 0,
                    'total_revenue': 0,
                    'successful_payments': 0,
                    'failed_payments': 0,
                    'pending_payments': 0,
                    'avg_payment_amount': 0,
                    'payments_by_method': {},
                    'payments_by_type': {},
                    'date_range': {
                        'start_date': start_date.isoformat(),
                        'end_date': end_date.isoformat()
                    }
                }
            }), 200
        
        # Aggregate statistics
        pipeline = [
            {'$match': date_query},
            {
                '$group': {
                    '_id': None,
                    'total_payments': {'$sum': 1},
                    'total_revenue': {
                        '$sum': {
                            '$cond': [
                                {'$eq': ['$status', 'completed']},
                                '$amount',
                                0
                            ]
                        }
                    },
                    'successful_payments': {
                        '$sum': {
                            '$cond': [{'$eq': ['$status', 'completed']}, 1, 0]
                        }
                    },
                    'failed_payments': {
                        '$sum': {
                            '$cond': [{'$eq': ['$status', 'failed']}, 1, 0]
                        }
                    },
                    'pending_payments': {
                        '$sum': {
                            '$cond': [{'$in': ['$status', ['pending', 'processing']]}, 1, 0]
                        }
                    },
                    'avg_payment_amount': {'$avg': '$amount'}
                }
            }
        ]
        
        result = list(payments_model.collection.aggregate(pipeline))
        stats = result[0] if result else {
            'total_payments': 0,
            'total_revenue': 0,
            'successful_payments': 0,
            'failed_payments': 0,
            'pending_payments': 0,
            'avg_payment_amount': 0
        }
        
        if '_id' in stats:
            del stats['_id']
        
        # Get payments by method
        method_pipeline = [
            {'$match': date_query},
            {
                '$group': {
                    '_id': '$payment_method',
                    'count': {'$sum': 1},
                    'revenue': {
                        '$sum': {
                            '$cond': [
                                {'$eq': ['$status', 'completed']},
                                '$amount',
                                0
                            ]
                        }
                    }
                }
            }
        ]
        
        method_result = list(payments_model.collection.aggregate(method_pipeline))
        payments_by_method = {
            item['_id']: {
                'count': item['count'],
                'revenue': item['revenue']
            }
            for item in method_result
        }
        
        # Get payments by type
        type_pipeline = [
            {'$match': date_query},
            {
                '$group': {
                    '_id': '$reference_type',
                    'count': {'$sum': 1},
                    'revenue': {
                        '$sum': {
                            '$cond': [
                                {'$eq': ['$status', 'completed']},
                                '$amount',
                                0
                            ]
                        }
                    }
                }
            }
        ]
        
        type_result = list(payments_model.collection.aggregate(type_pipeline))
        payments_by_type = {
            item['_id']: {
                'count': item['count'],
                'revenue': item['revenue']
            }
            for item in type_result
        }
        
        stats.update({
            'payments_by_method': payments_by_method,
            'payments_by_type': payments_by_type,
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        })
        
        return jsonify({'stats': stats}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get payment stats', 'error': str(e)}), 500

