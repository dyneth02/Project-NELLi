# API Endpoints Reference

## Base URL
`http://localhost:8080/api/v1`

## Authentication Endpoints
- POST /auth/register
- POST /auth/login
- POST /auth/google
- POST /auth/refresh-token
- GET /auth/me

## Facilities Endpoints
- GET /facilities
- GET /facilities/{id}
- POST /facilities (ADMIN)
- PUT /facilities/{id} (ADMIN)
- DELETE /facilities/{id} (ADMIN)
- GET /facilities/search

## Bookings Endpoints
- POST /bookings
- GET /bookings/my-bookings
- GET /bookings (ADMIN)
- GET /bookings/{id}
- PATCH /bookings/{id}/approve (ADMIN)
- PATCH /bookings/{id}/reject (ADMIN)
- DELETE /bookings/{id}
- POST /bookings/recurring

## Tickets Endpoints
- POST /tickets
- GET /tickets/my-tickets
- GET /tickets
- GET /tickets/{id}
- PATCH /tickets/{id}/status
- PATCH /tickets/{id}/assign (ADMIN)
- POST /tickets/{id}/comments
- POST /tickets/{id}/attachments

## Notifications Endpoints
- GET /notifications
- GET /notifications/unread
- PATCH /notifications/{id}/read
- PATCH /notifications/mark-all-read
- GET /notifications/preferences
- PATCH /notifications/preferences

## Analytics Endpoints (ADMIN)
- GET /analytics/overview
- GET /analytics/facilities/top-used
- GET /analytics/bookings/peak-hours
- GET /analytics/tickets/response-time