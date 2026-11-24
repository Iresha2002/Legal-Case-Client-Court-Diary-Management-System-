package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.DiaryNote;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryNoteRepository extends JpaRepository<DiaryNote, Long> {
    List<DiaryNote> findByLegalCase_IdOrderByCreatedAtDescIdDesc(Long caseId);

    List<DiaryNote> findByHearing_IdOrderByCreatedAtDescIdDesc(Long hearingId);
}
