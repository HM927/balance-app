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
import com.hm927.balanceapp.repository.TransactionRepository;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {
    private final TransactionRepository transactionRepository;

    public TransactionController(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

	@GetMapping("/transactions")
	public List<Transaction> getTransactions() {
		return transactionRepository.findAll();
	}

    @PostMapping("/transactions")
    public void addTransaction(@RequestBody TransactionRequest request) {
        transactionRepository.insert(request);
    }

    @DeleteMapping("/transactions/{id}")
    public ResponseEntity<Void> deleteTransaction(@PathVariable("id") long id) {
        int deletedcount = transactionRepository.deleteByID(id);

    if (deletedcount == 0) {
        return ResponseEntity.notFound().build();
    }

    return ResponseEntity.noContent().build();
    }
}
