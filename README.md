# Event-Driven Microservices Architecture

A production-ready microservices application demonstrating advanced distributed systems patterns, built with modern technologies and deployed on Kubernetes. This project showcases staff-level engineering practices including event-driven service choreography, infrastructure automation, and shared tooling patterns.

## Overview

This application demonstrates enterprise-grade microservices architecture patterns used in high-scale production environments. Built from the ground up to showcase distributed systems expertise, it implements event-driven communication, advanced authentication with dual-token refresh patterns, distributed caching strategies, and infrastructure-as-code principles. The system handles the complete ticket lifecycle from creation to payment processing while maintaining data consistency across distributed services.

**Engineering Focus**: This project demonstrates the systems thinking and technical practices needed for staff/platform engineering roles, showing how to build scalable applications that would run effectively on modern cloud platforms.

## Repository Structure

```
ticketing/
├── auth/                    # Authentication service
│   ├── src/
│   │   ├── routes/         # API endpoints (signup, signin, refresh)
│   │   ├── services/       # Business logic (TokenService, PasswordService)
│   │   ├── models/         # Database models (User, RefreshToken)
│   │   └── test/           # Service-specific tests
│   └── Dockerfile
├── tickets/                 # Ticket management service
│   ├── src/
│   │   ├── routes/         # CRUD operations for tickets
│   │   ├── models/         # Ticket domain models
│   │   └── events/         # Event publishers/listeners
│   └── Dockerfile
├── orders/                  # Order processing service
│   ├── src/
│   │   ├── routes/         # Order lifecycle management
│   │   ├── models/         # Order and Ticket models
│   │   └── events/         # Order event handling
│   └── Dockerfile
├── payments/                # Payment processing service
│   ├── src/
│   │   ├── routes/         # Stripe integration
│   │   ├── models/         # Payment records
│   │   └── events/         # Payment event publishing
│   └── Dockerfile
├── expiration/              # Order expiration worker
│   ├── src/
│   │   ├── queues/         # Bull queue for timed jobs
│   │   └── events/         # Expiration event publishing
│   └── Dockerfile
├── client/                  # Next.js frontend
│   ├── pages/              # React pages and API routes
│   ├── components/         # Reusable UI components
│   └── hooks/              # Custom React hooks
├── common/                  # Shared library (@trc-ticketing/common)
│   ├── src/
│   │   ├── errors/         # Custom error classes
│   │   ├── middlewares/    # Express middleware
│   │   ├── events/         # Event interfaces and base classes
│   │   └── utils/          # JWT, Redis, validation utilities
│   └── package.json
└── infra/
    └── k8s/                # Kubernetes deployment manifests
        ├── auth-depl.yaml
        ├── ingress-srv.yaml
        ├── nats-depl.yaml
        └── ...
```

**Scale Indicators:**
- **6 services** with independent deployments
- **5 databases** (MongoDB per service + Redis)
- **15+ Kubernetes manifests** for production deployment
- **1 shared common library** reducing code duplication across teams

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

## Staff-Level Engineering Demonstrations

### 🏗️ **Distributed Systems Engineering**

**Shared Infrastructure & Tooling**
- **Common Library (`@trc-ticketing/common`)** - Reusable middleware, error handling, and utilities
- **Standardized Development Patterns** - Consistent authentication, validation, and event handling
- **Developer Experience Optimization** - Unified testing patterns and deployment workflows
- **Cross-Team Scalability** - Architecture that supports multiple development teams

**Infrastructure as Code**
- **Kubernetes-Native Design** - Cloud-agnostic deployment patterns
- **Containerized Services** - Docker containers with Kubernetes orchestration
- **Ingress Configuration** - Load balancing and routing setup
- **Zero-Downtime Deployments** - Rolling updates with Kubernetes

### 🔐 **Advanced Authentication Architecture**

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

### 🚀 **Event-Driven Systems Architecture**

**Event-Based Communication Patterns**
- **Asynchronous Messaging** - Services communicate via NATS Streaming events
- **Event Publishing/Subscribing** - Decoupled service communication
- **Event Store with NATS Streaming** - Durable, ordered event processing
- **Cross-Service Choreography** - Services react to events without central orchestration

**Distributed Systems Patterns**
- **Eventual Consistency Management** - Data synchronization across distributed services
- **Optimistic Concurrency Control** - Version-based conflict resolution preventing race conditions
- **Service Isolation** - Independent service deployments and data stores

### 🔄 **Enterprise Microservices Patterns**

