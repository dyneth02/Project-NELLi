package com.nelli.smart_campus_operations_hub.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.persistence.AttributeConverter;

/**
 * Abstract helper to convert arbitrary objects to JSON strings and back using Jackson.
 */
public abstract class JsonAttributeConverter<T> implements AttributeConverter<T, String> {

    private static final ObjectMapper MAPPER =
            new ObjectMapper()
                    .registerModule(new JavaTimeModule())
                    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @Override
    public String convertToDatabaseColumn(T attribute) {
        if (attribute == null) {
            return null;
        }
        try {
            return MAPPER.writeValueAsString(attribute);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Unable to serialize JSON attribute", e);
        }
    }

    @Override
    public T convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isBlank()) {
            return null;
        }
        try {
            return MAPPER.readValue(dbData, typeReference());
        } catch (JsonProcessingException e) {
            throw new IllegalStateException("Unable to deserialize JSON attribute", e);
        }
    }

    protected abstract TypeReference<T> typeReference();
}
