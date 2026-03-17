# AWS 3-Tier Deployment: Healthcare Booking App

Deploy the healthcare booking app in a 3-tier structure on AWS:

| Tier | Layer | Component | Where it runs |
|------|--------|-----------|----------------|
| **Web** | web-tier | React frontend (booking-ui) | EC2 (public or behind ALB) |
| **App** | app-layer | Quarkus backend (booking-platform) | EC2 (private app layer) |
| **DB** | db-layer | MySQL | RDS or EC2 in private subnet |

You have the infra; below is **installation and how to run each** component and how they connect.

---

## 1. DB layer (MySQL in private layer)

**Where:** MySQL in your private db-layer (e.g. RDS or EC2 in private subnet).

### 1.1 Ensure connectivity

- App-layer EC2 must reach MySQL (security group: allow **inbound TCP 3306** from app-layer security group).
- No need for web-tier or internet to reach MySQL.

### 1.2 Create database and user

Run on the MySQL server (or RDS):

```sql
CREATE DATABASE booking;
CREATE USER 'booking'@'%' IDENTIFIED BY 'YOUR_SECURE_PASSWORD';
GRANT ALL PRIVILEGES ON booking.* TO 'booking'@'%';
FLUSH PRIVILEGES;
```

Replace `YOUR_SECURE_PASSWORD` with a strong password (you will use it in the app-layer config).

### 1.3 Note the MySQL endpoint

- **RDS:** use the RDS endpoint (e.g. `xxx.xxx.us-east-1.rds.amazonaws.com`).
- **EC2 in private subnet:** use the private IP or private DNS of that EC2.

You will pass this as the DB host to the backend (app-layer).

---

## 2. App layer (Backend on EC2)

**Where:** EC2 in app-layer (private subnet preferred; if public, restrict SSH/access).

### 2.1 Install prerequisites

```bash
# Java 21 (required by Quarkus)
sudo yum install -y java-21-amazon-corretto-headless   # Amazon Linux 2/2023
# OR
sudo apt update && sudo apt install -y openjdk-21-jdk  # Ubuntu

# Maven (to build)
sudo yum install -y maven   # Amazon Linux
# OR
sudo apt install -y maven  # Ubuntu
```

Verify:

```bash
java -version   # should be 21
mvn -version
```

### 2.2 Deploy and build the backend

Copy the `backend/` project to the EC2 (e.g. git clone, rsync, or S3):

```bash
cd /opt/app   # or your chosen path
git clone <your-repo> .
cd healthcare-bk-platform/backend
```

Build for production (no dev profile):

```bash
mvn clean package -DskipTests
```

Artifacts will be under `target/quarkus-app/` (Quarkus default).

### 2.3 Configure the backend for AWS

Create an override config so the backend uses the **db-layer MySQL** and (optional) correct host/port.

**Option A – Environment variables (recommended)**

Set before running the app:

```bash
export QUARKUS_DATASOURCE_JDBC_URL="jdbc:mysql://<MYSQL_HOST>:3306/booking"
export QUARKUS_DATASOURCE_USERNAME="booking"
export QUARKUS_DATASOURCE_PASSWORD="YOUR_SECURE_PASSWORD"
```

Replace `<MYSQL_HOST>` with the MySQL endpoint from step 1.3.

**Option B – `application.properties` override**

Create `config/application.properties` next to the runner (or set in the same directory as `quarkus-run.jar`):

```properties
quarkus.datasource.jdbc.url=jdbc:mysql://<MYSQL_HOST>:3306/booking
quarkus.datasource.username=booking
quarkus.datasource.password=YOUR_SECURE_PASSWORD
```

**CORS:** Allow your web-tier origin (e.g. ALB or EC2 URL of the frontend):

```properties
quarkus.http.cors.origins=https://your-frontend-domain.com,http://your-frontend-ip
```

Add or override this in the same `config/application.properties` or via env:

```bash
export QUARKUS_HTTP_CORS_ORIGINS="https://your-frontend-domain.com"
```

### 2.4 JWT keys (optional for production)

The app ships with classpath JWT keys. For production you can replace them:

- Put `privateKey.pem` and `publicKey.pem` in a directory and point to them, e.g.:

```properties
mp.jwt.verify.publickey.location=file:///opt/app/keys/publicKey.pem
smallrye.jwt.sign.key.location=file:///opt/app/keys/privateKey.pem
```

### 2.5 Run the backend

From the backend directory (or from the directory that contains `quarkus-run.jar` and `lib/`):

```bash
java -jar target/quarkus-app/quarkus-run.jar
```

Or if you run from a different layout:

```bash
java -Dquarkus.http.host=0.0.0.0 -jar target/quarkus-app/quarkus-run.jar
```

- Default port: **8080**. Ensure app-layer security group allows **inbound 8080** from web-tier (or ALB) so the frontend can call the API.
- Flyway will run on startup and apply migrations (V1, V2, V3) to the MySQL `booking` database.

**Run as a service (systemd) – example**

