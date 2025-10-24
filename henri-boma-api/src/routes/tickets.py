from flask import Blueprint, request, jsonify, current_app, send_file
from flask_jwt_extended import jwt_required, get_jwt
from src.services.ticket_service import get_ticket_service
from src.models.base import BaseModel
from src.utils.decorators import require_permission
import os

tickets_bp = Blueprint('tickets', __name__)

def get_ticket_service_instance():
    """Get ticket service instance"""
    db = current_app.config.get('DB')
    return get_ticket_service(db)

@tickets_bp.route('/<order_id>.pdf', methods=['GET'])
def download_ticket(order_id):
    """Download ticket PDF"""
    try:
        db = current_app.config.get('DB')
        ticket_service = get_ticket_service_instance()
        
        # Find booking/order
        bookings_model = BaseModel(db, 'bookings')
        orders_model = BaseModel(db, 'orders')
        
        booking = bookings_model.find_one({'booking_id': order_id})
        order = orders_model.find_one({'order_id': order_id})
        
        if not booking and not order:
            return jsonify({'message': 'Booking/Order not found'}), 404
        
        # Get payment information
        payments_model = BaseModel(db, 'payments')
        if booking:
            payment = payments_model.find_one({'reference_id': booking['id'], 'reference_type': 'booking'})
            ticket_result = ticket_service.generate_booking_ticket(booking, payment)
        else:
            payment = payments_model.find_one({'reference_id': order['id'], 'reference_type': 'order'})
            # For orders, you might want to generate a different type of ticket
            ticket_result = ticket_service.generate_booking_ticket(order, payment)
        
        if not ticket_result['success']:
            return jsonify({'message': 'Failed to generate ticket', 'error': ticket_result['error']}), 500
        
        # Send file
        return send_file(
            ticket_result['ticket_path'],
            as_attachment=True,
            download_name=ticket_result['ticket_filename'],
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return jsonify({'message': 'Failed to generate ticket', 'error': str(e)}), 500

@tickets_bp.route('/generate/<order_id>', methods=['POST'])
@jwt_required()
@require_permission('bookings')
def generate_ticket(order_id):
    """Generate ticket for order/booking"""
    try:
        db = current_app.config.get('DB')
        ticket_service = get_ticket_service_instance()
        
        # Find booking/order
        bookings_model = BaseModel(db, 'bookings')
        orders_model = BaseModel(db, 'orders')
        
        booking = bookings_model.find_one({'booking_id': order_id})
        order = orders_model.find_one({'order_id': order_id})
        
        if not booking and not order:
            return jsonify({'message': 'Booking/Order not found'}), 404
        
        # Get payment information
        payments_model = BaseModel(db, 'payments')
        if booking:
            payment = payments_model.find_one({'reference_id': booking['id'], 'reference_type': 'booking'})
            if not payment or payment['status'] != 'completed':
                return jsonify({'message': 'Payment not completed'}), 400
            
            ticket_result = ticket_service.generate_booking_ticket(booking, payment)
        else:
            payment = payments_model.find_one({'reference_id': order['id'], 'reference_type': 'order'})
            if not payment or payment['status'] != 'completed':
                return jsonify({'message': 'Payment not completed'}), 400
            
            ticket_result = ticket_service.generate_booking_ticket(order, payment)
        
        if not ticket_result['success']:
            return jsonify({'message': 'Failed to generate ticket', 'error': ticket_result['error']}), 500
        
        return jsonify({
            'message': 'Ticket generated successfully',
            'ticket_url': ticket_result['public_url'],
            'download_url': f"/api/tickets/{order_id}.pdf"
        }), 200
        
    except Exception as e:
        return jsonify({'message': 'Failed to generate ticket', 'error': str(e)}), 500