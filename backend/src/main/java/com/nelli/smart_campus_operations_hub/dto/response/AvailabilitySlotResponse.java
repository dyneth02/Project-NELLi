package com.nelli.smart_campus_operations_hub.dto.response;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Minimal response DTO for approved facility bookings to be visualized in availability calendar.
 * Only returns time slot data to minimize payload size.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AvailabilitySlotResponse {

    /** Booking ID for uniqueness */
    private UUID bookingId;

    /** Facility ID being booked */
    private UUID facilityId;

    /** Booking start date-time */
    private LocalDateTime startDateTime;

    /** Booking end date-time */
    private LocalDateTime endDateTime;

    /** Booked user's name */
    private String userName;
}
