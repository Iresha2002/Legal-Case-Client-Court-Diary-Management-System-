package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.CaseAssignment;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CaseAssignmentRepository extends JpaRepository<CaseAssignment, Long> {
    List<CaseAssignment> findByLegalCase_Id(Long caseId);

    List<CaseAssignment> findByUser_Id(Long userId);
}
