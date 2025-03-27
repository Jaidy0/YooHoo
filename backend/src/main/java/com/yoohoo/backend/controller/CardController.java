package com.yoohoo.backend.controller;

import com.yoohoo.backend.dto.CardResponseDTO;
import com.yoohoo.backend.service.CardService;
import com.yoohoo.backend.service.WithdrawalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/card")
public class CardController {

    @Autowired
    private CardService cardService;

    @Autowired
    private WithdrawalService withdrawalService;

    @PostMapping("/withdrawal")
    public ResponseEntity<CardResponseDTO> inquireCreditCardTransactions(@RequestBody ShelterRequest shelterRequest) {
        CardResponseDTO response = cardService.inquireCreditCardTransactions(shelterRequest.getShelterId());
        return response != null ? ResponseEntity.ok(response) : ResponseEntity.badRequest().body(null);
    }

    @PostMapping("/saveWithdrawal")
    public ResponseEntity<CardResponseDTO> saveAndReturnCreditCardTransactions(@RequestBody ShelterRequest shelterRequest) {
        CardResponseDTO response = cardService.inquireCreditCardTransactions(shelterRequest.getShelterId());
        if (response != null) {
            withdrawalService.saveCardTransactions(response, shelterRequest.getShelterId());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(null);
        }
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