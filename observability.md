#
Nice—that stack actually makes observability much easier because Quarkus has lfirst-class Prometheus support 👍

I’ll tailor this specifically to your repo and stack so you can plug it straight into your demo.

🧩 1. Observability Strategy for Your Stack

Your app:

Backend: Quarkus

Frontend: React (Node build/serve)

What we’ll do:
Layer	Approach
Backend	Expose /metrics via Micrometer / Quarkus
Frontend	Optional (basic metrics or skip)
Kubernetes	Auto-scrape via Prometheus
Visualization	Grafana dashboards
☕ 2. Spring Boot Metrics Setup (not used in this repo)

Spring Boot uses Micrometer.

Add dependency

In pom.xml:

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>

<dependency>
  <groupId>io.micrometer</groupId>
  <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>
Enable metrics endpoint

application.yml:

management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus
  endpoint:
    prometheus:
      enabled: true

👉 Your metrics endpoint becomes:

/actuator/prometheus
⚡ 3. Quarkus Metrics Setup

Quarkus is even easier.

Add extension:

./mvnw quarkus:add-extension -Dextensions="micrometer-registry-prometheus"
Config

application.properties:

quarkus.micrometer.export.prometheus.enabled=true
quarkus.micrometer.binder.jvm=true
quarkus.micrometer.binder.http-server=true

Endpoint:

/q/metrics
🧠 4. Key Difference (Important for Prometheus)
Framework	Metrics Path
Quarkus	/q/metrics

👉 You’ll configure Prometheus to scrape `/q/metrics`.

📦 5. Update Your Helm Chart (Critical Step)

Inside your Helm chart:

Add Prometheus annotations

In deployment.yaml:

metadata:
  annotations:
    prometheus.io/scrape: "true"
    prometheus.io/port: "8080"
    prometheus.io/path: "/q/metrics"
Better approach (recommended)

Use ServiceMonitor (since you installed kube-prometheus-stack):

apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: healthcare-monitor
  labels:
    release: monitoring
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: healthcare-backend
  endpoints:
    - port: http
      path: /q/metrics
      interval: 15s

🧪 6. What Metrics You’ll Get (Automatically)

From Quarkus:

HTTP requests count

Response times

JVM memory

CPU usage

Thread count

📊 7. Grafana Dashboards to Use

In Grafana, import:

“JVM (Micrometer)”

“Spring Boot Statistics”

“Kubernetes cluster monitoring”

🧱 8. Frontend Observability (Optional)

React apps don’t expose Prometheus metrics easily.

Options:

Simple (recommended for demo)

👉 Skip frontend metrics

Advanced

Use:

custom endpoint in Node server

or push metrics via API

🔄 9. Full Flow (Your Demo Story)

This is what you’ll show:

User → React UI → Backend (Spring/Quarkus)
                     ↓
                /metrics exposed
                     ↓
Prometheus scrapes
                     ↓
Grafana visualizes
🧪 10. Quick Test

After deployment:

kubectl -n healthcare port-forward svc/healthcare-backend 8080:8080

Test:

curl localhost:8080/q/metrics

👉 If you see metrics = ✅ working

🧭 11. Blog Angle (Make Yours Stand Out)

Instead of generic explanation, write:

🔥 “What I learned integrating observability into a real app”

Include:

Differences between Spring Boot vs Quarkus metrics

Why /metrics endpoints matter

Helm + ServiceMonitor integration

Challenges:

wrong scrape path

missing labels

port issues in Kind

💡 12. Pro Tips (Save You Hours)

Always check:

kubectl get servicemonitor -A

Check Prometheus targets:

http://localhost:9090/targets

If no data in Grafana:
👉 90% of time = wrong path or labels

🚀 If You Want Next

I can:

Build your Helm chart from your repo structure

Add a ready-to-use ServiceMonitor YAML

Or create a full repo structure (GitOps-ready with ArgoCD)

## Demo Runbook (commands in order)

