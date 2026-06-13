package com.nelli.smart_campus_operations_hub.util;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDateTime;
import org.junit.jupiter.api.Test;

class DateTimeUtilTest {

    @Test
    void isOverlappingReturnsTrueWhenRangesIntersect() {
        LocalDateTime start1 = LocalDateTime.of(2026, 4, 10, 9, 0);
        LocalDateTime end1 = LocalDateTime.of(2026, 4, 10, 11, 0);
        LocalDateTime start2 = LocalDateTime.of(2026, 4, 10, 10, 0);
        LocalDateTime end2 = LocalDateTime.of(2026, 4, 10, 12, 0);

        assertTrue(DateTimeUtil.isOverlapping(start1, end1, start2, end2));
    }

    @Test
    void isOverlappingReturnsFalseWhenRangesTouchAtBoundary() {
        LocalDateTime start1 = LocalDateTime.of(2026, 4, 10, 9, 0);
        LocalDateTime end1 = LocalDateTime.of(2026, 4, 10, 10, 0);
        LocalDateTime start2 = LocalDateTime.of(2026, 4, 10, 10, 0);
        LocalDateTime end2 = LocalDateTime.of(2026, 4, 10, 11, 0);

        assertFalse(DateTimeUtil.isOverlapping(start1, end1, start2, end2));
    }

    @Test
    void isOverlappingReturnsFalseWhenRangesDoNotIntersect() {
        LocalDateTime start1 = LocalDateTime.of(2026, 4, 10, 9, 0);
        LocalDateTime end1 = LocalDateTime.of(2026, 4, 10, 10, 0);
        LocalDateTime start2 = LocalDateTime.of(2026, 4, 10, 11, 0);
        LocalDateTime end2 = LocalDateTime.of(2026, 4, 10, 12, 0);

        assertFalse(DateTimeUtil.isOverlapping(start1, end1, start2, end2));
    }
}
