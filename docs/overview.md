# Smart Campus Operations Hub - Project Context

## Core Requirements (Must Implement)
1. **Module A**: Facilities & Assets Catalogue (CRUD, search/filter)
2. **Module B**: Booking Management (approval workflow, conflict detection)
3. **Module C**: Maintenance Tickets (workflow, attachments, comments)
4. **Module D**: Notifications (in-app + email)
5. **Module E**: Authentication (JWT + Google OAuth2)

## Additional Features (Implemented)
- Admin Analytics Dashboard (usage metrics, charts)
- Notification Preferences (enable/disable categories)
- Booking Recurrence (weekly recurring bookings)
- Email Digest (weekly summary for users, daily for admins)

## Architecture Decisions
- **Database**: Neon PostgreSQL (cloud-hosted)
- **Email**: Gmail SMTP
- **File Storage**: Cloudinary (ticket attachments - max 3 images)
- **API Versioning**: `/api/v1/*`
- **Security**: Role-based access (USER, ADMIN, TECHNICIAN)

## REST API Design Principles (Critical)
- **HATEOAS**: All responses include `_links` for navigation
- **Proper HTTP Methods**: GET (read), POST (create), PUT (full update), PATCH (partial update), DELETE
- **Correct Status Codes**: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Internal Server Error
- **Consistent Naming**: Plural nouns (`/facilities` not `/facility`), kebab-case
- **Stateless**: JWT tokens, no server-side sessions

## Key Workflows
**Booking**: PENDING → APPROVED/REJECTED → CANCELLED
**Ticket**: OPEN → IN_PROGRESS → RESOLVED → CLOSED/REJECTED

## External Services Integration
- **Cloudinary**: Image upload for ticket attachments
- **Gmail SMTP**: Email notifications
- **Google OAuth2**: Social login

## Non-Functional Requirements
- **Security**: BCrypt passwords, JWT tokens, role-based access
- **Validation**: All inputs validated (Hibernate Validator)
- **Error Handling**: Consistent error responses with GlobalExceptionHandler
- **Logging**: SLF4J with meaningful logs (INFO for business, ERROR for exceptions)
- **Testing**: Unit tests for services, integration tests for controllers

## Root Directory Structure
```
smart-campus-hub/
├── backend/                 # Spring Boot application
├── frontend/                # React + Vite application
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # GitHub Actions workflow
├── docker-compose.yml      # Optional: local development setup
├── .gitignore
└── README.md
```

