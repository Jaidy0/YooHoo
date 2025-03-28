package com.yoohoo.backend.service;

import com.yoohoo.backend.entity.Donation;
import com.yoohoo.backend.dto.DonationDTO;

import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.repository.DonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Map;
import java.util.LinkedHashMap;

@Service
public class DonationService {

    @Autowired
    private DonationRepository donationRepository;

    public List<Donation> getDonationsByUserId(Long userId) {
        return donationRepository.findByUser_UserId(userId);
    }

    // 날짜 범위에 따른 후원 내역 조회
    public List<DonationDTO> getDonationsByUserIdAndDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        List<Donation> donations = donationRepository.findByUser_UserIdAndDonationDateBetween(userId, startDate, endDate);
        return donations.stream()
                .map(donation -> {
                    DonationDTO dto = new DonationDTO();
                    dto.setDonationId(donation.getDonationId());
                    dto.setDonationAmount(donation.getDonationAmount());
                    dto.setTransactionUniqueNo(donation.getTransactionUniqueNo());
                    dto.setDonationDate(donation.getDonationDate());
                    dto.setDepositorName(donation.getDepositorName());
                    dto.setCheeringMessage(donation.getCheeringMessage());
                    dto.setUserNickname(donation.getUser().getNickname());
                    dto.setDogName(donation.getDog() != null ? donation.getDog().getName() : null);
                    dto.setShelterName(donation.getShelter() != null ? donation.getShelter().getName() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<DonationDTO> getDogsByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUser_UserId(userId);
        return donations.stream()
                .map(donation -> {
                    DonationDTO dto = new DonationDTO();
                    dto.setDonationId(donation.getDonationId());
                    dto.setDonationAmount(donation.getDonationAmount());
                    dto.setTransactionUniqueNo(donation.getTransactionUniqueNo());
                    dto.setDonationDate(donation.getDonationDate());
                    dto.setDepositorName(donation.getDepositorName());
                    dto.setCheeringMessage(donation.getCheeringMessage());
                    dto.setUserNickname(donation.getUser().getNickname());
                    dto.setDogName(donation.getDog() != null ? donation.getDog().getName() : null);
                    dto.setShelterName(donation.getShelter() != null ? donation.getShelter().getName() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // Donation 객체 저장
    public void saveDonation(Donation donation) {
        donationRepository.save(donation);
    }

    // 특정 강아지에게 후원 들어온 내역 조회
    public List<DonationDTO> getDonationsByDogId(Long dogId) {
        List<Donation> donations = donationRepository.findByDog_DogId(dogId);
        return donations.stream()
                .map(donation -> {
                    DonationDTO dto = new DonationDTO();
                    dto.setDonationId(donation.getDonationId());
                    dto.setDonationAmount(donation.getDonationAmount());
                    dto.setTransactionUniqueNo(donation.getTransactionUniqueNo());
                    dto.setDonationDate(donation.getDonationDate());
                    dto.setDepositorName(donation.getDepositorName());
                    dto.setCheeringMessage(donation.getCheeringMessage());
                    dto.setUserNickname(donation.getUser().getNickname());
                    dto.setDogName(donation.getDog() != null ? donation.getDog().getName() : null);
                    dto.setShelterName(donation.getShelter() != null ? donation.getShelter().getName() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    // 유저가 후원한 단체의 이름 목록 조회
    public List<String> getShelterNamesByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUser_UserId(userId);
        return donations.stream()
                .map(donation -> donation.getShelter().getName()) // Shelter의 이름을 가져옴
                .distinct() // 중복된 이름 제거
                .collect(Collectors.toList());
    }

    // 유저가 후원한 금액 총액 조회회
    public Integer getTotalDonationAmountByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUser_UserId(userId);
        return donations.stream()
                .mapToInt(Donation::getDonationAmount) // Convert donationAmount to int and sum
                .sum(); // Calculate total
    }

    public List<DonationDTO> getDonationsByShelterId(Long shelterId) {
        List<Donation> donations = donationRepository.findByShelter_ShelterId(shelterId);
        return donations.stream()
                .map(donation -> {
                    DonationDTO dto = new DonationDTO();
                    dto.setDonationId(donation.getDonationId());
                    dto.setDonationAmount(donation.getDonationAmount());
                    dto.setTransactionUniqueNo(donation.getTransactionUniqueNo());
                    dto.setDonationDate(donation.getDonationDate());
                    dto.setDepositorName(donation.getDepositorName());
                    dto.setCheeringMessage(donation.getCheeringMessage());
                    dto.setUserNickname(donation.getUser().getNickname());
                    dto.setDogName(donation.getDog() != null ? donation.getDog().getName() : null);
                    dto.setShelterName(donation.getShelter() != null ? donation.getShelter().getName() : null);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public Integer getTotalDonationAmountByShelterId(Long shelterId) {
        List<Donation> donations = donationRepository.findByShelter_ShelterId(shelterId);
        return donations.stream()
                .mapToInt(Donation::getDonationAmount)
                .sum();
    }

    public Map<String, Integer> getWeeklyDonationSumsAndPrediction() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.SUNDAY);
        List<Integer> weeklySums = new ArrayList<>();

        // Calculate sums for the last 5 weeks and this week
        for (int i = 0; i < 6; i++) {
            LocalDate endOfWeek = startOfWeek.plusDays(6);
            int weeklySum = donationRepository.findByDonationDateBetween(startOfWeek, endOfWeek)
                    .stream()
                    .mapToInt(Donation::getDonationAmount)
                    .sum();
            weeklySums.add(weeklySum);
            startOfWeek = startOfWeek.minusWeeks(1);
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
}