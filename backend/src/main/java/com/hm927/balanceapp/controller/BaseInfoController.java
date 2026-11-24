package com.hm927.balanceapp.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.hm927.balanceapp.model.Balance;
import com.hm927.balanceapp.repository.BaseInfoRepository;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class BaseInfoController {
    private final BaseInfoRepository baseInfoRepository;

    public BaseInfoController(BaseInfoRepository baseInfoRepository) {
        this.baseInfoRepository = baseInfoRepository;
    }

    @GetMapping("/base-info")
    public ResponseEntity<Balance> fetchBaseInfo() {
        return baseInfoRepository.getBaseInfo()
            .map(balance -> ResponseEntity.ok(balance))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/base-info")
    public ResponseEntity<Void> saveBaseInfo(@RequestBody Balance request) {
        baseInfoRepository.saveBaseInfo(request);
        return ResponseEntity.noContent().build();
    }
}