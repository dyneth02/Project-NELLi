package com.nelli.smart_campus_operations_hub.util;

import com.fasterxml.jackson.core.type.TypeReference;
import com.nelli.smart_campus_operations_hub.model.AvailabilityWindow;
import jakarta.persistence.Converter;
import java.util.List;

/** Persists availability window lists as JSON. */
@Converter(autoApply = false)
public class AvailabilityWindowListJsonConverter extends JsonAttributeConverter<List<AvailabilityWindow>> {

    @Override
    protected TypeReference<List<AvailabilityWindow>> typeReference() {
        return new TypeReference<>() {};
    }
}