**Service Design Excellence**
- **Domain-Driven Design** - Business capability-based service boundaries
- **Database per Service** - Complete data ownership and isolation
- **API Gateway Pattern** - Centralized routing with service discovery
- **Strangler Fig Pattern** - Ready for legacy system migration

**Enterprise Scalability Patterns**
- **Horizontal Scaling Design** - Stateless services designed for auto-scaling
- **Load Balancing** - NGINX ingress with multiple service instances
- **Resource Management** - Kubernetes resource requests and limits
- **Independent Service Scaling** - Each service scales based on demand

### 📊 **Data & Caching Strategy**

**Advanced Caching Patterns**
- **Multi-Layer Caching** - Application, service, and database level caching
- **Cache Invalidation Strategies** - Event-driven cache updates
- **Distributed Session Management** - Redis-based session clustering
- **Performance Optimization** - Sub-100ms response times through strategic caching

**Data Consistency Patterns**
- **Event-Driven Data Synchronization** - Real-time data consistency across services
- **CQRS Implementation Ready** - Separated read/write models preparation
- **Data Versioning** - Schema evolution without downtime
- **Backup and Recovery** - Point-in-time recovery capabilities

### 🧪 **Testing & Quality Assurance**

**Comprehensive Testing Strategy**
- **Contract Testing** - API contract verification between services
- **Integration Testing** - End-to-end workflow validation
- **Chaos Engineering Ready** - Built to handle service failures
- **Performance Testing** - Load testing patterns and benchmarks

**Development Excellence**
- **Test-Driven Development** - Comprehensive test coverage
- **Mock Strategies** - Isolated testing with external service mocking
- **CI/CD Pipeline Ready** - Automated testing and deployment
- **Code Quality Gates** - Automated quality and security scanning

### ☸️ **Kubernetes & Cloud-Native Patterns**

**Advanced Orchestration**
- **GitOps Deployment** - Infrastructure and application deployment via Git
- **Service Mesh Integration** - Istio/Linkerd ready architecture
- **Auto-Scaling Patterns** - HPA and VPA implementation
- **Blue-Green Deployments** - Zero-downtime deployment strategies

**Production Operations**
- **Health Check Patterns** - Liveness, readiness, and startup probes
- **Resource Management** - Requests, limits, and QoS classes
- **Security Policies** - Pod security standards and network policies
- **Disaster Recovery** - Multi-zone deployment and backup strategies

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

### Complex Distributed Transaction Example

**Ticket Purchase with Compensation Pattern**

1. **Order Creation Phase**
   - User creates order → `OrderCreated` event published
   - Tickets service receives event → reserves ticket → `TicketReserved` event
   - Expiration service starts countdown → schedules `ExpirationComplete` event

2. **Payment Processing Phase**
   - Payment service processes charge → `PaymentProcessed` event
   - Orders service receives confirmation → `OrderCompleted` event

3. **Failure Compensation Example**
   - Payment fails → `PaymentFailed` event
   - Tickets service receives event → releases reservation → `TicketReleased` event
   - Orders service cancels order → `OrderCancelled` event

This demonstrates **saga pattern implementation** with automatic compensation for failed distributed transactions.

### Advanced Authentication Flow

**Multi-Device Session Management**

**Multi-Device Session Management**

1. **Initial Authentication**
   - User signs up/in → Dual tokens issued (access + refresh)
   - Device fingerprinting for session tracking
   - Redis stores session metadata with TTL

2. **Token Refresh Cycle**
   - Access token expires (15min) → Client auto-refreshes
   - Refresh token rotation for enhanced security
   - Failed refresh attempts trigger security alerts

3. **Cross-Device Security**
   - New device login → Notification to existing devices
   - Suspicious activity → Automatic session revocation
   - User-initiated logout → All device sessions invalidated

This demonstrates **zero-trust security principles** with comprehensive session lifecycle management.

## Code Highlights

### Event Publication & Listening

**Publishing Events (Orders Service)**
```typescript
// orders/src/routes/new.ts
const order = Order.build({ userId, status: OrderStatus.Created, expiresAt, ticket });
await order.save();

// Publish order created event
await new OrderCreatedPublisher(natsWrapper.client).publish({
  id: order.id,
  version: order.version,
  status: order.status,
  userId: order.userId,
  expiresAt: order.expiresAt.toISOString(),
  ticket: { id: ticket.id, price: ticket.price }
});
```

