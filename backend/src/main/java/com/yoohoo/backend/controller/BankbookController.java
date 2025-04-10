package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.BankbookResponseDTO;
import com.yoohoo.backend.dto.InquireTransactionRequest; // 추가된 import
import com.yoohoo.backend.dto.InquireTransactionResponse;
import com.yoohoo.backend.service.BankbookService;
import com.yoohoo.backend.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bankbook")
public class BankbookController {

    @Autowired
    private BankbookService bankbookService;

    @Autowired
    private WithdrawalService withdrawalService;

    @PostMapping("/withdrawal")
    public ResponseEntity<BankbookResponseDTO> inquireTransactionHistory(@RequestBody ShelterRequest shelterRequest) {
        BankbookResponseDTO response = bankbookService.inquireTransactionHistory(shelterRequest.getShelterId());
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/saveWithdrawal")
    public ResponseEntity<BankbookResponseDTO> saveAndReturnTransactionHistory(@RequestBody ShelterRequest shelterRequest) {
        BankbookResponseDTO response = bankbookService.inquireTransactionHistory(shelterRequest.getShelterId());
        if (response != null) {
            withdrawalService.saveWithdrawal(response, shelterRequest.getShelterId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/newInquireTransactionHistory")
    public ResponseEntity<InquireTransactionResponse> newInquireTransactionHistory(@RequestBody InquireTransactionRequest request) {
        InquireTransactionResponse response = bankbookService.newInquireTransactionHistory(request);
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(null);
    }

    public static class ShelterRequest {
        private Long shelterId;

        public Long getShelterId() {
            return shelterId;
        }

        public void setShelterId(Long shelterId) {
            this.shelterId = shelterId;
        }
    }
}