package com.cantinhonacional.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDebtDTO {
    private String userId;
    private String userName;
    private String userEmail;
    private double totalDebt;
    private long booksPending;
    private String status;
    private String livroPendente;
}