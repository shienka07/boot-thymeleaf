package org.example.bootthymeleaf.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data // Lombok
@Entity
public class Word {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String uuid;
    // 3글자가 안 넘었으면... (요구사항)
    @Column(nullable = false, length = 3)
    private String text;
    // 기록시간이 있었으면...
    @CreationTimestamp
//    private String createdAt; // 일시는 문자열이 가장 안전해요 근데 계산이 애매해...
    private LocalDateTime createdAt;
}
