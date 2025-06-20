# Ticketing Microservices Platform

A production-ready, event-driven microservices platform for ticket sales and management, built with modern technologies and deployed on Kubernetes.

## Overview

This platform demonstrates enterprise-grade microservices architecture patterns including event-driven communication, advanced authentication with refresh tokens, Redis caching, and comprehensive testing strategies. The system handles the complete ticket lifecycle from creation to payment processing.

## Architecture

### Microservices

- **Auth Service** - User authentication with JWT + refresh token system
- **Tickets Service** - Ticket creation and management
- **Orders Service** - Order processing and lifecycle management
- **Payments Service** - Payment processing with Stripe integration
- **Expiration Service** - Order expiration handling
- **Client** - Next.js frontend application

### Supporting Infrastructure

- **NATS Streaming Server** - Event bus for inter-service communication
- **Redis** - Caching layer and session management
- **MongoDB** - Data persistence for each service
- **Kubernetes** - Container orchestration and deployment
- **Ingress** - Load balancing and routing

## Key Features Demonstrated

### 🔐 Advanced Authentication System

**Phase 1: JWT with Redis Blacklisting**

- JWT token generation and validation
- Redis-based token blacklisting for secure logout
- User session caching for performance optimization

**Phase 2: Dual-Token Refresh System**

- Short-lived access tokens (15 minutes)
- Long-lived refresh tokens (30 days)
- Automatic token refresh workflow
- Multi-device session management
- Rate limiting on refresh attempts
- Secure token revocation

### 🚀 Event-Driven Architecture

- **Asynchronous Communication** - Services communicate via events, not direct HTTP calls
- **Event Sourcing Patterns** - Complete audit trail of system state changes
- **Eventual Consistency** - Data synchronization across distributed services
- **Optimistic Concurrency Control** - Version-based conflict resolution

### 🔄 Microservices Patterns

- **Service Decomposition** - Business capability-based service boundaries
- **Database per Service** - Each service owns its data
- **API Gateway Pattern** - Centralized routing and load balancing
- **Circuit Breaker** - Fault tolerance and graceful degradation
- **Saga Pattern** - Distributed transaction management

### 📊 Data Management

- **Redis Caching Strategy**
  - User session caching
  - Token blacklisting
  - Rate limiting counters
  - Performance optimization
- **MongoDB Collections** - Service-specific data persistence
- **Data Consistency** - Event-driven synchronization

### 🧪 Testing Strategies

- **Unit Testing** - Service-level logic validation
- **Integration Testing** - Inter-service communication testing
- **Mock Strategies** - Redis and external service mocking
- **Test Isolation** - Independent test environments

### ☸️ Kubernetes Deployment

- **Container Orchestration** - Automated deployment and scaling
- **Service Discovery** - Automatic service registration and discovery
- **Load Balancing** - Traffic distribution across service instances
- **Rolling Updates** - Zero-downtime deployments
- **Resource Management** - CPU and memory allocation

## How to Run

### Prerequisites

- Docker Desktop with Kubernetes enabled
- Node.js 16+
- kubectl configured for local cluster
- Skaffold for development workflow

### Development Setup

1. **Clone and setup the project:**

   ```bash
   git clone <repository-url>
   cd ticketing
   ```

2. **Install Skaffold:**

   ```bash
   # macOS
   brew install skaffold

   # Or download from https://skaffold.dev/docs/install/
   ```

3. **Enable Kubernetes in Docker Desktop:**

   - Open Docker Desktop → Settings → Kubernetes → Enable Kubernetes

4. **Install NGINX Ingress Controller:**

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml
   ```

5. **Create required secrets:**

   ```bash
   kubectl create secret generic jwt-secret --from-literal=JWT_KEY=your-secret-key
   kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=your-stripe-secret-key
   ```

6. **Start the development environment:**

   ```bash
   skaffold dev
   ```

7. **Access the application:**
   - Add to `/etc/hosts`: `127.0.0.1 ticketing.dev`
   - Visit: `https://ticketing.dev`

### Production Deployment

For production deployment, configure:

- External MongoDB clusters
- Redis clusters with persistence
- TLS certificates
- External NATS cluster
- Monitoring and logging solutions

## API Endpoints

### Authentication

- `POST /api/users/signup` - User registration
- `POST /api/users/signin` - User login
- `POST /api/users/signout` - User logout
- `GET /api/users/currentuser` - Get current user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/sessions` - Get user sessions
- `DELETE /api/auth/sessions` - Revoke all sessions
- `POST /api/auth/revoke` - Revoke specific token

### Tickets

- `GET /api/tickets` - List all tickets
- `POST /api/tickets` - Create ticket
- `GET /api/tickets/:id` - Get ticket details
- `PUT /api/tickets/:id` - Update ticket

### Orders

- `GET /api/orders` - List user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details
- `DELETE /api/orders/:id` - Cancel order

### Payments

- `POST /api/payments` - Process payment

## Technology Stack

### Backend Services

- **Node.js** with TypeScript
- **Express.js** for REST APIs
- **MongoDB** with Mongoose ODM
- **Redis** for caching and sessions
- **NATS Streaming** for event messaging
- **Jest** for testing

### Frontend

- **Next.js** React framework
- **Bootstrap** for styling
- **Axios** for HTTP requests

### Infrastructure

- **Kubernetes** for orchestration
- **Docker** for containerization
- **NGINX Ingress** for load balancing
- **Skaffold** for development workflow

### External Services

- **Stripe** for payment processing

## Development Workflow

1. **Code Changes** - Edit service code locally
2. **Automatic Rebuild** - Skaffold detects changes and rebuilds containers
3. **Pod Restart** - Kubernetes restarts affected pods
4. **Live Reload** - Changes reflected immediately
5. **Testing** - Run service-specific tests with `npm test`

## Event Flow Examples

### Ticket Purchase Flow

1. User creates order → `OrderCreated` event
2. Tickets service reserves ticket → `TicketUpdated` event
3. Expiration service starts countdown → `ExpirationComplete` event (if needed)
4. Payment service processes payment → `PaymentCreated` event
5. Orders service completes order → `OrderComplete` event

### Authentication Flow

1. User signs up/in → JWT + refresh token issued
2. Client stores tokens securely
3. API requests use short-lived access token
4. Token expires → Client automatically refreshes
5. User logs out → Tokens blacklisted in Redis

## Security Features

- **JWT Token Security** - Short-lived access tokens
- **Refresh Token Rotation** - Enhanced security through token rotation
- **Rate Limiting** - Protection against brute force attacks
- **CORS Protection** - Cross-origin request security
- **Input Validation** - Request sanitization and validation
- **Secret Management** - Kubernetes secrets for sensitive data

## Monitoring and Observability

The platform is designed to integrate with:

- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization
- **ELK Stack** - Centralized logging
- **Jaeger** - Distributed tracing
- **Health Checks** - Service availability monitoring

## License

This project is for educational and demonstration purposes, showcasing modern microservices architecture patterns and best practices.
