# AutoNest Frontend - Docker Deployment Guide

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Backend API URL (defaults to https://pension-backend-rs4h.onrender.com)

### Build and Run

```bash
# Build the image
docker build -t autonest-frontend .

# Run the container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_BACKEND_URL=https://pension-backend-rs4h.onrender.com \
  autonest-frontend

# Or use Docker Compose (recommended)
docker-compose up -d
```

### Environment Variables

Create a `.env.docker` file or pass these to docker-compose:

```env
NODE_ENV=production
NEXT_PUBLIC_BACKEND_URL=https://pension-backend-rs4h.onrender.com
```

### Docker Compose Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f frontend

# Rebuild image
docker-compose up -d --build

# Remove everything including volumes
docker-compose down -v
```

### Image Details

- **Base Image**: node:18-alpine (lightweight)
- **Size**: ~150-200MB
- **Non-root user**: nextjs (uid: 1001)
- **Health Check**: Enabled with 30s interval
- **Multi-stage build**: Optimized for production

### Production Deployment

For production, you can:

1. **Push to Docker Hub**:
```bash
docker tag autonest-frontend username/autonest-frontend:latest
docker push username/autonest-frontend:latest
```

2. **Deploy to Kubernetes**:
```bash
kubectl apply -f kubernetes-deployment.yaml
```

3. **Deploy to Cloud Services**:
   - AWS ECS
   - Google Cloud Run
   - Azure Container Instances
   - DigitalOcean App Platform

### Troubleshooting

**Container exits immediately:**
```bash
docker-compose logs frontend
```

**Port already in use:**
```bash
docker-compose down
# Or change port in docker-compose.yml
```

**Health check failing:**
- Ensure `NEXT_PUBLIC_BACKEND_URL` is correct
- Check network connectivity
- Review logs: `docker-compose logs frontend`

### Security Notes

✅ Non-root user (nextjs)
✅ Alpine Linux (minimal attack surface)
✅ Proper signal handling (dumb-init)
✅ Health checks enabled
✅ .dockerignore optimized
✅ No hardcoded secrets

### Performance Tips

- Use volume mounts for logs only in development
- Consider nginx reverse proxy for production
- Use a container registry (Docker Hub, ECR, etc.)
- Set resource limits in production
