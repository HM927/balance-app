package com.hm927.balanceapp.model;

public record TransactionRequest(
    String type,
    int amount,
    String date,
    String memo
) {}