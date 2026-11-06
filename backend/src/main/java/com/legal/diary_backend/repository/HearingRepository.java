package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.Hearing;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HearingRepository extends JpaRepository<Hearing, Long> {
    List<Hearing> findByLegalCase_IdOrderByHearingDateAscHearingTimeAsc(Long caseId);

    List<Hearing> findByHearingDateOrderByHearingTimeAsc(LocalDate hearingDate);
}