## Backend Project Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── smartcampus/
│   │   │           ├── SmartCampusApplication.java
│   │   │           ├── config/              # Configuration classes
│   │   │           │   ├── SecurityConfig.java
│   │   │           │   ├── JwtConfig.java
│   │   │           │   ├── CorsConfig.java
│   │   │           │   └── SwaggerConfig.java
│   │   │           ├── controller/          # REST Controllers (API Layer)
│   │   │           │   ├── AuthController.java
│   │   │           │   ├── FacilityController.java
│   │   │           │   ├── BookingController.java
│   │   │           │   ├── TicketController.java
│   │   │           │   └── NotificationController.java
│   │   │           ├── dto/                 # Data Transfer Objects
│   │   │           │   ├── request/
│   │   │           │   │   ├── LoginRequest.java
│   │   │           │   │   ├── BookingRequest.java
│   │   │           │   │   └── TicketRequest.java
│   │   │           │   └── response/
│   │   │           │       ├── ApiResponse.java
│   │   │           │       ├── FacilityResponse.java
│   │   │           │       └── BookingResponse.java
│   │   │           ├── model/               # JPA Entities
│   │   │           │   ├── User.java
│   │   │           │   ├── Role.java
│   │   │           │   ├── Facility.java
│   │   │           │   ├── Booking.java
│   │   │           │   ├── Ticket.java
│   │   │           │   ├── Comment.java
│   │   │           │   └── Notification.java
│   │   │           ├── repository/          # JPA Repositories
│   │   │           │   ├── UserRepository.java
│   │   │           │   ├── FacilityRepository.java
│   │   │           │   ├── BookingRepository.java
│   │   │           │   └── TicketRepository.java
│   │   │           ├── service/             # Business Logic
│   │   │           │   ├── AuthService.java
│   │   │           │   ├── FacilityService.java
│   │   │           │   ├── BookingService.java
│   │   │           │   ├── TicketService.java
│   │   │           │   └── NotificationService.java
│   │   │           ├── security/            # Security Components
│   │   │           │   ├── JwtTokenProvider.java
│   │   │           │   ├── JwtAuthenticationFilter.java
│   │   │           │   ├── CustomUserDetailsService.java
│   │   │           │   └── OAuth2SuccessHandler.java
│   │   │           ├── exception/           # Custom Exceptions
│   │   │           │   ├── ResourceNotFoundException.java
│   │   │           │   ├── BookingConflictException.java
│   │   │           │   ├── UnauthorizedException.java
│   │   │           │   └── GlobalExceptionHandler.java
│   │   │           └── util/                # Utility Classes
│   │   │               ├── DateTimeUtil.java
│   │   │               └── ValidationUtil.java
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── db/
│   │           └── migration/               # Flyway/Liquibase migrations (optional)
│   └── test/
│       └── java/
│           └── com/
│               └── smartcampus/
│                   ├── controller/
│                   ├── service/
│                   └── integration/
├── pom.xml                                  # Maven dependencies
└── README.md
```

## Frontend Project Structure
```
frontend/
├── public/
│   └── assets/
│       └── images/
├── src/
│   ├── api/                     # API integration layer
│   │   ├── axiosConfig.js      # Axios instance with interceptors
│   │   ├── authApi.js
│   │   ├── facilityApi.js
│   │   ├── bookingApi.js
│   │   ├── ticketApi.js
│   │   └── notificationApi.js
│   ├── components/              # Reusable components
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Spinner.jsx
│   │   │   └── Toast.jsx
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── GoogleLoginButton.jsx
│   │   ├── facilities/
│   │   │   ├── FacilityCard.jsx
│   │   │   ├── FacilityFilter.jsx
│   │   │   └── FacilityForm.jsx
│   │   ├── bookings/
│   │   │   ├── BookingCalendar.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   └── BookingList.jsx
│   │   ├── tickets/
│   │   │   ├── TicketCard.jsx
│   │   │   ├── TicketForm.jsx
│   │   │   ├── CommentSection.jsx
│   │   │   └── ImageUpload.jsx
│   │   └── notifications/
│   │       ├── NotificationPanel.jsx
│   │       └── NotificationItem.jsx
│   ├── pages/                   # Page components (routes)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Facilities.jsx
│   │   ├── FacilityDetails.jsx
│   │   ├── Bookings.jsx
│   │   ├── MyBookings.jsx
│   │   ├── Tickets.jsx
│   │   ├── TicketDetails.jsx
│   │   ├── AdminDashboard.jsx   # Analytics dashboard
│   │   └── NotFound.jsx
│   ├── context/                 # React Context for state management
│   │   ├── AuthContext.jsx
│   │   └── NotificationContext.jsx
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js
│   │   ├── useFacilities.js
│   │   ├── useBookings.js
│   │   └── useNotifications.js
│   ├── routes/                  # Route configuration
│   │   ├── AppRoutes.jsx
│   │   ├── PrivateRoute.jsx
│   │   └── AdminRoute.jsx
│   ├── utils/                   # Utility functions
│   │   ├── dateFormatter.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── styles/                  # Tailwind CSS + custom styles
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── .env.development
├── .env.production
├── .eslintrc.cjs
├── .prettierrc
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

# Complete REST API Endpoint Design
## API Naming Conventions
- Base URL: http://localhost:8080/api/v1
- Use nouns for resources, not verbs
- Plural nouns for collections (/facilities, not /facility)
- Consistent naming: kebab-case for multi-word resources
- Proper HTTP methods: GET, POST, PUT, PATCH, DELETE
- Status codes: Follow HTTP standards strictly

