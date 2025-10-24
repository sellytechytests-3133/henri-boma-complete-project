from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import qrcode
import io
import os
from datetime import datetime
from src.models.base import BaseModel

class TicketService:
    def __init__(self, db):
        self.db = db
        self.tickets_folder = os.path.join(os.getenv('UPLOAD_FOLDER', '/var/www/henri-boma-complete-project/henri-boma-media'), 'tickets')
        os.makedirs(self.tickets_folder, exist_ok=True)
    
    def generate_qr_code(self, data):
        """Generate QR code image"""
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=10,
            border=4,
        )
        qr.add_data(data)
        qr.make(fit=True)
        
        # Create QR code image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to bytes
        img_bytes = io.BytesIO()
        img.save(img_bytes, format='PNG')
        img_bytes.seek(0)
        
        return img_bytes
    
    def generate_booking_ticket(self, booking_data, payment_data):
        """Generate booking ticket PDF"""
        try:
            # Generate filename
            ticket_filename = f"booking_{booking_data.get('booking_id', 'unknown')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            ticket_path = os.path.join(self.tickets_folder, ticket_filename)
            
            # Create PDF document
            doc = SimpleDocTemplate(ticket_path, pagesize=A4)
            story = []
            
            # Get styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=colors.darkblue
            )
            
            heading_style = ParagraphStyle(
                'CustomHeading',
                parent=styles['Heading2'],
                fontSize=16,
                spaceAfter=12,
                alignment=TA_LEFT,
                textColor=colors.darkblue
            )
            
            normal_style = ParagraphStyle(
                'CustomNormal',
                parent=styles['Normal'],
                fontSize=12,
                spaceAfter=6,
                alignment=TA_LEFT
            )
            
            # Title
            story.append(Paragraph("HENRI BOMA RESORT", title_style))
            story.append(Paragraph("BOOKING CONFIRMATION", title_style))
            story.append(Spacer(1, 20))
            
            # QR Code
            qr_data = f"Booking ID: {booking_data.get('booking_id')}\nCustomer: {booking_data.get('guest_name')}\nDate: {booking_data.get('check_in_date')}"
            qr_image = self.generate_qr_code(qr_data)
            
            # Add QR code image
            qr_img = Image(qr_image, width=2*inch, height=2*inch)
            story.append(qr_img)
            story.append(Spacer(1, 20))
            
            # Booking Details
            story.append(Paragraph("BOOKING DETAILS", heading_style))
            
            booking_info = [
                ['Booking ID:', booking_data.get('booking_id', 'N/A')],
                ['Guest Name:', booking_data.get('guest_name', 'N/A')],
                ['Email:', booking_data.get('guest_email', 'N/A')],
                ['Phone:', booking_data.get('guest_phone', 'N/A')],
                ['Check-in Date:', booking_data.get('check_in_date', 'N/A')],
                ['Check-out Date:', booking_data.get('check_out_date', 'N/A')],
                ['Room Type:', booking_data.get('room_type', 'N/A')],
                ['Number of Guests:', str(booking_data.get('number_of_guests', 'N/A'))],
                ['Total Amount:', f"KES {booking_data.get('total_amount', 0):,.2f}"],
                ['Status:', booking_data.get('status', 'N/A').upper()],
            ]
            
            booking_table = Table(booking_info, colWidths=[2*inch, 3*inch])
            booking_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, -1), colors.white),
                ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            
            story.append(booking_table)
            story.append(Spacer(1, 20))
            
            # Payment Details
            if payment_data:
                story.append(Paragraph("PAYMENT DETAILS", heading_style))
                
                payment_info = [
                    ['Payment ID:', payment_data.get('payment_id', 'N/A')],
                    ['Payment Method:', payment_data.get('payment_method', 'N/A').upper()],
                    ['Amount Paid:', f"KES {payment_data.get('amount', 0):,.2f}"],
                    ['Payment Status:', payment_data.get('status', 'N/A').upper()],
                    ['Transaction ID:', payment_data.get('transaction_id', 'N/A')],
                    ['Payment Date:', payment_data.get('completed_at', 'N/A')],
                ]
                
                payment_table = Table(payment_info, colWidths=[2*inch, 3*inch])
                payment_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), colors.white),
                    ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
                    ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ]))
                
                story.append(payment_table)
                story.append(Spacer(1, 20))
            
            # Terms and Conditions
            story.append(Paragraph("TERMS AND CONDITIONS", heading_style))
            terms = [
                "1. This ticket is valid only for the specified dates and guest(s).",
                "2. Check-in time is 2:00 PM, check-out time is 11:00 AM.",
                "3. Cancellations must be made 24 hours in advance for a full refund.",
                "4. No-show bookings will be charged the full amount.",
                "5. Please present this ticket and valid ID upon arrival.",
                "6. The resort reserves the right to refuse service.",
                "7. All prices are inclusive of applicable taxes.",
            ]
            
            for term in terms:
                story.append(Paragraph(term, normal_style))
            
            story.append(Spacer(1, 20))
            
            # Footer
            story.append(Paragraph("Thank you for choosing Henri Boma Resort!", normal_style))
            story.append(Paragraph("For inquiries, contact: info@thehenriboma.com", normal_style))
            story.append(Paragraph("Generated on: " + datetime.now().strftime('%Y-%m-%d %H:%M:%S'), normal_style))
            
            # Build PDF
            doc.build(story)
            
            # Generate public URL
            public_url = f"{os.getenv('MEDIA_BASE_URL', 'https://media.thehenriboma.com')}/tickets/{ticket_filename}"
            
            return {
                'ticket_path': ticket_path,
                'ticket_filename': ticket_filename,
                'public_url': public_url,
                'success': True
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def generate_event_ticket(self, event_data, booking_data, payment_data):
        """Generate event ticket PDF"""
        try:
            # Generate filename
            ticket_filename = f"event_{booking_data.get('booking_id', 'unknown')}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
            ticket_path = os.path.join(self.tickets_folder, ticket_filename)
            
            # Create PDF document
            doc = SimpleDocTemplate(ticket_path, pagesize=A4)
            story = []
            
            # Get styles
            styles = getSampleStyleSheet()
            title_style = ParagraphStyle(
                'CustomTitle',
                parent=styles['Heading1'],
                fontSize=24,
                spaceAfter=30,
                alignment=TA_CENTER,
                textColor=colors.darkblue
            )
            
            # Title
            story.append(Paragraph("HENRI BOMA RESORT", title_style))
            story.append(Paragraph("EVENT TICKET", title_style))
            story.append(Spacer(1, 20))
            
            # QR Code
            qr_data = f"Event: {event_data.get('title')}\nBooking ID: {booking_data.get('booking_id')}\nDate: {event_data.get('event_date')}"
            qr_image = self.generate_qr_code(qr_data)
            
            # Add QR code image
            qr_img = Image(qr_image, width=2*inch, height=2*inch)
            story.append(qr_img)
            story.append(Spacer(1, 20))
            
            # Event Details
            event_info = [
                ['Event:', event_data.get('title', 'N/A')],
                ['Date:', event_data.get('event_date', 'N/A')],
                ['Location:', event_data.get('location', 'N/A')],
                ['Booking ID:', booking_data.get('booking_id', 'N/A')],
                ['Customer Name:', booking_data.get('customer_name', 'N/A')],
                ['Number of Tickets:', str(booking_data.get('quantity', 1))],
                ['Total Amount:', f"KES {booking_data.get('total_amount', 0):,.2f}"],
            ]
            
            # Build PDF similar to booking ticket...
            doc.build(story)
            
            public_url = f"{os.getenv('MEDIA_BASE_URL', 'https://media.thehenriboma.com')}/tickets/{ticket_filename}"
            
            return {
                'ticket_path': ticket_path,
                'ticket_filename': ticket_filename,
                'public_url': public_url,
                'success': True
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }

# Global instance
def get_ticket_service(db):
    return TicketService(db)