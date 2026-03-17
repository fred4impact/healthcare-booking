package com.healthbooking.dto;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;

class PageResponseTest {

    @Test
    void constructor_setsAllFields() {
        List<String> content = List.of("a", "b");

        PageResponse<String> page = new PageResponse<>(content, 2L, 1, 20, 0);

        assertSame(content, page.content);
        assertEquals(2L, page.totalElements);
        assertEquals(1, page.totalPages);
        assertEquals(20, page.size);
        assertEquals(0, page.number);
    }
}

