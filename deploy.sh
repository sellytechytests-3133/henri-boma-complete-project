#!/bin/bash

# Henri Boma Resort Deployment Script
# This script builds and deploys all components of the application

set -e  # Exit on any error

PROJECT_ROOT="/var/www/henri-boma-complete-project"
LOG_FILE="/var/log/henri-boma-deploy.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Starting deployment..."

# Change to project directory
cd "$PROJECT_ROOT"

# Backup current deployment (optional)
log "Creating backup..."
BACKUP_DIR="/var/backups/henri-boma-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

# Backup API
if [ -d "henri-boma-api" ]; then
    cp -r henri-boma-api "$BACKUP_DIR/"
fi

# Backup admin frontend
if [ -d "henri-boma-admin/dist" ]; then
    cp -r henri-boma-admin/dist "$BACKUP_DIR/admin-dist"
fi

# Backup resort frontend
if [ -d "henri-boma-resort/dist" ]; then
    cp -r henri-boma-resort/dist "$BACKUP_DIR/resort-dist"
fi

log "Backup created at $BACKUP_DIR"

# Update Python dependencies
log "Updating Python dependencies..."
cd henri-boma-api
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt --upgrade
fi
cd ..

# Build admin frontend
log "Building admin frontend..."
cd henri-boma-admin

# Install dependencies
if [ -f "package.json" ]; then
    npm install
fi

# Build for production
npm run build

# Copy to web server directory
if [ -d "dist" ]; then
    sudo cp -r dist/* /var/www/admin.thehenriboma.com/
    log "Admin frontend deployed"
else
    log "ERROR: Admin build failed - dist directory not found"
    exit 1
fi

cd ..

# Build resort frontend
log "Building resort frontend..."
cd henri-boma-resort

# Install dependencies
if [ -f "package.json" ]; then
    npm install
fi

# Build for production
npm run build

# Copy to web server directory
if [ -d "dist" ]; then
    sudo cp -r dist/* /var/www/www.thehenriboma.com/
    log "Resort frontend deployed"
else
    log "ERROR: Resort build failed - dist directory not found"
    exit 1
fi

cd ..

# Set proper permissions
log "Setting permissions..."
sudo chown -R www-data:www-data /var/www/
sudo chmod -R 755 /var/www/

# Create media directories
log "Creating media directories..."
sudo mkdir -p /var/www/henri-boma-complete-project/henri-boma-media/{gallery,uploads,tickets,content}
sudo chown -R www-data:www-data /var/www/henri-boma-complete-project/henri-boma-media/
sudo chmod -R 755 /var/www/henri-boma-complete-project/henri-boma-media/

# Restart services
log "Restarting services..."

# Restart API service
if systemctl is-active --quiet henri-boma-api; then
    sudo systemctl restart henri-boma-api
    log "API service restarted"
else
    log "WARNING: API service not running"
fi

# Restart webhook service
if systemctl is-active --quiet henri-boma-webhook; then
    sudo systemctl restart henri-boma-webhook
    log "Webhook service restarted"
else
    log "WARNING: Webhook service not running"
fi

# Reload Nginx
sudo systemctl reload nginx
log "Nginx reloaded"

# Clean up old backups (keep last 5)
log "Cleaning up old backups..."
ls -t /var/backups/henri-boma-* | tail -n +6 | xargs -r rm -rf

log "Deployment completed successfully!"

# Health check
log "Performing health check..."
sleep 5

# Check API health
if curl -f -s http://localhost:5000/api/health > /dev/null; then
    log "API health check passed"
else
    log "WARNING: API health check failed"
fi

# Check admin frontend
if curl -f -s https://admin.thehenriboma.com > /dev/null; then
    log "Admin frontend health check passed"
else
    log "WARNING: Admin frontend health check failed"
fi

# Check resort frontend
if curl -f -s https://www.thehenriboma.com > /dev/null; then
    log "Resort frontend health check passed"
else
    log "WARNING: Resort frontend health check failed"
fi

log "Deployment script completed"