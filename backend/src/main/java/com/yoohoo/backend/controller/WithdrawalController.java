package com.yoohoo.backend.controller;

import com.yoohoo.backend.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/withdrawal")
public class WithdrawalController {

    @Autowired
    private WithdrawalService withdrawalService;

    @PutMapping("/{withdrawalId}/dogId")
    public ResponseEntity<Map<String, String>> updateDogId(
            @PathVariable Long withdrawalId,
            @RequestBody DogIdRequest request) {
        Optional<String> dogName = withdrawalService.updateDogId(withdrawalId, request.getNewDogId());
        Map<String, String> response = new HashMap<>();
        if (dogName.isPresent()) {
            response.put("name", dogName.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "Withdrawal not found.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAllWithdrawals() {
        List<Map<String, Object>> withdrawals = withdrawalService.getAllWithdrawals();
        return ResponseEntity.ok(withdrawals);
    }

    @GetMapping("/dog/{dogId}")
    public ResponseEntity<List<Map<String, Object>>> getWithdrawalsByDogId(@PathVariable Long dogId) {
        List<Map<String, Object>> withdrawals = withdrawalService.getWithdrawalsByDogId(dogId);
        return ResponseEntity.ok(withdrawals);
    }

    @GetMapping("/{withdrawalId}/fileUrl")
    public ResponseEntity<Map<String, String>> getFileUrlByWithdrawalId(@PathVariable Long withdrawalId) {
        Optional<String> fileUrl = withdrawalService.getFileUrlByWithdrawalId(withdrawalId);
        Map<String, String> response = new HashMap<>();
        if (fileUrl.isPresent()) {
            response.put("fileUrl", fileUrl.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("error", "File not found.");
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/shelter/total-amount")
    public ResponseEntity<Map<String, Double>> getTotalTransactionBalanceByShelterId(@RequestBody Map<String, Long> request) {
        Long shelterId = request.get("shelterId");
        if (shelterId == null) {
            return ResponseEntity.badRequest().build();
        }

        Double totalBalance = withdrawalService.getTotalTransactionBalanceByShelterId(shelterId);
        Map<String, Double> response = Map.of("totalAmount", totalBalance);
        return ResponseEntity.ok(response);
    }

    public static class DogIdRequest {
        private Long newDogId;

        public Long getNewDogId() {
            return newDogId;
        }

        public void setNewDogId(Long newDogId) {
            this.newDogId = newDogId;
        }
    }
}