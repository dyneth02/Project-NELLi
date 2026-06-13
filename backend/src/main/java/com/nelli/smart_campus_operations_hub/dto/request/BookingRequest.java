package com.nelli.smart_campus_operations_hub.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.nelli.smart_campus_operations_hub.enums.RecurrenceType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Builder.Default;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating bookings. The all-args constructor is {@link AccessLevel#PRIVATE} for
 * {@link lombok.Builder}; Jackson uses the no-args constructor + setters, so JSON {@code null} for
 * {@code isRecurring} maps to {@link #recurring} ({@link Boolean}) without primitive errors.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
public class BookingRequest {

    @NotNull
    private UUID facilityId;

    @NotNull
    @Future
    private LocalDateTime startDateTime;

    @NotNull
    @Future
    private LocalDateTime endDateTime;

    @NotBlank
    @Size(max = 1000)
    private String purpose;

    @Min(1)
    private Integer expectedAttendees;

    @NotBlank
    @Email
    private String contactEmail;

    /**
     * JSON property {@code isRecurring}. Nullable so clients may send {@code null}; treated as false.
     */
    @JsonProperty("isRecurring")
    @Default
    private Boolean recurring = Boolean.FALSE;

    private RecurrenceType recurrenceType;
    private LocalDate recurrenceEndDate;
    private List<DayOfWeek> recurrenceDays;

    /** Used by controllers and validation; not the Lombok-generated accessor for {@link #recurring}. */
    public boolean isRecurring() {
        return Boolean.TRUE.equals(recurring);
    }

    @AssertTrue(message = "endDateTime must be after startDateTime.")
    private boolean isEndDateAfterStartDate() {
        if (startDateTime == null || endDateTime == null) {
            return true;
        }
        return endDateTime.isAfter(startDateTime);
    }

    @AssertTrue(message = "Recurrence fields are required when isRecurring is true.")
    private boolean isRecurringFieldsValid() {
        if (!isRecurring()) {
            return true;
        }
        return recurrenceType != null && recurrenceEndDate != null && recurrenceDays != null && !recurrenceDays.isEmpty();
    }

    @AssertTrue(message = "recurrenceEndDate must be after startDateTime date.")
    private boolean isRecurrenceEndDateValid() {
        if (!isRecurring() || recurrenceEndDate == null || startDateTime == null) {
            return true;
        }
        return recurrenceEndDate.isAfter(startDateTime.toLocalDate());
    }
}