## Authentication Endpoints
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/google
POST   /api/v1/auth/refresh-token
POST   /api/v1/auth/logout
GET    /api/v1/auth/me     # Get current user info
```

## Example Request/Response:
```
// POST /api/v1/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response (200 OK)
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "_links": {
      "self": { "href": "/api/v1/users/uuid" },
      "profile": { "href": "/api/v1/users/uuid/profile" }
    }
  }
}
```

## Module A: Facilities & Assets Catalogue
```
GET    /api/v1/facilities                         # List all (with search/filter)
GET    /api/v1/facilities/{id}                    # Get single facility
POST   /api/v1/facilities                         # Create (ADMIN only)
PUT    /api/v1/facilities/{id}                    # Full update (ADMIN)
PATCH  /api/v1/facilities/{id}                    # Partial update (ADMIN)
DELETE /api/v1/facilities/{id}                    # Soft delete (ADMIN)
GET    /api/v1/facilities/search?type=LAB&capacity=30&location=BuildingA
GET    /api/v1/facilities/{id}/availability?date=2026-04-15
```

## Example Response with HATEOAS:
```
// GET /api/v1/facilities/123
{
  "id": "123",
  "name": "Computer Lab 01",
  "type": "LAB",
  "capacity": 40,
  "location": "Building A - Floor 2",
  "status": "ACTIVE",
  "equipment": ["Projector", "Whiteboard", "Air Conditioning"],
  "availabilityWindows": [
    { "dayOfWeek": "MONDAY", "startTime": "08:00", "endTime": "18:00" }
  ],
  "createdAt": "2026-01-15T10:00:00Z",
  "updatedAt": "2026-03-20T14:30:00Z",
  "_links": {
    "self": { "href": "/api/v1/facilities/123" },
    "bookings": { "href": "/api/v1/facilities/123/bookings" },
    "availability": { "href": "/api/v1/facilities/123/availability" },
    "tickets": { "href": "/api/v1/facilities/123/tickets" },
    "update": { 
      "href": "/api/v1/facilities/123", 
      "method": "PUT",
      "requires": "ADMIN"
    },
    "delete": { 
      "href": "/api/v1/facilities/123", 
      "method": "DELETE",
      "requires": "ADMIN"
    }
  }
}
```

## Module B:
```
GET    /api/v1/bookings                           # List all bookings (ADMIN)
GET    /api/v1/bookings/my-bookings               # Current user's bookings
GET    /api/v1/bookings/{id}                      # Get single booking
POST   /api/v1/bookings                           # Request a booking
PUT    /api/v1/bookings/{id}                      # Update booking (before approval)
DELETE /api/v1/bookings/{id}                      # Cancel booking
PATCH  /api/v1/bookings/{id}/approve              # Approve (ADMIN)
PATCH  /api/v1/bookings/{id}/reject               # Reject (ADMIN)
GET    /api/v1/bookings?status=PENDING&facilityId=123&date=2026-04-15
```

### Workflow States: PENDING → APPROVED / REJECTED → CANCELLED (after approval)

## Example Request:
```
// POST /api/v1/bookings
{
  "facilityId": "123",
  "startDateTime": "2026-04-20T10:00:00",
  "endDateTime": "2026-04-20T12:00:00",
  "purpose": "Final Year Project Presentation",
  "expectedAttendees": 25,
  "contactEmail": "user@example.com"
}

// Response (201 Created)
{
  "id": "booking-456",
  "facilityId": "123",
  "facilityName": "Computer Lab 01",
  "userId": "user-789",
  "userName": "John Doe",
  "startDateTime": "2026-04-20T10:00:00",
  "endDateTime": "2026-04-20T12:00:00",
  "purpose": "Final Year Project Presentation",
  "expectedAttendees": 25,
  "status": "PENDING",
  "createdAt": "2026-04-03T09:15:00Z",
  "_links": {
    "self": { "href": "/api/v1/bookings/booking-456" },
    "facility": { "href": "/api/v1/facilities/123" },
    "cancel": { "href": "/api/v1/bookings/booking-456", "method": "DELETE" },
    "approve": { 
      "href": "/api/v1/bookings/booking-456/approve", 
      "method": "PATCH",
      "requires": "ADMIN"
    }
  }
}
```

## Conflict Detection Logic:
- Before creating booking, query existing bookings for the facility
- Check for overlapping time ranges
- Return 409 Conflict if overlap exists

## Module C: Maintenance & Incident Ticketing
```
GET    /api/v1/tickets                            # List all tickets
GET    /api/v1/tickets/my-tickets                 # Current user's tickets
GET    /api/v1/tickets/{id}                       # Get single ticket
POST   /api/v1/tickets                            # Create ticket
PUT    /api/v1/tickets/{id}                       # Update ticket details
DELETE /api/v1/tickets/{id}                       # Delete (owner only, if OPEN)
PATCH  /api/v1/tickets/{id}/status                # Change status (ADMIN/TECH)
PATCH  /api/v1/tickets/{id}/assign                # Assign technician (ADMIN)
POST   /api/v1/tickets/{id}/comments              # Add comment
PUT    /api/v1/tickets/{id}/comments/{commentId}  # Edit comment (owner)
DELETE /api/v1/tickets/{id}/comments/{commentId}  # Delete comment (owner)
POST   /api/v1/tickets/{id}/attachments           # Upload image (max 3)
GET    /api/v1/tickets?status=OPEN&priority=HIGH&facilityId=123
```

### Workflow States: OPEN → IN_PROGRESS → RESOLVED → CLOSED / REJECTED

## Example Request:
```
// POST /api/v1/tickets
{
  "facilityId": "123",
  "category": "EQUIPMENT_FAILURE",
  "priority": "HIGH",
  "description": "Projector in Lab 01 not working - displays 'No Signal'",
  "contactEmail": "user@example.com",
  "contactPhone": "+94771234567"
}

