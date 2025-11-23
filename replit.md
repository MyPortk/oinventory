# Inventory Management System

## Overview

A full-stack inventory management system built for equipment tracking and reservation workflows. The application enables employees to browse available equipment, request reservations, and manage check-out/check-in processes, while administrators oversee approvals, user management, and system-wide operations. The system features bilingual support (English/Arabic), QR code integration for physical item tracking, and comprehensive activity logging.

**Core Capabilities:**
- Category-based equipment organization with dynamic sub-types
- Reservation workflow with approval process
- QR code generation and scanning for item tracking
- Real-time notifications system
- Activity and audit logging
- User management with role-based access control (admin/user)
- Maintenance status tracking

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- React 18 with TypeScript
- Vite as build tool and development server
- TanStack Query (React Query) for server state management
- Shadcn UI component library (New York variant) with Radix UI primitives
- Tailwind CSS for styling with custom design tokens

**Component Structure:**
- Page-level components in `client/src/pages/` (Login, Inventory, Reservations, ActivityLogs, QRCodes, Maintenance, UserManagement)
- Reusable UI components in `client/src/components/` following Shadcn patterns
- Path aliases configured for clean imports (`@/` for client, `@shared/` for shared types)

**State Management:**
- Session-based authentication state
- React Query for API data caching and synchronization with 5-10 second polling intervals for real-time updates
- Local state for UI interactions (dialogs, forms, view modes)

**Design System:**
- Custom CSS variables for theming (light/dark mode support)
- Consistent spacing scale (2, 4, 6, 8 Tailwind units)
- Typography hierarchy with specific font weights for data-dense interfaces
- System-based design prioritizing clarity and efficiency

### Backend Architecture

**Technology Stack:**
- Node.js with Express.js
- TypeScript with ES modules
- Session-based authentication using express-session with MemoryStore
- Bcrypt for password hashing

**API Design:**
- RESTful endpoints organized by resource type
- Session middleware for authentication (`requireAuth`, `requireAdmin`)
- JSON request/response format
- Credentials included in requests for session persistence

**Key API Routes:**
- `/api/auth/*` - Authentication (login/logout)
- `/api/items/*` - Item CRUD operations
- `/api/categories/*` - Category management
- `/api/reservations/*` - Reservation workflow
- `/api/users/*` - User management (admin only)
- `/api/activity-logs/*` - Activity tracking
- `/api/notifications/*` - Notification system
- `/api/qrcodes/*` - QR code generation

**Authentication & Authorization:**
- Session-based authentication stored in memory (production should use persistent store)
- Role-based access control (admin vs user roles)
- Middleware functions enforce authentication requirements
- Password hashing with bcrypt (10 salt rounds)

### Data Storage

**Database:**
- PostgreSQL as primary database
- Drizzle ORM for type-safe database operations
- Connection pooling via `pg` package
- Neon Database serverless driver (`@neondatabase/serverless`)

**Schema Design (from shared/schema.ts):**
- **users** - Authentication and user profiles (id, username, password, email, name, role, department)
- **items** - Inventory items (id, barcode, productName, productType, status, location, notes, qrCode)
- **categories** - Equipment categories (id, name, image, subTypes array)
- **reservations** - Booking system (id, itemId, userId, startDate, returnDate, status, notes, timestamps)
- **activityLogs** - Audit trail (id, userId, userName, action, itemName, timestamp)
- **notifications** - User notifications (id, userId, message, type, isRead, timestamp)
- **itemEditHistory** - Item modification tracking
- **reservationStatusHistory** - Reservation status change tracking

**Status Enumerations:**
- Item statuses: Available, In Use, Reserved, Maintenance
- Reservation statuses: Pending, Approved, Rejected, Active, Completed, Cancelled

**Migration Strategy:**
- Drizzle Kit for schema migrations
- Migration files in `./migrations` directory
- Push-based deployment with `drizzle-kit push`

### External Dependencies

**UI Component Libraries:**
- Radix UI primitives (dialog, dropdown, select, etc.) for accessible components
- Shadcn UI as the component system layer
- Lucide React for consistent iconography
- date-fns for date formatting and manipulation
- React Hook Form with Zod resolvers for form validation

**QR Code Integration:**
- QRCode library (`qrcode` package) for server-side generation
- QR codes stored as base64 data URLs in database
- Scanner functionality for check-in/check-out workflows

**Email Service:**
- Nodemailer for email notifications (optional, requires SMTP configuration)
- Environment variables: EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
- Graceful degradation when email not configured

**Development Tools:**
- Replit-specific plugins for development banner and cartographer
- Runtime error overlay for debugging
- ESBuild for production bundling
- TSX for TypeScript execution in development

**Session Management:**
- express-session with MemoryStore for development
- Production should use connect-pg-simple for PostgreSQL-backed sessions
- 24-hour session expiration
- HTTP-only cookies with CSRF protection

**Build & Deployment:**
- Separate build processes for client (Vite) and server (ESBuild)
- Client builds to `dist/public`
- Server bundles to `dist/index.js`
- Static file serving in production mode

**Environment Configuration:**
- DATABASE_URL - PostgreSQL connection string (required)
- SESSION_SECRET - Session encryption key (defaults to development key)
- EMAIL_* - Optional email service configuration
- NODE_ENV - Environment flag (development/production)