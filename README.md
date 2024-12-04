# Identety

A comprehensive Identity Provider implementing OAuth2 and OpenID Connect (OIDC) protocols with multi-tenant support.


## Self-Hosted Deployment Guide
### Docker Compose (Recommended)

1. Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
 app:
   image: identety/identety:latest
   ports:
     - "3000:3000"
   environment:
     - DATABASE_URL=postgresql://postgres:password@db:5432/identety
     - API_KEY=your-secure-api-key
   depends_on:
     - db

 db:
   image: postgres:15
   environment:
     - POSTGRES_USER=postgres
     - POSTGRES_PASSWORD=password
     - POSTGRES_DB=identety
   volumes:
     - postgres_data:/var/lib/postgresql/data
   ports:
     - "5432:5432"

volumes:
 postgres_data:
```

2. Start services:

```bash
docker-compose up -d
```

### Manual Docker Setup
```bash
docker run -d \
  --name identety \
  -p 3000:3000 \
  -e DATABASE_URL=<your-database-url> \
  -e API_KEY=your-secure-api-key \
  identety/identety:latest

## Change <your-database-url> to your database URL
```


## Features

### Multi-tenancy
- Tenant-specific configurations
- Isolated user management

### OAuth2 Support
- Authorization Code Flow
- Client Credentials Flow
- Refresh Token Flow
- PKCE Support

### OIDC Support
- OpenID Connect Core 1.0
- Discovery Endpoint
- UserInfo Endpoint
- JWKS Endpoint

### Client Types
- Machine-to-Machine (M2M)
    - Service-to-service authentication
    - API integrations

- Single Page Applications (SPA)
    - Browser-based applications
    - PKCE required
    - Token management

- Regular Web Applications
    - Server-side applications
    - Secure client storage
    - Full OAuth2 support

- Native Applications
    - Mobile apps
    - Desktop applications
    - PKCE required

### Authentication Features
- User registration
- Email verification
- Password reset
- MFA support
- Session management

## API Endpoints

### Admin APIs
```
POST   /admin/tenants              # Create tenant
GET    /admin/tenants              # List tenants
POST   /admin/clients              # Create client
GET    /admin/clients              # List clients
POST   /admin/api-keys             # Create API key
```

### OAuth2 APIs
```
POST   /:tenant/oauth/authorize    # Authorization endpoint
POST   /:tenant/oauth/token        # Token endpoint
POST   /:tenant/oauth/revoke       # Revoke token
POST   /:tenant/oauth/introspect   # Introspect token
```

### OIDC APIs
```
GET    /:tenant/.well-known/openid-configuration  # Discovery
GET    /:tenant/oidc/userinfo      # UserInfo endpoint
GET    /:tenant/oidc/jwks          # JWKS endpoint
```

### Auth APIs
```
POST   /:tenant/auth/register      # User registration
POST   /:tenant/auth/login         # User login
POST   /:tenant/auth/forgot-password    # Request password reset
POST   /:tenant/auth/reset-password     # Reset password
```

## Setup

### Prerequisites
```bash
- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for session storage)
```

### Environment Variables
```env
# Server
PORT=3000
NODE_ENV=development

APP_API_KEY=your-app-api-key

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=identity_provider
DB_USER=postgres
DB_PASSWORD=password

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user
SMTP_PASS=password

# Default Tenant
DEFAULT_TENANT_UID=default
```

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-org/identity-provider.git
cd identity-provider
```

2. Install dependencies
```bash
npm install
```

3. Run migrations
```bash
npm run typeorm migration:run
```

4. Start the server
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Usage Examples

### Create M2M Client
```typescript
// 1. Create client
POST /admin/clients
{
  "name": "Background Service",
  "type": "m2m",
  "allowedScopes": [
    "orders:read",
    "orders:process"
  ]
}

// 2. Use client credentials
POST /:tenant/oauth/token
{
  "grant_type": "client_credentials",
  "client_id": "client_id",
  "client_secret": "client_secret",
  "scope": "orders:read orders:process"
}
```

### Implement OAuth2 Login
```typescript
// 1. Redirect to authorization
GET /:tenant/oauth/authorize?
    response_type=code&
    client_id=client_id&
    redirect_uri=https://app.example.com/callback&
    scope=openid profile email

// 2. Exchange code for tokens
POST /:tenant/oauth/token
{
  "grant_type": "authorization_code",
  "code": "auth_code",
  "client_id": "client_id",
  "client_secret": "client_secret",
  "redirect_uri": "https://app.example.com/callback"
}
```

## Security Considerations

- All client secrets must be securely stored
- HTTPS required in production
- CORS properly configured
- Rate limiting implemented
- Input validation on all endpoints
- JWT token security
- SQL injection prevention

## Development

### Running Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Database Migrations
```bash
# Create migration
npm run typeorm migration:create -n MigrationName

# Run migrations
npm run typeorm migration:run

# Revert migration
npm run typeorm migration:revert
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details