package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.LegalCase;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LegalCaseRepository extends JpaRepository<LegalCase, Long> {
    Optional<LegalCase> findByCaseNumber(String caseNumber);
}
