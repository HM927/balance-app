package com.hm927.balanceapp.repository;

import org.springframework.jdbc. core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.sql.Date;

import com.hm927.balanceapp.model.Transaction;
import com.hm927.balanceapp.model.TransactionRequest;

@Repository
public class TransactionRepository {
    private final JdbcTemplate jdbcTemplate;

    public TransactionRepository(JdbcTemplate jbcTemplate) {
        this.jdbcTemplate = jbcTemplate;
    }

    public List<Transaction> findAll() {
        String sql = """
        SELECT *
        FROM transactions
        ORDER BY transaction_date, id
        """;

        return jdbcTemplate.query(sql, (result, rowNumber) -> 
        new Transaction(
            result.getLong("id"),
            result.getString("type"),
            result.getInt("amount"),
            result.getDate("transaction_date").toLocalDate().toString(),
            result.getString("memo")
            )
        );
    }

    public void insert(TransactionRequest request) {
        String sql = """
        INSERT INTO transactions
            (type, amount, transaction_date, memo)
        VALUES (?, ?, ?, ?)
        """;

        jdbcTemplate.update(
            sql,
            request.type(),
            request.amount(),
            Date.valueOf(request.date()),
            request.memo()
        );
    }

    public int deleteByID(long id) {
        String sql = "DELETE FROM transactions WHERE id = ?";

        return jdbcTemplate.update(sql, id);
    }

}