### 0. Prereqs
1. Ensure your observability stack (kube-prometheus-stack) is installed and running.
2. Pick the DB mode for this run: `mysql` or `postgresql`.

### 1. Build backend image (Quarkus)
Backend Dockerfile expects the Quarkus build output under `target/`.
```bash
cd healthcare-booking/backend
./mvnw package -DskipTests
docker build -f src/main/docker/Dockerfile.jvm -t healthcare-backend:latest .
```

### 2. Deploy with raw Kubernetes manifests (Quarkus metrics demo)
Choose one DB block.

#### 2A. MySQL demo
```bash
kubectl apply -f healthcare-booking/k8s/Manifests/namespace.yaml
kubectl apply -f healthcare-booking/k8s/Manifests/mysql.yaml -n healthcare

kubectl apply -f healthcare-booking/k8s/Manifests/backend-service.yaml -n healthcare
kubectl apply -f healthcare-booking/k8s/Manifests/backend-deployment-mysql.yaml -n healthcare
kubectl apply -f healthcare-booking/k8s/Manifests/backend-servicemonitor.yaml -n healthcare
```

#### 2B. PostgreSQL demo
```bash
kubectl apply -f healthcare-booking/k8s/Manifests/namespace.yaml
kubectl apply -f healthcare-booking/k8s/Manifests/postgres.yaml -n healthcare

kubectl apply -f healthcare-booking/k8s/Manifests/backend-service.yaml -n healthcare
kubectl apply -f healthcare-booking/k8s/Manifests/backend-deployment-postgres.yaml -n healthcare
kubectl apply -f healthcare-booking/k8s/Manifests/backend-servicemonitor.yaml -n healthcare
```

### 3. Verify backend metrics endpoint directly
1. Port-forward the backend.
```bash
kubectl -n healthcare port-forward svc/healthcare-backend 8080:8080
```
2. In another terminal, test metrics.
```bash
curl -sS http://localhost:8080/q/metrics | sed -n '1,15p'
```
You should see Prometheus metric HELP/TYPE lines and metric samples.

### 4. Verify Prometheus is scraping (ServiceMonitor -> Prometheus targets)
1. Confirm the ServiceMonitor exists.
```bash
kubectl -n healthcare get servicemonitor
```
2. Find your Prometheus service name in the `monitoring` namespace.
```bash
kubectl -n monitoring get svc | rg -i prometheus
```
3. Port-forward Prometheus UI and check targets.
```bash
kubectl -n monitoring port-forward svc/<PROMETHEUS_SERVICE_NAME> 9090:9090
```
Then open:
`http://localhost:9090/targets`
and confirm you see `healthcare-backend` as an active target.

### 5. (Optional) Deploy frontend + Ingress
If you want the full user demo UI:
```bash
kubectl apply -f healthcare-booking/k8s/Manifests/frontend-deployment.yaml -n healthcare
kubectl apply -f healthcare-booking/k8s/Manifests/frontend-service.yaml -n healthcare
kubectl apply -f healthcare-booking/k8s/Manifests/ingress.yaml -n healthcare
```
Note: ingress requires an ingress controller (the Helm chart defaults to `ingressClassName: nginx`).

### 6. Deploy with Helm (DB switchable)
This installs the chart into `healthcare` and creates a ServiceMonitor for `/q/metrics`.
```bash
helm upgrade --install healthcare-demo healthcare-booking/helm/healthcare-booking-demo \
  --namespace healthcare \
  --set db.type=mysql
```
For PostgreSQL:
```bash
helm upgrade --install healthcare-demo healthcare-booking/helm/healthcare-booking-demo \
  --namespace healthcare \
  --set db.type=postgresql
```
If you don’t have an ingress controller and only want metrics:
```bash
helm upgrade --install healthcare-demo healthcare-booking/helm/healthcare-booking-demo \
  --namespace healthcare \
  --set db.type=mysql \
  --set ingress.enabled=false
```