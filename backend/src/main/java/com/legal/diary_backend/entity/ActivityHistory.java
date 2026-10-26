package com.legal.diary_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "activity_history")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ActivityHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(nullable = false)
    private String activity;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Setter
    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Setter
    @Column(name = "time", nullable = false)
    private LocalTime time;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "case_id")
    private LegalCase legalCase;

    @Setter
    @Column(name = "old_value", columnDefinition = "text")
    private String oldValue;

    @Setter
    @Column(name = "new_value", columnDefinition = "text")
    private String newValue;

    public ActivityHistory(String activity, User user, LocalDate date, LocalTime time) {
        this.activity = activity;
        this.user = user;
        this.date = date;
        this.time = time;
    }
}
