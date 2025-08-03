# Backend Technical Requirements - پیکسی (Pixie AI Editor)

## Project Overview

**Project Name**: پیکسی (Pixie AI Editor)  
**Type**: AI-Powered Image & Video Creation Platform  
**Architecture**: Microservices-based REST API  
**Primary Language**: Node.js/TypeScript (recommended) or Python/FastAPI  
**Database**: PostgreSQL (primary) + Redis (caching/sessions)  
**File Storage**: AWS S3 or compatible object storage  
**AI Integration**: fal.ai, OpenAI, and other AI service providers  

---

## Core Features & Modules

### 1. Authentication & User Management

#### Requirements:
- JWT-based authentication system
- User registration and login
- Password reset functionality
- Social login integration (Google, Apple)
- Role-based access control (User, Premium, Admin)
- Session management with Redis

#### API Endpoints:
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/verify-email
GET  /api/auth/me
PUT  /api/auth/profile
```

#### Database Schema:
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    subscription_type VARCHAR(50) DEFAULT 'free',
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT
);
```

### 2. File Management System

#### Requirements:
- Secure file upload with validation
- Image compression and optimization
- Multiple format support (JPEG, PNG, WebP)
- File size limits and quotas
- Temporary file cleanup
- CDN integration for fast delivery

#### API Endpoints:
```
POST /api/files/upload
GET  /api/files/:fileId
DELETE /api/files/:fileId
GET  /api/files/user/:userId
POST /api/files/compress
GET  /api/files/:fileId/metadata
```

#### Database Schema:
```sql
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    width INTEGER,
    height INTEGER,
    is_temporary BOOLEAN DEFAULT false,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_files_user_id ON files(user_id);
CREATE INDEX idx_files_expires_at ON files(expires_at);
```

### 3. AI Processing Engine

#### Requirements:
- Integration with multiple AI providers (fal.ai, OpenAI, Stability AI)
- Queue-based job processing
- Real-time progress tracking
- Error handling and retry mechanisms
- Result caching
- Rate limiting per user/subscription

#### AI Service Integrations:
- **fal.ai**: FLUX.1 models for image generation and editing
- **OpenAI**: DALL-E for image generation
- **Stability AI**: Stable Diffusion models
- **Custom Models**: Future integration capability

#### API Endpoints:
```
POST /api/ai/image/generate
POST /api/ai/image/edit
POST /api/ai/image/upscale
POST /api/ai/video/generate
GET  /api/ai/jobs/:jobId/status
GET  /api/ai/jobs/:jobId/result
DELETE /api/ai/jobs/:jobId
GET  /api/ai/models
GET  /api/ai/usage/:userId
```