**Listening to Events (Tickets Service)**
```typescript
// tickets/src/events/listeners/order-created-listener.ts
export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error('Ticket not found');
    
    ticket.set({ orderId: data.id });
    await ticket.save();
    msg.ack();
  }
}
```

### Token Refresh Logic

**Dual-Token Authentication**
```typescript
// auth/src/services/token.ts
static async generateTokenPair(user: { id: string; email: string }): Promise<TokenPair> {
  const accessToken = generateJWT({ id: user.id, email: user.email });
  const refreshTokenValue = randomBytes(64).toString("hex");
  
  // Save to database and cache in Redis
  const refreshToken = RefreshToken.build({
    token: refreshTokenValue,
    userId: user.id,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  });
  await refreshToken.save();
  
  await redisClient.setJSON(`refresh_token:${refreshTokenValue}`, {
    userId: user.id, deviceInfo, expiresAt: refreshToken.expiresAt
  }, 30 * 24 * 60 * 60);
  
  return { accessToken, refreshToken: refreshTokenValue };
}
```

### Redis Blacklist Check

**Secure Logout Implementation**
```typescript
// auth/src/routes/signout.ts
router.post("/api/users/signout", async (req, res) => {
  if (req.session?.jwt) {
    const payload = verifyJWT(req.session.jwt);
    
    if (payload.jti) {
      const remainingTTL = payload.exp - Math.floor(Date.now() / 1000);
      if (remainingTTL > 0) {
        await redisClient.set(`blacklist:${payload.jti}`, "1", { EX: remainingTTL });
      }
    }
  }
  req.session = null;
  res.send({});
});
```

### Test Suite Pattern

**Integration Testing with Supertest + Jest**
```typescript
// auth/src/routes/__test__/signup.test.ts
it('returns a 201 on successful signup', async () => {
  return request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' })
    .expect(201);
    
  expect(response.get('Set-Cookie')).toBeDefined();
});
```

## Future Enhancements

The architecture is designed to support additional enterprise patterns:

### **Advanced Resilience Patterns**
- **Circuit breaker implementation** for external service calls with configurable thresholds
- **Bulkhead isolation** for resource protection and failure containment
- **Timeout and retry policies** with exponential backoff and jitter
- **Health check endpoints** with deep health monitoring (database, Redis, NATS)

### **Enhanced Observability & Monitoring**

**Metrics Collection**
- **Prometheus integration** with custom business metrics
  - Request latency histograms
  - Error rate by service and endpoint
  - Active user sessions and token refresh rates
  - Order processing funnel metrics
- **Grafana dashboards** for real-time monitoring and alerting

**Distributed Tracing**
- **Jaeger integration** for request flow visualization
  - Cross-service request tracing
  - Performance bottleneck identification
  - Event propagation tracking
- **OpenTelemetry** instrumentation for vendor-neutral observability

**Centralized Logging**
- **ELK Stack integration** (Elasticsearch, Logstash, Kibana)
  - Structured JSON logging across all services
  - Log correlation with trace IDs
  - Security event monitoring and alerting
- **Fluentd/Fluent Bit** for log aggregation and forwarding

**Application Performance Monitoring**
- **Custom business metrics** and SLO monitoring
  - 99.9% uptime targets with error budgets
  - Payment success rates and latency tracking
  - User journey completion rates
- **Real-time alerting** integration (PagerDuty, Slack)

### **Event Sourcing & CQRS**
- **Event store implementation** for complete audit trails and compliance
- **Command Query Responsibility Segregation** patterns for read/write optimization
- **Event replay capabilities** for debugging, testing, and recovery scenarios
- **Snapshot mechanisms** for performance optimization of event rebuilds

### **Service Mesh & Advanced Networking**
- **Istio or Linkerd integration** for advanced traffic management
  - Mutual TLS between all services
  - Advanced routing, canary deployments, and A/B testing
  - Traffic policies and rate limiting at the mesh level
- **Zero-trust networking** with service-to-service authentication

### **Security & Compliance Enhancements**
- **Secrets management** with external providers (HashiCorp Vault, AWS Secrets Manager)
- **Audit logging** for compliance (SOC 2, PCI DSS readiness)
- **Rate limiting** with distributed rate limiting across service instances
- **Input validation** enhancements with schema validation and sanitization

### **Development & Operations**
- **Load testing** infrastructure with realistic traffic patterns
- **Blue-green deployments** for zero-downtime releases
- **Infrastructure as Code** with Terraform for cloud resource management
