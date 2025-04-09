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
    private ReliabilityService reliabilityService;

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
            response.put("content", withdrawal.getContent());
            response.put("file_id", withdrawal.getFile() != null ? withdrawal.getFile().getFileId() : null);

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

    public Map<String, Integer> getWeeklyExpenditureSumsAndPrediction(Long shelterId) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.SUNDAY);
        List<Integer> weeklySums = new ArrayList<>();

        // Calculate sums for the last 5 weeks and this week
        for (int i = 0; i < 6; i++) {
            LocalDate currentStartOfWeek = startOfWeek.minusWeeks(i); // 현재 주의 시작일
            LocalDate currentEndOfWeek = (i == 0) ? today : currentStartOfWeek.plusDays(6); // 이번 주는 오늘까지 포함

            // String으로 변환
            String startDateStr = currentStartOfWeek.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String endDateStr = currentEndOfWeek.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

            // 쿼리 실행: 5주 전부터 1주 전까지의 합계 계산
            List<Withdrawal> withdrawals = withdrawalRepository.findByShelterIdAndDateBetween(shelterId, startDateStr, endDateStr);

            // 데이터가 없을 경우, 이번 주의 경우 각 날짜별로 조회하여 합산
            if (i == 0) {
                int weeklySum = 0;
                for (int j = 0; j <= today.getDayOfMonth() - 1; j++) {
                    LocalDate currentDate = today.minusDays(j);
                    String currentDateStr = currentDate.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
                    List<Withdrawal> dailyWithdrawals = withdrawalRepository.findByShelterIdAndDateBetween(shelterId, currentDateStr, currentDateStr);
                    weeklySum += dailyWithdrawals.stream()
                            .mapToInt(withdrawal -> Integer.parseInt(withdrawal.getTransactionBalance()))
                            .sum();
                }
                weeklySums.add(weeklySum);
            } else {
                // 데이터가 여전히 없으면 0으로 설정
                int weeklySum = withdrawals.stream()
                        .mapToInt(withdrawal -> Integer.parseInt(withdrawal.getTransactionBalance()))
                        .sum();
                weeklySums.add(weeklySum);
            }
        }

        // Reverse the list to have the most recent week last
        Collections.reverse(weeklySums);

        // Exponential Smoothing for prediction
        double alpha = 0.3; // Smoothing factor
        double smoothedValue = weeklySums.get(0); // Initialize with the first week's value

        for (int i = 1; i < 5; i++) {
            smoothedValue = alpha * weeklySums.get(i) + (1 - alpha) * smoothedValue;
        }

        int prediction = (int) Math.round(smoothedValue);

        // Create a map with named keys and maintain order
        Map<String, Integer> result = new LinkedHashMap<>();
        result.put("5WeeksAgo", weeklySums.get(0));
        result.put("4WeeksAgo", weeklySums.get(1));
        result.put("3WeeksAgo", weeklySums.get(2));
        result.put("2WeeksAgo", weeklySums.get(3));
        result.put("1WeeksAgo", weeklySums.get(4));
        result.put("ThisWeek", weeklySums.get(5));
        result.put("Prediction", prediction);

        return result;
    }

    public List<Map<String, Object>> getWithdrawalsByShelterId(Long shelterId) {
        List<WithdrawalProjectionDTO> projections = withdrawalRepository.findAllByShelterIdWithProjection(shelterId);

        List<Map<String, Object>> result = new ArrayList<>();
        for (WithdrawalProjectionDTO w : projections) {
            Map<String, Object> map = new HashMap<>();
            map.put("withdrawalId", w.getWithdrawalId());
            map.put("category", w.getCategory());
            map.put("transactionBalance", w.getTransactionBalance());
            map.put("date", w.getDate());
            map.put("merchantId", w.getMerchantId());
            map.put("shelterId", w.getShelterId());
            map.put("transactionUniqueNo", w.getTransactionUniqueNo());
            map.put("file_id", w.getFileId()); // ✅ file 전체 로딩 없이 ID만 추출

            if (w.getDogId() == null) {
                map.put("name", "단체");
            } else {
                String dogName = dogRepository.findById(w.getDogId())
                        .map(d -> d.getName())
                        .orElse("Unknown");
                map.put("name", dogName);
            }

            result.add(map);
        }

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

        reliabilityService.updateShelterReliability(shelterId);
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
