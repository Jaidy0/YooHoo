package com.yoohoo.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Optional;

import com.yoohoo.backend.entity.Dog;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DogListDTO {
    private Long dogId;
    private String name;
    private Integer status;
    private Integer age;
    private Integer gender;
    private Optional<String> imageUrl = Optional.empty();
    private Long shelterId;

    public Long getShelterId() {
        return shelterId;
    }

    public void setShelterId(Long shelterId) {
        this.shelterId = shelterId;
    }

    public static DogListDTO fromEntity(Dog dog, Optional<String> imageUrl) {
        DogListDTO dto = new DogListDTO();
        dto.setDogId(dog.getDogId());
        dto.setName(dog.getName());
        dto.setStatus(dog.getStatus());
        dto.setAge(dog.getAge());
        dto.setGender(dog.getGender());
        dto.setImageUrl(imageUrl);
        dto.setShelterId(dog.getShelter().getShelterId());
        return dto;
    }

}