// Response (201 Created)
{
  "id": "ticket-789",
  "ticketNumber": "TCK-2026-001234",
  "facilityId": "123",
  "facilityName": "Computer Lab 01",
  "category": "EQUIPMENT_FAILURE",
  "priority": "HIGH",
  "status": "OPEN",
  "description": "Projector in Lab 01 not working...",
  "reportedBy": "user-789",
  "reporterName": "John Doe",
  "assignedTo": null,
  "createdAt": "2026-04-03T09:30:00Z",
  "attachments": [],
  "_links": {
    "self": { "href": "/api/v1/tickets/ticket-789" },
    "facility": { "href": "/api/v1/facilities/123" },
    "comments": { "href": "/api/v1/tickets/ticket-789/comments" },
    "addAttachment": { "href": "/api/v1/tickets/ticket-789/attachments", "method": "POST" },
    "assign": { 
      "href": "/api/v1/tickets/ticket-789/assign", 
      "method": "PATCH",
      "requires": "ADMIN"
    }
  }
}
```

## Image Upload Handling:
- Use multipart/form-data
- Store in cloud storage (Cloudinary)
- Max 3 images per ticket
- Store file paths/URLs in database

## Module D: Notifications
```
GET    /api/v1/notifications                      # Get user's notifications
GET    /api/v1/notifications/unread               # Get unread count
PATCH  /api/v1/notifications/{id}/read            # Mark as read
PATCH  /api/v1/notifications/mark-all-read        # Mark all as read
DELETE /api/v1/notifications/{id}                 # Delete notification
GET    /api/v1/notifications/preferences          # Get notification settings
PATCH  /api/v1/notifications/preferences          # Update settings
```

## Notification Triggers:

- Booking approved/rejected
- Ticket status changed
- New comment on user's ticket
- Assigned to a ticket (for technicians)

## Example Response:
```
// GET /api/v1/notifications
{
  "notifications": [
    {
      "id": "notif-001",
      "type": "BOOKING_APPROVED",
      "title": "Booking Approved",
      "message": "Your booking for Computer Lab 01 has been approved",
      "relatedEntityType": "BOOKING",
      "relatedEntityId": "booking-456",
      "isRead": false,
      "createdAt": "2026-04-03T10:00:00Z",
      "_links": {
        "self": { "href": "/api/v1/notifications/notif-001" },
        "relatedEntity": { "href": "/api/v1/bookings/booking-456" },
        "markRead": { "href": "/api/v1/notifications/notif-001/read", "method": "PATCH" }
      }
    }
  ],
  "unreadCount": 5,
  "_links": {
    "self": { "href": "/api/v1/notifications" },
    "markAllRead": { "href": "/api/v1/notifications/mark-all-read", "method": "PATCH" }
  }
}
```

## Module E: User & Role Management
```
GET    /api/v1/users                              # List users (ADMIN)
GET    /api/v1/users/{id}                         # Get user profile
PUT    /api/v1/users/{id}                         # Update profile (own or ADMIN)
PATCH  /api/v1/users/{id}/role                    # Change role (ADMIN)
DELETE /api/v1/users/{id}                         # Deactivate user (ADMIN)
GET    /api/v1/roles                              # List available roles
```

## Additional Feature: Analytics Dashboard (ADMIN)
```
GET    /api/v1/analytics/overview                 # Overall statistics
GET    /api/v1/analytics/facilities/top-used      # Most booked facilities
GET    /api/v1/analytics/bookings/peak-hours      # Peak booking times
GET    /api/v1/analytics/tickets/response-time    # Average response times
GET    /api/v1/analytics/tickets/resolution-time  # Average resolution times
```

## Example Response:
```
// GET /api/v1/analytics/facilities/top-used?period=LAST_MONTH
{
  "period": "LAST_MONTH",
  "topFacilities": [
    {
      "facilityId": "123",
      "facilityName": "Computer Lab 01",
      "bookingCount": 45,
      "utilizationRate": 0.75,
      "_links": {
        "facility": { "href": "/api/v1/facilities/123" }
      }
    }
  ],
  "_links": {
    "self": { "href": "/api/v1/analytics/facilities/top-used?period=LAST_MONTH" }
  }
}
```

## Additional Feature: QR Code Check-In
```
GET    /api/v1/bookings/{id}/qr-code              # Generate QR code for booking
POST   /api/v1/bookings/check-in                  # Check-in via QR scan
GET    /api/v1/bookings/{id}/check-in-status      # Verify check-in status
```

# Database Schema Design (High-Level)

## Core Entities & Relationships

```
-- Users Table
users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE,
  password_hash VARCHAR,  -- null if OAuth-only user
  name VARCHAR,
  phone VARCHAR,
  role VARCHAR (USER, ADMIN, TECHNICIAN),
  auth_provider VARCHAR (LOCAL, GOOGLE),
  oauth_id VARCHAR,       -- Google user ID
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Facilities Table
facilities (
  id UUID PRIMARY KEY,
  name VARCHAR,
  type VARCHAR (LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT),
  capacity INT,
  location VARCHAR,
  status VARCHAR (ACTIVE, OUT_OF_SERVICE, UNDER_MAINTENANCE),
  equipment JSONB,        -- Array of equipment items
  availability_windows JSONB,  -- Array of time windows
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Bookings Table
bookings (
  id UUID PRIMARY KEY,
  facility_id UUID REFERENCES facilities(id),
  user_id UUID REFERENCES users(id),
  start_date_time TIMESTAMP,
  end_date_time TIMESTAMP,
  purpose TEXT,
  expected_attendees INT,
  contact_email VARCHAR,
  status VARCHAR (PENDING, APPROVED, REJECTED, CANCELLED),
  rejection_reason TEXT,
  approved_by UUID REFERENCES users(id),  -- Admin who approved
  approved_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT no_overlap CHECK (...)  -- Enforce conflict prevention
)

-- Tickets Table
tickets (
  id UUID PRIMARY KEY,
  ticket_number VARCHAR UNIQUE,  -- Auto-generated (TCK-2026-001234)
  facility_id UUID REFERENCES facilities(id),
  reported_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),  -- Technician
  category VARCHAR (EQUIPMENT_FAILURE, INFRASTRUCTURE, CLEANLINESS, OTHER),
  priority VARCHAR (LOW, MEDIUM, HIGH, URGENT),
  status VARCHAR (OPEN, IN_PROGRESS, RESOLVED, CLOSED, REJECTED),
  description TEXT,
  resolution_notes TEXT,
  contact_email VARCHAR,
  contact_phone VARCHAR,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  resolved_at TIMESTAMP,
  closed_at TIMESTAMP
)

-- Ticket Attachments
ticket_attachments (
  id UUID PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id),
  file_name VARCHAR,
  file_path VARCHAR,      -- URL or local path
  file_type VARCHAR,      -- image/jpeg, image/png
  uploaded_at TIMESTAMP
)

-- Comments Table (for tickets)
comments (
  id UUID PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id),
  user_id UUID REFERENCES users(id),
  content TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Notifications Table
notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR (BOOKING_APPROVED, BOOKING_REJECTED, TICKET_STATUS_CHANGE, NEW_COMMENT),
  title VARCHAR,
  message TEXT,
  related_entity_type VARCHAR (BOOKING, TICKET),
  related_entity_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP
)

-- Notification Preferences
notification_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  booking_updates BOOLEAN DEFAULT true,
  ticket_updates BOOLEAN DEFAULT true,
  comment_notifications BOOLEAN DEFAULT true,
  email_notifications BOOLEAN DEFAULT true
)
```

## Indexes for Performance
```
CREATE INDEX idx_bookings_facility_date ON bookings(facility_id, start_date_time, end_date_time);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_tickets_facility ON tickets(facility_id);
CREATE INDEX idx_tickets_assigned ON tickets(assigned_to);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read);
```

