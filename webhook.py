#!/usr/bin/env python3
"""
GitHub Webhook Handler for Auto-Deployment
This script handles GitHub webhooks and triggers deployment
"""

import os
import subprocess
import json
import hmac
import hashlib
from flask import Flask, request, jsonify
from datetime import datetime
import logging

app = Flask(__name__)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/henri-boma-webhook.log'),
        logging.StreamHandler()
    ]
)

WEBHOOK_SECRET = os.getenv('WEBHOOK_SECRET', 'your-webhook-secret-change-in-production')
PROJECT_ROOT = '/var/www/henri-boma-complete-project'

def verify_signature(payload, signature):
    """Verify GitHub webhook signature"""
    if not WEBHOOK_SECRET:
        return True  # Skip verification if no secret set
    
    expected_signature = 'sha256=' + hmac.new(
        WEBHOOK_SECRET.encode(),
        payload,
        hashlib.sha256
    ).hexdigest()
    
    return hmac.compare_digest(signature, expected_signature)

def run_command(command, cwd=None):
    """Run shell command and return result"""
    try:
        result = subprocess.run(
            command,
            shell=True,
            cwd=cwd or PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        return {
            'success': result.returncode == 0,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            'success': False,
            'stdout': '',
            'stderr': 'Command timed out after 5 minutes',
            'returncode': -1
        }
    except Exception as e:
        return {
            'success': False,
            'stdout': '',
            'stderr': str(e),
            'returncode': -1
        }

@app.route('/webhook', methods=['POST'])
def webhook():
    """Handle GitHub webhook"""
    try:
        # Get headers
        signature = request.headers.get('X-Hub-Signature-256', '')
        event_type = request.headers.get('X-GitHub-Event', '')
        
        # Get payload
        payload = request.get_data()
        
        # Verify signature
        if not verify_signature(payload, signature):
            logging.error("Invalid webhook signature")
            return jsonify({'error': 'Invalid signature'}), 401
        
        # Parse payload
        data = json.loads(payload)
        
        # Only process push events to main branch
        if event_type == 'push':
            ref = data.get('ref', '')
            if ref == 'refs/heads/main':
                logging.info(f"Processing push to main branch from {data.get('pusher', {}).get('name', 'unknown')}")
                
                # Pull latest changes
                pull_result = run_command('git pull origin main')
                
                if pull_result['success']:
                    logging.info("Git pull successful")
                    
                    # Run deployment script
                    deploy_result = run_command('./deploy.sh')
                    
                    if deploy_result['success']:
                        logging.info("Deployment successful")
                        
                        # Restart services
                        restart_result = run_command('sudo systemctl restart henri-boma-api')
                        
                        if restart_result['success']:
                            logging.info("API service restarted successfully")
                            return jsonify({
                                'message': 'Deployment successful',
                                'timestamp': datetime.now().isoformat(),
                                'commit': data.get('head_commit', {}).get('id', 'unknown')[:7]
                            }), 200
                        else:
                            logging.error(f"Failed to restart API service: {restart_result['stderr']}")
                            return jsonify({
                                'message': 'Deployment completed but failed to restart service',
                                'error': restart_result['stderr']
                            }), 500
                    else:
                        logging.error(f"Deployment failed: {deploy_result['stderr']}")
                        return jsonify({
                            'message': 'Deployment failed',
                            'error': deploy_result['stderr']
                        }), 500
                else:
                    logging.error(f"Git pull failed: {pull_result['stderr']}")
                    return jsonify({
                        'message': 'Git pull failed',
                        'error': pull_result['stderr']
                    }), 500
            else:
                logging.info(f"Ignoring push to {ref}")
                return jsonify({'message': 'Push to non-main branch ignored'}), 200
        else:
            logging.info(f"Ignoring event type: {event_type}")
            return jsonify({'message': f'Event type {event_type} ignored'}), 200
            
    except Exception as e:
        logging.error(f"Webhook error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Henri Boma Webhook Handler'
    })

@app.route('/deploy', methods=['POST'])
def manual_deploy():
    """Manual deployment trigger"""
    try:
        logging.info("Manual deployment triggered")
        
        # Pull latest changes
        pull_result = run_command('git pull origin main')
        
        if pull_result['success']:
            # Run deployment script
            deploy_result = run_command('./deploy.sh')
            
            if deploy_result['success']:
                # Restart services
                restart_result = run_command('sudo systemctl restart henri-boma-api')
                
                return jsonify({
                    'message': 'Manual deployment successful',
                    'timestamp': datetime.now().isoformat()
                }), 200
            else:
                return jsonify({
                    'message': 'Deployment failed',
                    'error': deploy_result['stderr']
                }), 500
        else:
            return jsonify({
                'message': 'Git pull failed',
                'error': pull_result['stderr']
            }), 500
            
    except Exception as e:
        logging.error(f"Manual deploy error: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=9000, debug=False)