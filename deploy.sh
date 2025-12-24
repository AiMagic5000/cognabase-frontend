#!/bin/bash
# Cognabase Production Deployment Guide for VPS

echo "================================================"
echo "Cognabase Production Deployment Setup"
echo "================================================"
echo ""

# 1. Environment Setup
echo "Step 1: Update system"
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install -y curl git

# 2. Install Node.js
echo "Step 2: Install Node.js LTS"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Install PM2
echo "Step 3: Install PM2 (process manager)"
sudo npm install -g pm2

# 4. Clone repository
echo "Step 4: Clone Cognabase frontend"
cd /var/www
git clone <your-repo-url> cognabase-frontend
cd cognabase-frontend

# 5. Install dependencies
echo "Step 5: Install dependencies"
npm install

# 6. Create production environment file
echo "Step 6: Configure environment variables"
cat > .env.production.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
N8N_AUTH_SECRET=your-strong-webhook-secret
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your-key
CLERK_SECRET_KEY=sk_live_your-key
EOF

# 7. Build application
echo "Step 7: Building application"
npm run build

# 8. Start with PM2
echo "Step 8: Starting with PM2"
pm2 start npm --name "cognabase" -- start
pm2 save
sudo pm2 startup

# 9. Setup Nginx (reverse proxy)
echo "Step 9: Installing and configuring Nginx"
sudo apt-get install -y nginx
sudo tee /etc/nginx/sites-available/cognabase > /dev/null << 'EOF'
upstream cognabase {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # Proxy settings
    location / {
        proxy_pass http://cognabase;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/cognabase /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 10. Setup SSL with Let's Encrypt
echo "Step 10: Setting up SSL (Let's Encrypt)"
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot certonly --nginx -d your-domain.com

# 11. Setup automatic updates
echo "Step 11: Configuring auto-updates and monitoring"
sudo apt-get install -y unattended-upgrades

echo ""
echo "================================================"
echo "Deployment Complete!"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Update .env.production.local with real Clerk keys"
echo "2. Update .env.production.local with real n8n webhook URL"
echo "3. Update Nginx configuration with your domain"
echo "4. Run: sudo certbot certonly --nginx -d your-domain.com"
echo "5. Monitor with: pm2 monit"
echo "6. View logs: pm2 logs cognabase"
echo ""
echo "Your app is running at https://your-domain.com"
