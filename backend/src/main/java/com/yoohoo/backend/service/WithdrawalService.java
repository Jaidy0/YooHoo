package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.BankbookResponseDTO;
import com.yoohoo.backend.dto.CardResponseDTO;
import com.yoohoo.backend.entity.Withdrawal;
import com.yoohoo.backend.entity.MerchantCategory;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.File;
import com.yoohoo.backend.repository.WithdrawalRepository;
import com.yoohoo.backend.repository.MerchantCategoryRepository;
import com.yoohoo.backend.repository.DogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;

@Service
public class WithdrawalService {

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    @Autowired
    private MerchantCategoryRepository merchantCategoryRepository;

    @Autowired
    private DogRepository dogRepository;

    public void saveWithdrawal(BankbookResponseDTO response, Long shelterId) {
        BankbookResponseDTO.Transaction transaction = response.getRec().getList().get(0);

        // Check if the transaction already exists
        if (!withdrawalRepository.existsByTransactionUniqueNo(transaction.getTransactionUniqueNo())) {
            Withdrawal withdrawal = new Withdrawal();
            withdrawal.setDogId(null);
            withdrawal.setCategory("시설관리");
            withdrawal.setTransactionBalance(transaction.getTransactionBalance());
            withdrawal.setContent("인건비");
            withdrawal.setDate(transaction.getTransactionDate());
            withdrawal.setMerchantId(null);
            withdrawal.setShelterId(shelterId);
            withdrawal.setTransactionUniqueNo(transaction.getTransactionUniqueNo());

            withdrawalRepository.save(withdrawal);
        }
    }

    public void saveCardTransactions(CardResponseDTO response, Long shelterId) {
        for (CardResponseDTO.Transaction transaction : response.getRec().getTransactionList()) {
            if (!withdrawalRepository.existsByTransactionUniqueNo(transaction.getTransactionUniqueNo())) {
                Withdrawal withdrawal = new Withdrawal();
                withdrawal.setDogId(null);
                withdrawal.setCategory(transaction.getCategoryName());
                withdrawal.setTransactionBalance(transaction.getTransactionBalance());
                withdrawal.setContent(getMerchantCategory(Long.parseLong(transaction.getMerchantId())));
                withdrawal.setDate(transaction.getTransactionDate());
                withdrawal.setMerchantId(Long.parseLong(transaction.getMerchantId()));
                withdrawal.setShelterId(shelterId);
                withdrawal.setTransactionUniqueNo(transaction.getTransactionUniqueNo());

                withdrawalRepository.save(withdrawal);
            }
        }
    }

    private String getMerchantCategory(Long merchantId) {
        MerchantCategory merchantCategory = merchantCategoryRepository.findByMerchantId(merchantId);
        return merchantCategory != null ? merchantCategory.getCategory() : "Unknown";
    }

    public Optional<String> updateDogId(Long withdrawalId, Long newDogId) {
        Optional<Withdrawal> optionalWithdrawal = withdrawalRepository.findById(withdrawalId);
        if (optionalWithdrawal.isPresent()) {
            Withdrawal withdrawal = optionalWithdrawal.get();
            withdrawal.setDogId(newDogId);
            withdrawalRepository.save(withdrawal);

            Optional<Dog> optionalDog = dogRepository.findById(newDogId);
            return optionalDog.map(Dog::getName);
        }
        return Optional.empty();
    }

    public List<Map<String, Object>> getAllWithdrawals() {
        List<Withdrawal> withdrawals = withdrawalRepository.findAll();
        return withdrawals.stream().map(withdrawal -> {
            Map<String, Object> response = new HashMap<>();
            response.put("withdrawalId", withdrawal.getWithdrawalId());
            response.put("category", withdrawal.getCategory());
            response.put("transactionBalance", withdrawal.getTransactionBalance());
            response.put("date", withdrawal.getDate());
            response.put("merchantId", withdrawal.getMerchantId());
            response.put("shelterId", withdrawal.getShelterId());
            response.put("transactionUniqueNo", withdrawal.getTransactionUniqueNo());

            if (withdrawal.getDogId() == null) {
                response.put("name", "단체");
            } else {
                Optional<Dog> optionalDog = dogRepository.findById(withdrawal.getDogId());
                response.put("name", optionalDog.map(Dog::getName).orElse("Unknown"));
            }

            return response;
        }).collect(Collectors.toList());
    }

    public List<Map<String, Object>> getWithdrawalsByDogId(Long dogId) {
        List<Withdrawal> withdrawals = withdrawalRepository.findByDogId(dogId);
        return withdrawals.stream().map(withdrawal -> {
            Map<String, Object> response = new HashMap<>();
            response.put("withdrawalId", withdrawal.getWithdrawalId());
            response.put("category", withdrawal.getCategory());
            response.put("transactionBalance", withdrawal.getTransactionBalance());
            response.put("date", withdrawal.getDate());
            response.put("merchantId", withdrawal.getMerchantId());
            response.put("shelterId", withdrawal.getShelterId());
            response.put("transactionUniqueNo", withdrawal.getTransactionUniqueNo());

            if (withdrawal.getDogId() == null) {
                response.put("name", "단체");
            } else {
                Optional<Dog> optionalDog = dogRepository.findById(withdrawal.getDogId());
                response.put("name", optionalDog.map(Dog::getName).orElse("Unknown"));
            }

            return response;
        }).collect(Collectors.toList());
    }

    public Optional<String> getFileUrlByWithdrawalId(Long withdrawalId) {
        Optional<Withdrawal> optionalWithdrawal = withdrawalRepository.findById(withdrawalId);
        if (optionalWithdrawal.isPresent()) {
            Withdrawal withdrawal = optionalWithdrawal.get();
            File file = withdrawal.getFile();
            if (file != null) {
                return Optional.of(file.getFileUrl());
            }
        }
        return Optional.empty();
    }

    public Double getTotalTransactionBalanceByShelterId(Long shelterId) {
        List<Withdrawal> withdrawals = withdrawalRepository.findByShelterId(shelterId);
        return withdrawals.stream()
                .mapToDouble(withdrawal -> Double.parseDouble(withdrawal.getTransactionBalance()))
                .sum();
    }
}