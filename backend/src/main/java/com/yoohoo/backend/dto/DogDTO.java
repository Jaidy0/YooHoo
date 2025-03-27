package com.yoohoo.backend.dto;

import com.yoohoo.backend.entity.Dog;
import com.yoohoo.backend.entity.Shelter;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Optional;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DogDTO {
    private Long dogId;
    private String name;
    private Integer age;
    private Integer weight;
    private Integer gender;
    private String breed;
    private Integer energetic;
    private Integer familiarity;
    private Boolean isVaccination;
    private Boolean isNeutered;
    private Integer status;
    private LocalDate admissionDate;
    private Optional<String> imageUrl = Optional.empty(); // ✅ Optional로 선언

    public Dog toEntity(Shelter shelter) {
        Dog dog = new Dog();
        dog.setName(this.name);
        dog.setAge(this.age);
        dog.setWeight(this.weight);
        dog.setGender(this.gender);
        dog.setBreed(this.breed);
        dog.setEnergetic(this.energetic);
        dog.setFamiliarity(this.familiarity);
        dog.setIsVaccination(this.isVaccination);
        dog.setIsNeutered(this.isNeutered);
        dog.setStatus(this.status);
        dog.setAdmissionDate(LocalDate.now());
        dog.setShelter(shelter);
        return dog;
    }

    public static DogDTO fromEntity(Dog dog , Optional<String> imageUrl) {
        DogDTO dto = new DogDTO();
        dto.setDogId(dog.getDogId());
        dto.setName(dog.getName());
        dto.setAge(dog.getAge());
        dto.setWeight(dog.getWeight());
        dto.setGender(dog.getGender());
        dto.setBreed(dog.getBreed());
        dto.setEnergetic(dog.getEnergetic());
        dto.setFamiliarity(dog.getFamiliarity());
        dto.setIsVaccination(dog.getIsVaccination());
        dto.setIsNeutered(dog.getIsNeutered());
        dto.setStatus(dog.getStatus());
        dto.setAdmissionDate(dog.getAdmissionDate());
        dto.setImageUrl(imageUrl); // ✅ Optional 전달
        return dto;
    }
    
}
