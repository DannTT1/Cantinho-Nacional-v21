package com.cantinhonacional.dto;

public record DashboardDTO(
        long totalBooks,
        long rentedBooks,
        long availableBooks,
        double totalRevenue
) {}