```ini
# /etc/systemd/system/booking-backend.service
[Unit]
Description=Healthcare Booking Backend
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=/opt/app/healthcare-bk-platform/backend
Environment="QUARKUS_DATASOURCE_JDBC_URL=jdbc:mysql://<MYSQL_HOST>:3306/booking"
Environment="QUARKUS_DATASOURCE_USERNAME=booking"
Environment="QUARKUS_DATASOURCE_PASSWORD=YOUR_SECURE_PASSWORD"
ExecStart=/usr/bin/java -jar target/quarkus-app/quarkus-run.jar
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable booking-backend
sudo systemctl start booking-backend
sudo systemctl status booking-backend
```

**Backend URL:** Note the URL at which the app is reachable from the web tier (e.g. `http://app-layer-internal-ip:8080` or `https://api.yourdomain.com`). The frontend will need this as `VITE_API_URL`.

---

## 3. Web layer (Frontend on EC2)

**Where:** EC2 in web-tier (public subnet or behind ALB).

### 3.1 Install Node.js (LTS)

```bash
# Amazon Linux 2 / Amazon Linux 2023
curl -sL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

# Ubuntu
curl -sL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Verify: `node -v` and `npm -v`.

### 3.2 Build the frontend with backend API URL

Copy the repo (or at least `frontend/`) to the EC2, then:

```bash
cd healthcare-bk-platform/frontend
npm ci
```

Set the **backend API base URL** (no trailing slash). Use the URL the browser will use to call the API (e.g. ALB or app-layer URL):

- If the user’s browser calls the backend directly (e.g. same domain with a reverse proxy): you can leave it empty or set to `''`.
- If the browser calls another host/port (e.g. `https://api.yourdomain.com`):

```bash
export VITE_API_URL=https://api.yourdomain.com
npm run build
```

Or inline:

```bash
VITE_API_URL=https://api.yourdomain.com npm run build
```

This produces a static build in `dist/`.

### 3.3 Serve the frontend

**Option A – Nginx (recommended for production)**

Install nginx, then configure a vhost that serves `dist/` and (optional) proxies `/api` to the backend:

```bash
sudo yum install -y nginx   # Amazon Linux
# OR
sudo apt install -y nginx  # Ubuntu
```

Example config (e.g. `/etc/nginx/conf.d/booking.conf`):

```nginx
server {
    listen 80;
    server_name _;   # or your domain
    root /opt/app/healthcare-bk-platform/frontend/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    # Optional: proxy API to backend so frontend can use relative /api/v1
    location /api/ {
        proxy_pass http://<APP_LAYER_IP>:8080/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Replace `<APP_LAYER_IP>` with the backend EC2 private IP (or internal hostname). If you use ALB for the API, point `proxy_pass` to the ALB URL instead. Then:

```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl start nginx
```

**Option B – Simple static server (Node)**

```bash
sudo npm install -g serve
serve -s dist -l 3000
```

Use a process manager (e.g. systemd or PM2) to keep it running. Default: port 3000.

### 3.4 If you do not proxy `/api` in Nginx

Build the frontend with the **full backend URL** so the browser calls the app-layer (or API ALB) directly:

```bash
VITE_API_URL=https://api.yourdomain.com npm run build
```

Ensure the app-layer (or ALB) allows requests from the browser (CORS and security groups as in section 2.3).

---

## 4. Connectivity summary

| From | To | Port | Purpose |
|------|----|------|--------|
| User browser | Web-tier EC2 (or ALB) | 80 / 443 | Frontend (React) |
| Web-tier (Nginx) | App-layer EC2 (or API ALB) | 8080 | Optional: proxy `/api` to backend |
| User browser | App-layer EC2 (or API ALB) | 8080 (or 443) | API calls if not proxied |
| App-layer EC2 | DB-layer MySQL | 3306 | Backend → database |

- **Security groups:** Allow app → DB 3306; web → app 8080 (or ALB); internet (or ALB) → web 80/443.
- **CORS:** Backend must list the frontend origin (protocol + host) in `quarkus.http.cors.origins`.

---

## 5. Quick reference – run each tier

**DB layer**

- MySQL running in db-layer; database `booking` and user `booking` created; app-layer can reach it on 3306.

**App layer (one-time build, then run)**

```bash
cd healthcare-bk-platform/backend
mvn clean package -DskipTests
export QUARKUS_DATASOURCE_JDBC_URL="jdbc:mysql://<MYSQL_HOST>:3306/booking"
export QUARKUS_DATASOURCE_USERNAME=booking
export QUARKUS_DATASOURCE_PASSWORD=...
java -jar target/quarkus-app/quarkus-run.jar
```

**Web layer (one-time build, then serve)**

```bash
cd healthcare-bk-platform/frontend
npm ci
VITE_API_URL=https://your-api-url npm run build
# Serve dist/ with nginx or: serve -s dist -l 3000
```

After this, the web tier serves the React app, the app tier runs the Quarkus backend, and the db layer holds MySQL; the 3-tier setup is in place.
