package com.hm927.balanceapp.model;

import java.time.LocalDate;

public record Balance(
    long balance,
    LocalDate baseDate
) {}