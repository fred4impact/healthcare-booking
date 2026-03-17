package com.healthbooking.resource;

import com.healthbooking.dto.PageResponse;
import com.healthbooking.entity.Slot;
import com.healthbooking.repository.SlotRepository;
import io.quarkus.panache.common.Page;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;

import java.util.List;

@Path("/slots")
public class SlotResource {

    @Inject
    SlotRepository repository;

    @GET
    @PermitAll
    public PageResponse<Slot> slots(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        if (size <= 0) size = 20;
        if (size > 100) size = 100;
        var panachePage = repository.findAll().page(Page.of(page, size));
        return new PageResponse<>(
                panachePage.list(),
                panachePage.count(),
                panachePage.pageCount(),
                size,
                page
        );
    }
}