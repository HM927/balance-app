package com.hm927.balanceapp.repository;

import org.springframework.jdbc. core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.hm927.balanceapp.model.Balance;

import java.util.Optional;

@Repository
public class BaseInfoRepository {
    private final JdbcTemplate jdbcTemplate;

    public BaseInfoRepository (JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
    
    public Optional<Balance> getBaseInfo() {
        String sql = """
        SELECT balance, base_date
        FROM base_info
        WHERE id = 1
        """;

        return jdbcTemplate.query(sql, (result, rowNumber) -> 
            new Balance(
                result.getLong("balance"),
                result.getDate("base_date").toLocalDate()
            )
        ).stream().findFirst();
    }

    public void saveBaseInfo(Balance balance) {
        String sql = """
            INSERT INTO base_info (id, balance, base_date)
            VALUES (1, ?, ?)
            ON CONFLICT (id)
            DO UPDATE SET
                balance = EXCLUDED.balance,
                base_date = EXCLUDED.base_date
        """;

        jdbcTemplate.update(
            sql,
            balance.balance(),
            java.sql.Date.valueOf(balance.baseDate())
            );
    }
}