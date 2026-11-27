package com.hm927.balanceapp.repository;

import org.springframework.jdbc. core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.sql.Date;
import java.util.ArrayList;

import com.hm927.balanceapp.model.Transaction;
import com.hm927.balanceapp.model.TransactionRequest;

@Repository
public class TransactionRepository {
    private final JdbcTemplate jdbcTemplate;

    public TransactionRepository(JdbcTemplate jbcTemplate) {
        this.jdbcTemplate = jbcTemplate;
    }

    public List<Transaction> search(String type, String keyword) {
        StringBuilder sql = new StringBuilder("""
        SELECT id, type, amount, transaction_date, memo
        FROM transactions
        WHERE 1 = 1
        """);

        List<Object> params = new ArrayList<>();

        if (type != null && !type.isBlank()) {
            sql.append(" AND type = ?");
            params.add(type);
        }

        if (keyword != null && !keyword.isBlank()) {
            sql.append(" AND memo LIKE ?");
            params.add("%" + keyword + "%");
        }

        sql.append(" ORDER BY transaction_date, id");

        return jdbcTemplate.query(sql.toString(), (result, rowNumber) ->
        new Transaction(
            result.getLong("id"),
            result.getString("type"),
            result.getInt("amount"),
            result.getDate("transaction_date").toLocalDate().toString(),
            result.getString("memo")
            ),
            params.toArray()
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