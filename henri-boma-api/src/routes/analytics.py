from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt
from datetime import datetime, timedelta
from src.models.base import BaseModel
from src.utils.decorators import require_permission, audit_log
from src.utils.helpers import get_date_range

analytics_bp = Blueprint('analytics', __name__)

def get_analytics_model(collection_name):
    """Get analytics model instance"""
    db = current_app.config.get('DB')
    return BaseModel(db, collection_name)

@analytics_bp.route('/summary', methods=['GET'])
@jwt_required()
@require_permission('analytics')
@audit_log('view_analytics_summary')
def get_analytics_summary():
    """Get analytics summary dashboard"""
    try:
        db = current_app.config.get('DB')
        
        if not db:
            return jsonify({
                'summary': {
                    'total_bookings': 0,
                    'total_revenue': 0,
                    'total_orders': 0,
                    'total_events': 0,
                    'total_users': 0,
                    'payment_success_rate': 0,
                    'recent_bookings': 0,
                    'recent_orders': 0
                }
            }), 200
        
        # Get date range (default last 30 days)
        period = request.args.get('period', 'last_30_days')
        start_date, end_date = get_date_range(period)
        
        # Initialize collections
        bookings_model = get_analytics_model('bookings')
        orders_model = get_analytics_model('orders')
        payments_model = get_analytics_model('payments')
        events_model = get_analytics_model('events')
        users_model = get_analytics_model('auth_users')
        
        # Get basic counts
        total_bookings = bookings_model.count()
        total_orders = orders_model.count()
        total_events = events_model.count()
        total_users = users_model.count()
        
        # Get revenue from completed payments
        completed_payments = payments_model.find_many({'status': 'completed'})
        total_revenue = sum(payment['amount'] for payment in completed_payments)
        
        # Get payment success rate
        all_payments = payments_model.find_many()
        successful_payments = len([p for p in all_payments if p['status'] == 'completed'])
        payment_success_rate = (successful_payments / len(all_payments) * 100) if all_payments else 0
        
        # Get recent activity (last 7 days)
        recent_start = datetime.utcnow() - timedelta(days=7)
        recent_bookings = bookings_model.count({
            'created_at': {'$gte': recent_start}
        })
        recent_orders = orders_model.count({
            'created_at': {'$gte': recent_start}
        })
        
        summary = {
            'total_bookings': total_bookings,
            'total_revenue': total_revenue,
            'total_orders': total_orders,
            'total_events': total_events,
            'total_users': total_users,
            'payment_success_rate': round(payment_success_rate, 2),
            'recent_bookings': recent_bookings,
            'recent_orders': recent_orders,
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        }
        
        return jsonify({'summary': summary}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get analytics summary', 'error': str(e)}), 500

@analytics_bp.route('/revenue', methods=['GET'])
@jwt_required()
@require_permission('analytics')
def get_revenue_analytics():
    """Get revenue analytics"""
    try:
        db = current_app.config.get('DB')
        payments_model = get_analytics_model('payments')
        
        period = request.args.get('period', 'last_30_days')
        start_date, end_date = get_date_range(period)
        
        # Get payments in date range
        payments = payments_model.find_many({
            'initiated_at': {
                '$gte': start_date,
                '$lte': end_date
            }
        })
        
        # Group by day
        revenue_by_day = {}
        for payment in payments:
            if payment['status'] == 'completed':
                date_key = payment['initiated_at'][:10]  # YYYY-MM-DD
                if date_key not in revenue_by_day:
                    revenue_by_day[date_key] = 0
                revenue_by_day[date_key] += payment['amount']
        
        # Group by payment method
        revenue_by_method = {}
        for payment in payments:
            if payment['status'] == 'completed':
                method = payment['payment_method']
                if method not in revenue_by_method:
                    revenue_by_method[method] = 0
                revenue_by_method[method] += payment['amount']
        
        # Group by reference type (booking, order, etc.)
        revenue_by_type = {}
        for payment in payments:
            if payment['status'] == 'completed':
                ref_type = payment['reference_type']
                if ref_type not in revenue_by_type:
                    revenue_by_type[ref_type] = 0
                revenue_by_type[ref_type] += payment['amount']
        
        analytics = {
            'revenue_by_day': revenue_by_day,
            'revenue_by_method': revenue_by_method,
            'revenue_by_type': revenue_by_type,
            'total_revenue': sum(revenue_by_day.values()),
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        }
        
        return jsonify({'analytics': analytics}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get revenue analytics', 'error': str(e)}), 500

@analytics_bp.route('/bookings', methods=['GET'])
@jwt_required()
@require_permission('analytics')
def get_booking_analytics():
    """Get booking analytics"""
    try:
        db = current_app.config.get('DB')
        bookings_model = get_analytics_model('bookings')
        
        period = request.args.get('period', 'last_30_days')
        start_date, end_date = get_date_range(period)
        
        # Get bookings in date range
        bookings = bookings_model.find_many({
            'created_at': {
                '$gte': start_date,
                '$lte': end_date
            }
        })
        
        # Group by status
        bookings_by_status = {}
        for booking in bookings:
            status = booking['status']
            if status not in bookings_by_status:
                bookings_by_status[status] = 0
            bookings_by_status[status] += 1
        
        # Group by room type
        bookings_by_room_type = {}
        for booking in bookings:
            room_type = booking.get('room_type', 'Unknown')
            if room_type not in bookings_by_room_type:
                bookings_by_room_type[room_type] = 0
            bookings_by_room_type[room_type] += 1
        
        # Group by month
        bookings_by_month = {}
        for booking in bookings:
            month_key = booking['created_at'][:7]  # YYYY-MM
            if month_key not in bookings_by_month:
                bookings_by_month[month_key] = 0
            bookings_by_month[month_key] += 1
        
        analytics = {
            'bookings_by_status': bookings_by_status,
            'bookings_by_room_type': bookings_by_room_type,
            'bookings_by_month': bookings_by_month,
            'total_bookings': len(bookings),
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            }
        }
        
        return jsonify({'analytics': analytics}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get booking analytics', 'error': str(e)}), 500

@analytics_bp.route('/users', methods=['GET'])
@jwt_required()
@require_permission('analytics')
def get_user_analytics():
    """Get user analytics"""
    try:
        db = current_app.config.get('DB')
        users_model = get_analytics_model('auth_users')
        
        # Get all users
        users = users_model.find_many()
        
        # Group by role
        users_by_role = {}
        for user in users:
            role = user['role']
            if role not in users_by_role:
                users_by_role[role] = 0
            users_by_role[role] += 1
        
        # Group by status
        users_by_status = {}
        for user in users:
            status = user['status']
            if status not in users_by_status:
                users_by_status[status] = 0
            users_by_status[status] += 1
        
        # Group by month (registration date)
        users_by_month = {}
        for user in users:
            month_key = user['created_at'][:7]  # YYYY-MM
            if month_key not in users_by_month:
                users_by_month[month_key] = 0
            users_by_month[month_key] += 1
        
        analytics = {
            'users_by_role': users_by_role,
            'users_by_status': users_by_status,
            'users_by_month': users_by_month,
            'total_users': len(users)
        }
        
        return jsonify({'analytics': analytics}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to get user analytics', 'error': str(e)}), 500

@analytics_bp.route('/reports/sales', methods=['GET'])
@jwt_required()
@require_permission('analytics')
@audit_log('generate_sales_report')
def generate_sales_report():
    """Generate sales report"""
    try:
        db = current_app.config.get('DB')
        
        period = request.args.get('period', 'last_30_days')
        start_date, end_date = get_date_range(period)
        
        # Get completed payments
        payments_model = get_analytics_model('payments')
        payments = payments_model.find_many({
            'status': 'completed',
            'completed_at': {
                '$gte': start_date,
                '$lte': end_date
            }
        })
        
        # Generate detailed report
        report_data = []
        for payment in payments:
            report_data.append({
                'payment_id': payment['payment_id'],
                'amount': payment['amount'],
                'payment_method': payment['payment_method'],
                'reference_type': payment['reference_type'],
                'customer_name': payment.get('customer_name', 'N/A'),
                'customer_phone': payment.get('customer_phone', 'N/A'),
                'completed_at': payment['completed_at'],
                'transaction_id': payment.get('transaction_id', 'N/A')
            })
        
        # Calculate totals
        total_amount = sum(payment['amount'] for payment in payments)
        total_count = len(payments)
        
        report = {
            'period': period,
            'date_range': {
                'start_date': start_date.isoformat(),
                'end_date': end_date.isoformat()
            },
            'summary': {
                'total_amount': total_amount,
                'total_transactions': total_count,
                'average_transaction': total_amount / total_count if total_count > 0 else 0
            },
            'transactions': report_data
        }
        
        return jsonify({'report': report}), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to generate sales report', 'error': str(e)}), 500