# AutoNest Frontend - Docker Deployment Guide

## 📦 Docker Setup Complete!

Your AutoNest frontend is now fully dockerized with production-ready configurations.

## Quick Commands

### Development Setup
```bash
# Build and run with Docker
docker-compose up -d

# View logs
docker-compose logs -f frontend

# Stop containers
docker-compose down
```

### Production Setup
```bash
# Use production compose file with Nginx
docker-compose -f docker-compose.prod.yml up -d

# Rebuild production image
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📁 Files Created

1. **Dockerfile** - Multi-stage optimized production build
2. **.dockerignore** - Excludes unnecessary files
3. **docker-compose.yml** - Development setup
4. **docker-compose.prod.yml** - Production setup with Nginx
5. **nginx.conf** - Nginx reverse proxy configuration
6. **.github/workflows/docker-build.yml** - CI/CD pipeline

## 🚀 Deployment Options

### 1. **Local Docker**
```bash
docker-compose up -d
# Access at http://localhost:3000
```

### 2. **Docker Hub**
```bash
# Build image
docker build -t yourusername/autonest-frontend .

# Push to Docker Hub
docker push yourusername/autonest-frontend

# Run from Docker Hub
docker run -p 3000:3000 yourusername/autonest-frontend
```

### 3. **AWS ECS**
```bash
# Create ECR repository
aws ecr create-repository --repository-name autonest-frontend

# Tag image
docker tag autonest-frontend:latest \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/autonest-frontend:latest

# Push to ECR
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/autonest-frontend:latest
```

### 4. **Kubernetes**
```bash
# Create deployment
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: autonest-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: autonest-frontend
  template:
    metadata:
      labels:
        app: autonest-frontend
    spec:
      containers:
      - name: frontend
        image: yourusername/autonest-frontend:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_BACKEND_URL
          value: "https://pension-backend-rs4h.onrender.com"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: autonest-frontend
spec:
  selector:
    app: autonest-frontend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: LoadBalancer
EOF
```

### 5. **Render (Recommended for simplicity)**
1. Connect GitHub repository
2. Create Web Service
3. Set build command: `npm run build`
4. Set start command: `npm start`
5. Add environment variable: `NEXT_PUBLIC_BACKEND_URL`

### 6. **Vercel (Easiest for Next.js)**
1. Import project from GitHub
2. Set environment variables
3. Deploy (automatic on push)

### 7. **DigitalOcean App Platform**
```bash
# Create app.yaml
cat > app.yaml <<EOF
name: autonest-frontend
services:
- name: web
  github:
    repo: your-username/autonest
    branch: main
  build_command: npm run build
  run_command: npm start
  envs:
  - key: NEXT_PUBLIC_BACKEND_URL
    value: https://pension-backend-rs4h.onrender.com
  http_port: 3000
EOF

# Deploy
doctl apps create --spec app.yaml
```

## 🔒 Security Features

✅ **Non-root user** (nextjs:1001)
✅ **Alpine Linux** (minimal image)
✅ **Health checks** enabled
✅ **Resource limits** configured
✅ **Security headers** in Nginx
✅ **Gzip compression** enabled
✅ **Static file caching** optimized

## 📊 Image Information

- **Base**: node:18-alpine
- **Size**: ~150-200MB (prod)
- **Build Time**: ~2-3 minutes
- **Startup Time**: ~10-15 seconds

## 🔧 Environment Variables

```env
# Required
NEXT_PUBLIC_BACKEND_URL=https://pension-backend-rs4h.onrender.com

# Optional
NODE_ENV=production
PORT=3000
```

## 📈 Performance Tips

1. **Use multi-stage builds** (already done)
2. **Alpine Linux** for smaller images
3. **Nginx caching** for static files
4. **Gzip compression** enabled
5. **Health checks** for auto-recovery
6. **Resource limits** prevent runaway containers

## 🆘 Troubleshooting

**Container won't start:**
```bash
docker-compose logs frontend
docker-compose up -d --remove-orphans
```

**Port already in use:**
```bash
# Change port in docker-compose.yml
# Or kill existing process
lsof -i :3000
kill -9 <PID>
```

**Slow builds:**
```bash
# Use BuildKit
DOCKER_BUILDKIT=1 docker build -t autonest-frontend .
```

**Out of memory:**
```bash
# Increase Docker resources in settings
# Or increase --memory limit in docker-compose.yml
```

## 📚 Additional Resources

- [Docker Docs](https://docs.docker.com)
- [Next.js Docker Guide](https://nextjs.org/docs/deployment/docker)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Kubernetes Docs](https://kubernetes.io/docs/)

## ✨ Next Steps

1. Test locally: `docker-compose up -d`
2. Push to Docker Hub
3. Deploy to your chosen platform
4. Set up monitoring and logging
5. Configure SSL/TLS certificates
6. Set up auto-scaling (if using Kubernetes)

---

**Happy Deploying! 🚀**
