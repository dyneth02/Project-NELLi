package com.nelli.smart_campus_operations_hub.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RejectBookingRequest {

    @NotBlank
    @Size(max = 500)
    private String reason;
}
