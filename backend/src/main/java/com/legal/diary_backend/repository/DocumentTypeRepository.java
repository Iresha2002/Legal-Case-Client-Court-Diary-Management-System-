package com.legal.diary_backend.repository;

import com.legal.diary_backend.entity.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentTypeRepository extends JpaRepository<DocumentType, Long> {
}
