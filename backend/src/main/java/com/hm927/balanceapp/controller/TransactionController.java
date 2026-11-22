package com.hm927.balanceapp.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.ArrayList;

import com.hm927.balanceapp.model.Transaction;
import com.hm927.balanceapp.model.TransactionRequest;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {
    private final List<Transaction> transactions = new ArrayList<>();

    private final AtomicLong nextId = new AtomicLong(1);

	@GetMapping("/transactions")
	public List<Transaction> getTransactions() {
		return List.copyOf(transactions);
	}

    @PostMapping("/transactions")
    public void addTransaction(@RequestBody TransactionRequest request) {
        Transaction transaction = new Transaction(
            nextId.getAndIncrement(),
            request.type(),
            request.amount(),
            request.date(),
            request.memo()
        );

        transactions.add(transaction);
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable("id") long id) {
        boolean wasDeleted = transactions.removeIf(transaction -> transaction.id() == id);

    if (!wasDeleted) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.noContent().build();
    }
}
