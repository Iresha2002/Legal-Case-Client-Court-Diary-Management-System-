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
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "cases")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class LegalCase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(name = "case_number", nullable = false, unique = true)
    private String caseNumber;

    @Setter
    @Column(name = "case_type", nullable = false)
    private String caseType;

    @Setter
    @Column(name = "court_name", nullable = false)
    private String courtName;

    @Setter
    private String judge;

    @Setter
    @Column(name = "court_room")
    private String courtRoom;

    @Setter
    private String defendant;

    @Setter
    @Column(nullable = false)
    private String status;

    @Setter
    @Column(name = "lifecycle_status", nullable = false)
    private String lifecycleStatus;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    public LegalCase(String caseNumber, String caseType, String courtName,
                     String status, String lifecycleStatus, Client client) {
        this.caseNumber = caseNumber;
        this.caseType = caseType;
        this.courtName = courtName;
        this.status = status;
        this.lifecycleStatus = lifecycleStatus;
        this.client = client;
    }
}