#### Database Schema:
```sql
CREATE TABLE ai_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_type VARCHAR(50) NOT NULL, -- 'image_generation', 'image_edit', 'video_generation'
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    provider VARCHAR(50) NOT NULL, -- 'fal_ai', 'openai', 'stability_ai'
    model_name VARCHAR(100) NOT NULL,
    input_data JSONB NOT NULL,
    output_data JSONB,
    error_message TEXT,
    progress INTEGER DEFAULT 0,
    credits_used INTEGER DEFAULT 0,
    processing_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

CREATE INDEX idx_ai_jobs_user_id ON ai_jobs(user_id);
CREATE INDEX idx_ai_jobs_status ON ai_jobs(status);
CREATE INDEX idx_ai_jobs_created_at ON ai_jobs(created_at);

CREATE TABLE ai_models (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    model_type VARCHAR(50) NOT NULL, -- 'image_generation', 'image_edit', 'video_generation'
    description TEXT,
    parameters JSONB,
    credits_per_use INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Project & Asset Management

#### Requirements:
- User project organization
- Asset library management
- Project sharing and collaboration
- Version history tracking
- Bulk operations

#### API Endpoints:
```
POST /api/projects
GET  /api/projects
GET  /api/projects/:projectId
PUT  /api/projects/:projectId
DELETE /api/projects/:projectId
POST /api/projects/:projectId/assets
GET  /api/projects/:projectId/assets
DELETE /api/projects/:projectId/assets/:assetId
POST /api/projects/:projectId/share
GET  /api/assets/library
```

#### Database Schema:
```sql
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url TEXT,
    is_public BOOLEAN DEFAULT false,
    settings JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE project_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    file_id UUID REFERENCES files(id) ON DELETE CASCADE,
    asset_type VARCHAR(50) NOT NULL, -- 'input', 'output', 'reference'
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_project_assets_project_id ON project_assets(project_id);
```

### 5. Subscription & Billing System

#### Requirements:
- Multiple subscription tiers
- Credit-based usage tracking
- Payment processing integration (Stripe)
- Usage analytics and reporting
- Automatic billing and renewals

#### API Endpoints:
```
GET  /api/subscriptions/plans
POST /api/subscriptions/subscribe
PUT  /api/subscriptions/upgrade
POST /api/subscriptions/cancel
GET  /api/subscriptions/current
GET  /api/billing/history
GET  /api/usage/current
GET  /api/usage/history
```

#### Database Schema:
```sql
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    credits_per_month INTEGER,
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    stripe_subscription_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE usage_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'image_generation', 'image_edit', 'video_generation'
    credits_used INTEGER NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_tracking_user_id ON usage_tracking(user_id);
CREATE INDEX idx_usage_tracking_created_at ON usage_tracking(created_at);
```

---

## Technical Architecture

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   API Gateway   │    │   Web Frontend  │
│    (Nginx)      │────│   (Express.js)  │────│    (React)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │ Auth Service │ │ File Service│ │ AI Service │
        │  (Node.js)   │ │ (Node.js)   │ │ (Node.js)  │
        └──────────────┘ └─────────────┘ └────────────┘
                │               │               │
        ┌───────▼──────┐ ┌──────▼──────┐ ┌─────▼──────┐
        │ PostgreSQL   │ │   AWS S3    │ │ Redis Queue│
        │   Database   │ │   Storage   │ │  (Bull.js) │
        └──────────────┘ └─────────────┘ └────────────┘
```

### Technology Stack

#### Backend Framework
- **Primary**: Node.js with Express.js and TypeScript
- **Alternative**: Python with FastAPI
- **API Documentation**: Swagger/OpenAPI 3.0

#### Database
- **Primary Database**: PostgreSQL 14+
- **Caching**: Redis 6+
- **Search**: Elasticsearch (optional, for advanced search)

#### File Storage
- **Primary**: AWS S3 or compatible (MinIO for development)
- **CDN**: CloudFront or CloudFlare

#### Queue System
- **Job Queue**: Bull.js with Redis
- **Real-time Updates**: Socket.io or Server-Sent Events

#### Monitoring & Logging
- **Application Monitoring**: New Relic or DataDog
- **Logging**: Winston with structured logging
- **Error Tracking**: Sentry

---

## Security Requirements

### Authentication & Authorization
- JWT tokens with short expiration (15 minutes)
- Refresh token rotation
- Rate limiting on authentication endpoints
- Account lockout after failed attempts
- Two-factor authentication (future)

### Data Protection
- Encryption at rest (database and file storage)
- Encryption in transit (TLS 1.3)
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### File Security
- File type validation
- Virus scanning integration
- Size limits enforcement
- Secure file URLs with expiration
- Content-based file validation

### API Security
- Rate limiting per user and IP
- Request size limits
- CORS configuration
- API key management for external services
- Input validation middleware

---

## Performance Requirements

### Response Times
- Authentication: < 200ms
- File upload: < 5s for 10MB files
- AI job submission: < 500ms
- Database queries: < 100ms (95th percentile)

