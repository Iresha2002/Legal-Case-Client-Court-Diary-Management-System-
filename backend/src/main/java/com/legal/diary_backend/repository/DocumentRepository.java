package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.Document;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByLegalCase_IdOrderByUploadedAtDescIdDesc(Long caseId);

    List<Document> findByLegalCase_IdAndDocumentType_IdOrderByUploadedAtDescIdDesc(
            Long caseId, Long documentTypeId);
}
