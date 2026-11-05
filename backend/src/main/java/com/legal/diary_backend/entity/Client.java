package com.legal.diary_backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "clients")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Setter
    @Column(name = "nic_or_passport", nullable = false, unique = true)
    private String nicOrPassport;

    @Setter
    private String phone;

    @Setter
    private String email;

    @Setter
    @Column(columnDefinition = "text")
    private String address;

    public Client(String fullName, String nicOrPassport) {
        this.fullName = fullName;
        this.nicOrPassport = nicOrPassport;
    }
}
