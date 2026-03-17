package com.healthbooking.dto;

import java.util.List;

public class PageResponse<T> {

    public List<T> content;
    public long totalElements;
    public int totalPages;
    public int size;
    public int number;

    public PageResponse(List<T> content, long totalElements, int totalPages, int size, int number) {
        this.content = content;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.size = size;
        this.number = number;
    }
}
