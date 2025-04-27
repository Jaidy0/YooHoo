package com.yoohoo.backend.service;

import com.yoohoo.backend.dto.BankbookResponseDTO;
import com.yoohoo.backend.dto.CardResponseDTO;
import com.yoohoo.backend.dto.WithdrawalProjectionDTO;
import com.yoohoo.backend.entity.Withdrawal;
import com.yoohoo.backend.entity.MerchantCategory;
import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.File;
import com.yoohoo.backend.repository.WithdrawalRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import com.yoohoo.backend.repository.MerchantCategoryRepository;
import com.yoohoo.backend.repository.DogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.Collections;
import java.util.ArrayList;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;

@Service
@RequiredArgsConstructor
public class WithdrawalService {

    @Autowired
    private WithdrawalRepository withdrawalRepository;

    @Autowired
    private MerchantCategoryRepository merchantCategoryRepository;

    @Autowired
    private DogRepository dogRepository;

    @Autowired
    private ShelterService shelterService;

    @Transactional
    public void saveWithdrawal(BankbookResponseDTO response, Long shelterId) {
        BankbookResponseDTO.Transaction transaction = response.getRec().getList().get(0);

        // Check if the transaction already exists
        if (!withdrawalRepository.existsByTransactionUniqueNo(transaction.getTransactionUniqueNo())) {
            Withdrawal withdrawal = new Withdrawal();
            withdrawal.setDogId(null);
            withdrawal.setCategory("인건비");
            withdrawal.setTransactionBalance(transaction.getTransactionBalance());
            withdrawal.setContent("인건비");
            withdrawal.setDate(transaction.getTransactionDate());
            withdrawal.setMerchantId(null);
            withdrawal.setShelterId(shelterId);
            withdrawal.setTransactionUniqueNo(transaction.getTransactionUniqueNo());

            withdrawalRepository.save(withdrawal);
        }
    }
    @Transactional
    public void saveCardTransactions(CardResponseDTO response, Long shelterId) {
        for (CardResponseDTO.Transaction transaction : response.getRec().getTransactionList()) {
            String categoryId = transaction.getCategoryId();
            Long merchantId = Long.parseLong(transaction.getMerchantId());
            String content = getMerchantIndustryAndNameByMerchantId(merchantId);
            String category = getMerchantCategory(merchantId);


            // Check if the transaction already exists
            if (!withdrawalRepository.existsByTransactionUniqueNo(transaction.getTransactionUniqueNo())) {
                // Create or update the withdrawal object
                Withdrawal withdrawal = new Withdrawal();
                withdrawal.setContent(content);
                withdrawal.setShelterId(shelterId);
                withdrawal.setDogId(null);
                withdrawal.setCategory(category);
                withdrawal.setTransactionBalance(transaction.getTransactionBalance());
                withdrawal.setDate(transaction.getTransactionDate());
                withdrawal.setMerchantId(merchantId);
                withdrawal.setTransactionUniqueNo(transaction.getTransactionUniqueNo());

                // Save the withdrawal
                withdrawalRepository.save(withdrawal);
            } else {
                // Optionally log that the transaction already exists
                System.out.println("Transaction with unique number " + transaction.getTransactionUniqueNo() + " already exists.");
            }
        }
    }

    private String getMerchantIndustryAndName(String categoryId) {
        List<MerchantCategory> categories = merchantCategoryRepository.findByCategoryId(categoryId);
        if (!categories.isEmpty()) {
            MerchantCategory category = categories.get(0);
            return category.getIndustry() + " - " + category.getMerchantName();
        }
        return "Unknown Merchant";
    }

    private String getMerchantNameByCategoryId(String categoryId) {
        List<MerchantCategory> categories = merchantCategoryRepository.findByCategoryId(categoryId);
        if (!categories.isEmpty()) {
            return categories.get(0).getMerchantName();
        }
        return "Unknown Merchant";
    }

    private String getMerchantCategory(Long merchantId) {
        MerchantCategory merchantCategory = merchantCategoryRepository.findByMerchantId(merchantId);
        return merchantCategory != null ? merchantCategory.getCategory() : "Unknown";
    }

