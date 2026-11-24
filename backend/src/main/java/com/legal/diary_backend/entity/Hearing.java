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
@Table(name = "hearings")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Hearing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "case_id", nullable = false)
    private LegalCase legalCase;

    @Setter
    @Column(name = "hearing_date", nullable = false)
    private LocalDate hearingDate;

    @Setter
    @Column(name = "hearing_time", nullable = false)
    private LocalTime hearingTime;

    @Setter
    @Column(name = "court_room_no")
    private String courtRoomNo;

    @Setter
    private String judge;

    @Setter
    @Column(columnDefinition = "text")
    private String purpose;

    public Hearing(LegalCase legalCase, LocalDate hearingDate, LocalTime hearingTime) {
        this.legalCase = legalCase;
        this.hearingDate = hearingDate;
        this.hearingTime = hearingTime;
    }
}
