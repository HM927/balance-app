package com.hm927.balanceapp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
	public List<Transaction> getTransactions(
        @RequestParam(name = "type", required = false) String type,
        @RequestParam(name = "keyword", required = false) String keyword
        ) {
        return transactionRepository.search(type, keyword);
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