    private String getMerchantIndustryAndNameByMerchantId(Long merchantId) {
        MerchantCategory category = merchantCategoryRepository.findByMerchantId(merchantId);
        if (category != null) {
            return category.getIndustry() + " - " + category.getMerchantName();
        }
        return "Unknown Merchant";
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


    private Map<String, Object> mapFromWithdrawal(Withdrawal withdrawal) {
        Map<String, Object> response = new HashMap<>();
        response.put("withdrawalId", withdrawal.getWithdrawalId());
        response.put("category", withdrawal.getCategory());
        response.put("transactionBalance", withdrawal.getTransactionBalance());
        response.put("date", withdrawal.getDate());
        response.put("merchantId", withdrawal.getMerchantId());
        response.put("shelterId", withdrawal.getShelterId());
        response.put("transactionUniqueNo", withdrawal.getTransactionUniqueNo());
        response.put("content", withdrawal.getContent());
        response.put("file_id", withdrawal.getFile() != null ? withdrawal.getFile().getFileId() : null);

        if (withdrawal.getDogId() == null) {
            response.put("name", "단체");
        } else {
            response.put("name", dogRepository.findById(withdrawal.getDogId())
                    .map(Dog::getName)
                    .orElse("Unknown"));
        }
        return response;
    }


    public List<Map<String, Object>> getAllWithdrawals() {
        return withdrawalRepository.findAll().stream()
                .map(this::mapFromWithdrawal)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getWithdrawalsByShelterId(Long shelterId) {
        return withdrawalRepository.findByShelterId(shelterId).stream()
                .map(this::mapFromWithdrawal)
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> getWithdrawalsByDogId(Long dogId) {
        return withdrawalRepository.findByDogId(dogId).stream()
                .map(this::mapFromWithdrawal)
                .collect(Collectors.toList());
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

    public Map<String, Integer> getWeeklyExpenditureSumsAndPrediction(Long shelterId) {
        LocalDate today = LocalDate.now();
        
        // 이전 또는 같은 일요일 계산 (핵심 수정 부분)
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        
        List<Integer> weeklySums = new ArrayList<>();

        for (int i = 0; i < 6; i++) {
            LocalDate weekStart = startOfWeek.minusWeeks(i);
            LocalDate weekEnd = (i == 0) ? today : weekStart.plusDays(6);

            // 쿼리 실행: 주간 지출 합계 계산
            List<Withdrawal> withdrawals = withdrawalRepository.findByShelterIdAndDateBetween(shelterId, weekStart.format(DateTimeFormatter.ofPattern("yyyyMMdd")), weekEnd.format(DateTimeFormatter.ofPattern("yyyyMMdd")));
            int sum = withdrawals.stream()
                    .mapToInt(withdrawal -> Integer.parseInt(withdrawal.getTransactionBalance()))
                    .sum();
            weeklySums.add(sum);
        }

        Collections.reverse(weeklySums);

        // 예측값 계산 (최근 5주 데이터: 5WeeksAgo ~ 1WeeksAgo)
        double alpha = 0.3;
        double smoothedValue = weeklySums.get(0); // 5WeeksAgo로 초기화

        // 4WeeksAgo(1) → 1WeeksAgo(4) 순서로 반복
        for (int i = 1; i <= 4; i++) {
            smoothedValue = alpha * weeklySums.get(i) + (1 - alpha) * smoothedValue;
        }

        int prediction = (int) Math.round(smoothedValue);

        // 결과 맵 생성 (순서 유지)
        Map<String, Integer> result = new LinkedHashMap<>();
        result.put("5WeeksAgo", weeklySums.get(0)); // 5주 전
        result.put("4WeeksAgo", weeklySums.get(1));  // 4주 전
        result.put("3WeeksAgo", weeklySums.get(2));  // 3주 전
        result.put("2WeeksAgo", weeklySums.get(3));  // 2주 전
        result.put("1WeeksAgo", weeklySums.get(4));  // 1주 전
        result.put("ThisWeek", weeklySums.get(5));   // 현재 주
        result.put("Prediction", prediction);

        return result;
    }

    @Transactional
    public void syncAllWithdrawals(Long shelterId, BankbookResponseDTO bankbookResponse, CardResponseDTO cardResponse) {
        if (bankbookResponse != null && !bankbookResponse.getRec().getList().isEmpty()) {
            saveWithdrawal(bankbookResponse, shelterId); // 기존 로직 재사용
        }

        if (cardResponse != null && !cardResponse.getRec().getTransactionList().isEmpty()) {
            saveCardTransactions(cardResponse, shelterId); // 기존 로직 재사용
        }

        shelterService.getReliability(shelterId);
    }

    public List<Map<String, Object>> getCategoryPercentagesByShelterId(Long shelterId) {
        // 해당 shelter_id의 출금 내역 조회
        List<Withdrawal> shelterWithdrawals = withdrawalRepository.findByShelterId(shelterId);
        double shelterTotalBalance = shelterWithdrawals.stream()
                .mapToDouble(withdrawal -> Double.parseDouble(withdrawal.getTransactionBalance()))
                .sum();

        // 전체 출금 내역 조회
        List<Withdrawal> allWithdrawals = withdrawalRepository.findAll();
        double overallTotalBalance = allWithdrawals.stream()
                .mapToDouble(withdrawal -> Double.parseDouble(withdrawal.getTransactionBalance()))
                .sum();

        Map<String, Double> shelterCategorySums = new HashMap<>();
        for (Withdrawal withdrawal : shelterWithdrawals) {
            String category = withdrawal.getCategory().equals("Unknown") ? "기타" : withdrawal.getCategory();
            shelterCategorySums.put(category, shelterCategorySums.getOrDefault(category, 0.0) + Double.parseDouble(withdrawal.getTransactionBalance()));
        }

        Map<String, Double> overallCategorySums = new HashMap<>();
        for (Withdrawal withdrawal : allWithdrawals) {
            String category = withdrawal.getCategory().equals("Unknown") ? "기타" : withdrawal.getCategory();
            overallCategorySums.put(category, overallCategorySums.getOrDefault(category, 0.0) + Double.parseDouble(withdrawal.getTransactionBalance()));
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (String category : List.of("인건비", "의료비", "물품구매", "시설 유지비", "기타")) {
            double actualPercentage = shelterTotalBalance > 0 ? (shelterCategorySums.getOrDefault(category, 0.0) / shelterTotalBalance) * 100 : 0;
            double averagePercentage = overallTotalBalance > 0 ? (overallCategorySums.getOrDefault(category, 0.0) / overallTotalBalance) * 100 : 0;

            result.add(Map.of(
                "name", category,
                "actualPercentage", Math.round(actualPercentage * 100.0) / 100.0,
                "averagePercentage", Math.round(averagePercentage * 100.0) / 100.0
            ));
        }
        return result;
    }
}
