package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.ActivityHistory;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityHistoryRepository extends JpaRepository<ActivityHistory, Long> {
    List<ActivityHistory> findByLegalCase_IdOrderByDateDescTimeDescIdDesc(Long caseId);

    List<ActivityHistory> findByUser_IdOrderByDateDescTimeDescIdDesc(Long userId);
}
