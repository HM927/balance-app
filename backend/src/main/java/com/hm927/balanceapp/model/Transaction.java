package com.hm927.balanceapp.model;

public record Transaction(
    long id,
    String type,
    int amount,
    String date,
    String memo
) {}