### Scalability
- Support 1000+ concurrent users
- Horizontal scaling capability
- Auto-scaling based on load
- Database connection pooling
- Caching strategy implementation

### Availability
- 99.9% uptime target
- Graceful degradation
- Health check endpoints
- Circuit breaker pattern
- Backup and disaster recovery

---

## Development Guidelines

### Code Standards
- TypeScript for type safety
- ESLint and Prettier configuration
- Comprehensive unit and integration tests
- Code coverage > 80%
- API documentation with examples

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- End-to-end tests for critical flows
- Load testing for performance validation
- Security testing for vulnerabilities

### Deployment
- Docker containerization
- CI/CD pipeline with GitHub Actions
- Environment-specific configurations
- Database migrations
- Blue-green deployment strategy

---

## External Integrations

### AI Service Providers
- **fal.ai**: Primary AI processing provider
- **OpenAI**: Alternative image generation
- **Stability AI**: Stable Diffusion models
- **Custom Models**: Future integration capability

### Payment Processing
- **Stripe**: Primary payment processor
- **PayPal**: Alternative payment method
- **Local Payment Methods**: Region-specific options

### Communication
- **Email Service**: SendGrid or AWS SES
- **SMS Service**: Twilio (for 2FA)
- **Push Notifications**: Firebase Cloud Messaging

### Analytics
- **User Analytics**: Mixpanel or Amplitude
- **Error Tracking**: Sentry
- **Performance Monitoring**: New Relic

---

## Environment Configuration

### Development Environment
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pixie_dev
REDIS_URL=redis://localhost:6379

# File Storage
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=pixie-dev-files

# AI Services
FAL_AI_API_KEY=your_fal_ai_key
OPENAI_API_KEY=your_openai_key

# Authentication
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

# External Services
STRIPE_SECRET_KEY=your_stripe_secret
SENDGRID_API_KEY=your_sendgrid_key
```

### Production Environment
- Use environment variables or secret management
- Separate databases for different environments
- CDN configuration for file delivery
- Load balancer configuration
- SSL certificate management

---

## Migration Strategy

### Phase 1: Core Backend (Weeks 1-4)
1. Set up project structure and database
2. Implement authentication system
3. Develop file management APIs
4. Basic AI integration with fal.ai

### Phase 2: Advanced Features (Weeks 5-8)
1. Project and asset management
2. Subscription and billing system
3. Advanced AI features
4. Performance optimization

### Phase 3: Production Ready (Weeks 9-12)
1. Security hardening
2. Monitoring and logging
3. Load testing and optimization
4. Documentation and deployment

---

## Success Metrics

### Technical Metrics
- API response time < 500ms (95th percentile)
- Database query time < 100ms (95th percentile)
- File upload success rate > 99%
- AI job completion rate > 95%
- System uptime > 99.9%

### Business Metrics
- User registration conversion rate
- Subscription upgrade rate
- Daily/Monthly active users
- Average session duration
- Feature adoption rates

---

## Support & Maintenance

### Documentation
- API documentation with Swagger
- Database schema documentation
- Deployment guides
- Troubleshooting guides
- Code comments and README files

### Monitoring
- Application performance monitoring
- Database performance monitoring
- Error rate tracking
- User behavior analytics
- Security incident monitoring

### Backup & Recovery
- Daily database backups
- File storage replication
- Disaster recovery procedures
- Data retention policies
- Backup testing procedures

---

## Contact & Resources

**Product Owner**: [Your Name]  
**Technical Lead**: [To be assigned]  
**Project Repository**: [GitHub URL]  
**Documentation**: [Confluence/Notion URL]  
**Slack Channel**: #pixie-backend-dev  

**External Resources**:
- [fal.ai Documentation](https://fal.ai/docs)
- [Stripe API Documentation](https://stripe.com/docs/api)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

*This document should be reviewed and updated regularly as the project evolves. All backend developers should familiarize themselves with these requirements before starting development.*