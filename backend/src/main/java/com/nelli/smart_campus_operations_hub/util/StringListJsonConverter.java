package com.nelli.smart_campus_operations_hub.util;

import com.fasterxml.jackson.core.type.TypeReference;
import jakarta.persistence.Converter;
import java.util.List;

/** Persists lists of strings as JSON. */
@Converter(autoApply = false)
public class StringListJsonConverter extends JsonAttributeConverter<List<String>> {

    @Override
    protected TypeReference<List<String>> typeReference() {
        return new TypeReference<>() {};
    }
}
